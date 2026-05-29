import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import Button from "../components/ui/Button";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const pickupDebounceRef = useRef(null);
  const destinationDebounceRef = useRef(null);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [suggestionError, setSuggestionError] = useState(null);
  const [serverApiStatus, setServerApiStatus] = useState(null);
  const pickupCoordsRef = useRef(null);
  const destinationCoordsRef = useRef(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    // Check server-side MapTiler API key status (if logged in)
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const base = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
        const resp = await fetch(`${base}/maps/validate-key`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          setServerApiStatus({ ok: true, msg: "Server MapTiler API OK" });
        } else {
          const err = await resp
            .json()
            .catch(() => ({ message: "Server MapTiler API invalid" }));
          setServerApiStatus({
            ok: false,
            msg: err.message || JSON.stringify(err),
          });
        }
      } catch (e) {
        setServerApiStatus({
          ok: false,
          msg: e.message || "Unable to validate server API",
        });
      }
    })();

    if (!user?._id) {
      return;
    }

    const handleRideConfirmed = (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    const handleRideStarted = (ride) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
    };

    socket.emit("join", { userType: "user", userId: user._id });
    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, user?._id, navigate]);

  useEffect(() => {
    return () => {
      if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current);
      if (destinationDebounceRef.current) {
        clearTimeout(destinationDebounceRef.current);
      }
    };
  }, []);

  const getSuggestionCoordinates = (suggestion) => {
    if (!suggestion || typeof suggestion === "string") return null;

    const ltd = suggestion.ltd ?? suggestion.lat ?? suggestion.latitude;
    const lng = suggestion.lng ?? suggestion.longitude;

    if (typeof ltd !== "number" || typeof lng !== "number") return null;
    return { ltd, lng };
  };

  const fetchSuggestions = async (value, setter) => {
    try {
      const base = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
      const response = await axios.get(`${base}/maps/get-suggestions`, {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuggestionError(null);
      setter(response.data || []);
    } catch (error) {
      setter([]);
      setSuggestionError(
        error?.response?.data?.message ||
          error.message ||
          "Unable to fetch suggestions",
      );
    }
  };

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    setPickupSuggestions([]);
    if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current);
    if (!value || value.length < 3) return;
    pickupDebounceRef.current = setTimeout(async () => {
      await fetchSuggestions(value, setPickupSuggestions);
    }, 300);
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    setDestinationSuggestions([]);
    if (destinationDebounceRef.current)
      clearTimeout(destinationDebounceRef.current);
    if (!value || value.length < 3) return;
    destinationDebounceRef.current = setTimeout(async () => {
      await fetchSuggestions(value, setDestinationSuggestions);
    }, 300);
  };

  // Handle selection from suggestions (works with objects from places or plain strings)
  const handleSelectSuggestion = (suggestion) => {
    // suggestion may be string or object { description, place_id }
    if (!suggestion) return;
    if (typeof suggestion === "string") {
      if (activeField === "pickup") setPickup(suggestion);
      else setDestination(suggestion);
      setPanelOpen(false);
      return;
    }

    const coordinates = getSuggestionCoordinates(suggestion);
    const description = suggestion.description || suggestion.place_name || "";

    if (activeField === "pickup") {
      setPickup(description);
      pickupCoordsRef.current = coordinates;
      setPickupSuggestions([]);
    } else {
      setDestination(description);
      destinationCoordsRef.current = coordinates;
      setDestinationSuggestions([]);
    }

    setSuggestionError(null);
    setPanelOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen],
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel],
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel],
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound],
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);
    setApiError(null);

    try {
      // prefer sending coordinates if available to backend
      const pickupParam = pickupCoordsRef.current
        ? `${pickupCoordsRef.current.ltd ?? pickupCoordsRef.current.lat ?? pickupCoordsRef.current.latitude},${pickupCoordsRef.current.lng ?? pickupCoordsRef.current.longitude}`
        : pickup;
      const destinationParam = destinationCoordsRef.current
        ? `${destinationCoordsRef.current.ltd ?? destinationCoordsRef.current.lat ?? destinationCoordsRef.current.latitude},${destinationCoordsRef.current.lng ?? destinationCoordsRef.current.longitude}`
        : destination;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup: pickupParam, destination: destinationParam },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setFare(response.data);
    } catch (error) {
      setFare({});
      setVehiclePanel(false);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Unable to fetch fare";

      // If MapTiler is unavailable on the server, fall back to a local estimate when we have coords
      const clientIndicators = [
        "Missing MapTiler API key",
        "No route information returned",
        "Unable to resolve route coordinates",
        "No coordinates found for the given address",
      ];
      const serverMsg =
        error?.response?.data?.message || error?.response?.data || "";
      if (
        typeof serverMsg === "string" &&
        clientIndicators.some((s) => serverMsg.includes(s)) &&
        pickupCoordsRef.current &&
        destinationCoordsRef.current
      ) {
        // approximate Haversine distance and estimate duration
        const toRad = (v) => (v * Math.PI) / 180;
        const p1 = pickupCoordsRef.current;
        const p2 = destinationCoordsRef.current;
        const lat1 = p1.lat || p1.ltd || p1.latitude;
        const lon1 = p1.lng || p1.longitude;
        const lat2 = p2.lat || p2.ltd || p2.latitude;
        const lon2 = p2.lng || p2.longitude;
        const R = 6371e3; // meters
        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lon2 - lon1);
        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = R * c;
        // assume average speed 30 km/h -> 8.333... m/s
        const avgSpeedMps = (30 * 1000) / 3600;
        const durationSeconds = Math.max(60, distanceMeters / avgSpeedMps);

        const element = {
          distance: {
            value: Math.round(distanceMeters),
            text: `${(distanceMeters / 1000).toFixed(2)} km`,
          },
          duration: {
            value: Math.round(durationSeconds),
            text: `${Math.round(durationSeconds / 60)} mins`,
          },
          status: "OK",
        };

        // local fare calc mirroring backend rates
        const baseFare = { auto: 30, car: 50, moto: 20 };
        const perKmRate = { auto: 10, car: 15, moto: 8 };
        const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

        const localFare = {
          auto: Math.round(
            baseFare.auto +
              (element.distance.value / 1000) * perKmRate.auto +
              (element.duration.value / 60) * perMinuteRate.auto,
          ),
          car: Math.round(
            baseFare.car +
              (element.distance.value / 1000) * perKmRate.car +
              (element.duration.value / 60) * perMinuteRate.car,
          ),
          moto: Math.round(
            baseFare.moto +
              (element.distance.value / 1000) * perKmRate.moto +
              (element.duration.value / 60) * perMinuteRate.moto,
          ),
        };

        setFare(localFare);
        setApiError(`Calculated locally: ${serverMsg}`);
        return;
      }

      setApiError(msg);
    }
  }

  async function createRide() {
    const pickupCoordinates = pickupCoordsRef.current;
    const destinationCoordinates = destinationCoordsRef.current;

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
        pickupCoordinates: pickupCoordinates
          ? {
              ltd:
                pickupCoordinates.ltd ??
                pickupCoordinates.lat ??
                pickupCoordinates.latitude,
              lng: pickupCoordinates.lng ?? pickupCoordinates.longitude,
            }
          : undefined,
        destinationCoordinates: destinationCoordinates
          ? {
              ltd:
                destinationCoordinates.ltd ??
                destinationCoordinates.lat ??
                destinationCoordinates.latitude,
              lng:
                destinationCoordinates.lng ?? destinationCoordinates.longitude,
            }
          : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  return (
    <div className="page-shell h-screen relative overflow-hidden">
      <div className="absolute left-4 top-4 z-20 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur">
        <img
          className="h-10 w-10"
          src="/src/assets/rydo-logo.svg"
          alt="Rydo logo"
        />
      </div>
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-3 sm:p-4 lg:p-6">
        <div className="sheet p-5 sm:p-6">
          <div className="drawer-handle" />
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute right-5 top-5 opacity-0 text-2xl text-slate-500 transition hover:text-slate-900"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <span className="floating-chip bg-slate-900 text-white">
                <i className="ri-map-pin-2-line" aria-hidden></i>
                Trip planner
              </span>
              <h4 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Find a trip
              </h4>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 sm:block">
              Live fare estimates
            </div>
          </div>
          {apiError && (
            <div className="mt-2 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}
          {serverApiStatus && (
            <div
              className={`mt-2 rounded-2xl px-4 py-3 text-sm ${serverApiStatus.ok ? "border border-emerald-100 bg-emerald-50/90 text-emerald-700" : "border border-red-100 bg-red-50/90 text-red-700"}`}
            >
              {serverApiStatus.msg}
            </div>
          )}
          <form
            className="relative mt-4 space-y-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute left-5 top-[1.55rem] h-[4.4rem] w-[2px] -translate-y-1/2 rounded-full bg-slate-200"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="input pl-12"
              aria-label="Pickup location"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="input pl-12"
              aria-label="Destination"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <div className="mt-5">
            <Button
              onClick={findTrip}
              variant="primary"
              ariaLabel="Find Trip"
              disabled={!pickup || !destination}
            >
              Find Trip
            </Button>
          </div>
        </div>
        <div ref={panelRef} className="sheet h-0 overflow-hidden">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={(s) => handleSelectSuggestion(s)}
            setDestination={(s) => handleSelectSuggestion(s)}
            activeField={activeField}
            error={suggestionError}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <LookingForDriver
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed inset-x-0 bottom-0 z-10 bg-white px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <WaitingForDriver
            ride={ride}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
