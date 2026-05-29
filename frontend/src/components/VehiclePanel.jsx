import React from "react";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const VehiclePanel = ({
  selectVehicle,
  fare = {},
  setConfirmRidePanel,
  setVehiclePanel,
}) => {
  const vehicles = [
    {
      key: "car",
      title: "RydoGo",
      subtitle: "Affordable, compact rides",
      eta: "2 mins away",
      capacity: 4,
      fare: fare.car,
    },
    {
      key: "moto",
      title: "RydoMoto",
      subtitle: "Quick solo trips",
      eta: "3 mins away",
      capacity: 1,
      fare: fare.moto,
    },
    {
      key: "auto",
      title: "RydoAuto",
      subtitle: "Balanced comfort and value",
      eta: "3 mins away",
      capacity: 3,
      fare: fare.auto,
    },
  ];

  return (
    <div className="p-2 sm:p-0">
      <button
        type="button"
        aria-label="Close vehicle panel"
        className="p-1 text-center absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          setVehiclePanel(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>
      <div className="drawer-handle" />
      <h3 className="section-title mb-2">Choose a vehicle</h3>
      <p className="section-subtitle mb-5">
        Compare ride types by comfort, speed, and price before confirming.
      </p>
      <div className="grid gap-3">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.key}
            type="button"
            onClick={() => {
              setConfirmRidePanel(true);
              selectVehicle(vehicle.key);
            }}
            className="trip-row w-full items-center justify-between text-left transition hover:border-[#ff6a66]/30 hover:shadow-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                className="h-12 w-12 rounded-2xl object-cover"
                src="/src/assets/rydo-logo.svg"
                alt={vehicle.title}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-slate-900">
                    {vehicle.title}
                  </h4>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {vehicle.capacity} seats
                  </span>
                </div>
                <p className="text-sm text-slate-500">{vehicle.eta}</p>
                <p className="text-xs text-slate-500">{vehicle.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-900">
                ₹{vehicle.fare}
              </div>
              <div className="text-xs text-slate-500">Est. fare</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

VehiclePanel.propTypes = {
  selectVehicle: PropTypes.func.isRequired,
  fare: PropTypes.object,
  setConfirmRidePanel: PropTypes.func.isRequired,
  setVehiclePanel: PropTypes.func,
};

export default VehiclePanel;
