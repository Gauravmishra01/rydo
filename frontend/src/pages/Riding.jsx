import React from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import Button from "../components/ui/Button";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {}; // Retrieve ride data
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRideEnded = () => {
      navigate("/home");
    };

    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate]);

  return (
    <div className="page-shell h-screen">
      <Link
        to="/home"
        className="fixed right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
        aria-label="Go home"
      >
        <i
          className="ri-home-5-line text-lg font-medium"
          aria-hidden="true"
        ></i>
      </Link>
      <div className="h-1/2">
        <LiveTracking />
      </div>
      <div className="sheet h-1/2 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <img
            className="h-12 w-12 rounded-2xl bg-slate-100 p-2"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo logo"
          />
          <div className="text-right">
            <h2 className="text-lg font-semibold capitalize text-slate-900">
              {ride?.captain?.fullname?.firstname}
            </h2>
            <h4 className="-mt-1 -mb-1 text-xl font-bold tracking-tight text-slate-900">
              {ride?.captain?.vehicle?.plate}
            </h4>
            <p className="text-sm text-slate-500">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="trip-row">
            <i className="trip-icon ri-map-pin-2-fill" aria-hidden></i>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Destination
              </p>
              <h3 className="font-semibold text-slate-900">
                {ride?.destination}
              </h3>
            </div>
          </div>
          <div className="trip-row">
            <i className="trip-icon ri-currency-line" aria-hidden></i>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Payment
              </p>
              <h3 className="font-semibold text-slate-900">₹{ride?.fare}</h3>
              <p className="text-sm text-slate-500">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Arriving soon. Keep the phone available for updates from your captain.
        </div>

        <Button
          type="button"
          variant="primary"
          ariaLabel="Make a payment"
          className="w-full mt-5"
        >
          Make a Payment
        </Button>
      </div>
    </div>
  );
};

export default Riding;
