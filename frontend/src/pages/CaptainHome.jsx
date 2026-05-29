import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!captain?._id) return;

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("update-location-captain", {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();
    socket.on("new-ride", handleNewRide);

    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride", handleNewRide);
    };
  }, [socket, captain?._id]);

  async function confirmRide() {
    if (!ride?._id) return;

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      gsap.to(ridePopupPanelRef.current, {
        transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [ridePopupPanel],
  );

  useGSAP(
    function () {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [confirmRidePopupPanel],
  );

  return (
    <div className="page-shell min-h-screen">
      <div className="container relative flex min-h-screen flex-col gap-6 px-3 py-4 sm:px-4 lg:px-6">
        <header className="surface sticky top-3 z-20 flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-2xl bg-slate-100 p-2"
              src="/src/assets/rydo-logo.svg"
              alt="Rydo"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Captain dashboard
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Welcome back
              </h1>
            </div>
          </div>
          <Link
            to="/captain/logout"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:-translate-y-0.5"
          >
            <i className="ri-logout-box-r-line text-lg" aria-hidden></i>
          </Link>
        </header>

        <section className="auth-hero flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="floating-chip mb-5">
              <i className="ri-signal-tower-line" aria-hidden></i>
              Online and ready
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Keep the city moving with responsive ride dispatch.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
              View incoming requests, update your status, and manage trips from
              a polished captain console that works beautifully on desktop and
              mobile.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[34rem] lg:flex-shrink-0">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Availability
              </p>
              <h3 className="mt-2 text-lg font-semibold">Online now</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Nearby rides
              </p>
              <h3 className="mt-2 text-lg font-semibold">Live alerts</h3>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                Mileage
              </p>
              <h3 className="mt-2 text-lg font-semibold">Optimized routes</h3>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <h3 className="section-title mt-1 text-2xl">
                  Stay active to receive requests
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                Accepting rides
              </span>
            </div>
            <p className="section-subtitle max-w-xl">
              Keep the app open and your location active so nearby riders can
              find you quickly.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="trip-row bg-slate-50">
                <i className="trip-icon ri-time-line" aria-hidden></i>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Today
                  </p>
                  <h4 className="font-semibold text-slate-900">12 trips</h4>
                </div>
              </div>
              <div className="trip-row bg-slate-50">
                <i className="trip-icon ri-coin-line" aria-hidden></i>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Earnings
                  </p>
                  <h4 className="font-semibold text-slate-900">₹295.20</h4>
                </div>
              </div>
              <div className="trip-row bg-slate-50">
                <i className="trip-icon ri-navigation-line" aria-hidden></i>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Efficiency
                  </p>
                  <h4 className="font-semibold text-slate-900">4.9 rating</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-5 sm:p-6">
            <CaptainDetails />
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Workflow
            </p>
            <h4 className="mt-1 text-lg font-semibold text-slate-900">
              Accept, confirm, complete
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              The ride flow is tuned for fast actions and minimal friction.
            </p>
          </div>
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Map
            </p>
            <h4 className="mt-1 text-lg font-semibold text-slate-900">
              MapTiler powered live tracking
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Vehicle updates and rider movement stay synced in real time.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        </div>
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed inset-x-0 bottom-0 z-10 translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <ConfirmRidePopUp
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
