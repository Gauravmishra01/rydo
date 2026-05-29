import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel],
  );

  return (
    <div className="page-shell h-screen relative flex flex-col justify-end">
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-4">
        <div className="rounded-full bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
          <img
            className="h-10 w-10"
            src="/src/assets/rydo-logo.svg"
            alt="Rydo"
          />
        </div>
        <Link
          to="/captain-home"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition hover:-translate-y-0.5"
          aria-label="Back to captain home"
        >
          <i className="ri-home-5-line text-lg font-medium" aria-hidden></i>
        </Link>
      </div>

      <div className="fixed inset-x-0 top-16 z-10 px-3 sm:px-4 lg:px-6">
        <div
          className="panel p-4 sm:p-5"
          onClick={() => setFinishRidePanel(true)}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Trip progress
              </p>
              <h4 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                4 km away
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Tap to finish the ride once the passenger arrives.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFinishRidePanel(true)}
              className="btn btn-primary w-auto px-6"
            >
              Complete ride
            </button>
          </div>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed inset-x-0 bottom-0 z-[500] translate-y-full px-3 pb-3 pt-12 sm:px-4 lg:px-6"
      >
        <div className="sheet max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
        </div>
      </div>

      <div className="absolute inset-0 z-[-1]">
        <LiveTracking />
      </div>
    </div>
  );
};

export default CaptainRiding;
