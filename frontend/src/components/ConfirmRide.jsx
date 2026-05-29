import React from "react";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const ConfirmRide = ({
  pickup,
  destination,
  fare = {},
  vehicleType,
  setConfirmRidePanel,
  setVehicleFound,
  createRide,
}) => {
  return (
    <div>
      <button
        type="button"
        aria-label="Close confirm ride panel"
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setConfirmRidePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </button>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-20"
          src="/src/assets/rydo-logo.svg"
          alt="Selected vehicle"
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill" aria-hidden></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill" aria-hidden></i>
            <div>
              <h3 className="text-lg font-medium">Dropoff</h3>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line" aria-hidden></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare[vehicleType]}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          ariaLabel="Confirm ride"
          onClick={() => {
            setVehicleFound(true);
            setConfirmRidePanel(false);
            createRide();
          }}
          className="w-full mt-5"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

ConfirmRide.propTypes = {
  pickup: PropTypes.string,
  destination: PropTypes.string,
  fare: PropTypes.object,
  vehicleType: PropTypes.string,
  setConfirmRidePanel: PropTypes.func.isRequired,
  setVehicleFound: PropTypes.func.isRequired,
  createRide: PropTypes.func.isRequired,
};

export default ConfirmRide;
