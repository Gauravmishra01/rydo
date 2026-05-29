import React from "react";
import PropTypes from "prop-types";
import Skeleton from "./ui/Skeleton";

const LookingForDriver = ({
  pickup,
  destination,
  fare = {},
  vehicleType,
  setVehicleFound,
}) => {
  return (
    <div role="status" aria-live="polite" className="p-2 sm:p-0">
      <button
        type="button"
        aria-label="Close looking for driver"
        className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          setVehicleFound(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>
      <div className="drawer-handle" />
      <h3 className="section-title mb-2">Looking for a driver</h3>
      <p className="section-subtitle mb-5">
        We’re checking nearby captains and matching your ride request now.
      </p>

      <div className="flex flex-col items-center gap-2 justify-between">
        <img
          className="h-20"
          src="/src/assets/rydo-logo.svg"
          alt="Selected vehicle"
        />
        <div className="w-full mt-5 grid gap-3">
          <div className="trip-row">
            <i className="trip-icon ri-map-pin-user-fill" aria-hidden></i>
            <div>
              <h3 className="font-semibold text-slate-900">Pickup</h3>
              <p className="text-sm text-slate-500">{pickup}</p>
            </div>
          </div>
          <div className="trip-row">
            <i className="trip-icon ri-map-pin-2-fill" aria-hidden></i>
            <div>
              <h3 className="font-semibold text-slate-900">Dropoff</h3>
              <p className="text-sm text-slate-500">{destination}</p>
            </div>
          </div>
          <div className="trip-row">
            <i className="trip-icon ri-currency-line" aria-hidden></i>
            <div>
              <h3 className="font-semibold text-slate-900">
                ₹{fare[vehicleType]}
              </h3>
              <p className="text-sm text-slate-500">Cash payment</p>
            </div>
          </div>
        </div>
        <div className="w-full mt-4">
          <Skeleton height="56px" rounded="999px" />
        </div>
      </div>
    </div>
  );
};

LookingForDriver.propTypes = {
  pickup: PropTypes.string,
  destination: PropTypes.string,
  fare: PropTypes.object,
  vehicleType: PropTypes.string,
  setVehicleFound: PropTypes.func,
};

export default LookingForDriver;
