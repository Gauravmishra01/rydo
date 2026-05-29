import React from "react";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const WaitingForDriver = ({
  ride = {},
  setVehicleFound,
  waitingForDriver,
  setWaitingForDriver,
}) => {
  return (
    <div className="p-2 sm:p-0">
      <button
        type="button"
        aria-label="Close waiting panel"
        className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          setWaitingForDriver(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>

      <div className="drawer-handle" />
      <h3 className="section-title mb-2">Waiting for your driver</h3>
      <p className="section-subtitle mb-5">
        Your captain has been notified. You’ll get an update as soon as they
        accept.
      </p>

      <div className="trip-row items-center justify-between">
        <img
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
          src={ride?.captain?.avatar || "/src/assets/rydo-logo.svg"}
          alt={ride?.captain?.fullname?.firstname || "Captain"}
        />
        <div className="ml-auto text-right">
          <h2 className="text-lg font-semibold capitalize text-slate-900">
            {ride?.captain?.fullname?.firstname}
          </h2>
          <h4 className="text-xl font-bold tracking-tight text-slate-900">
            {ride?.captain?.vehicle?.plate}
          </h4>
          <p className="text-sm text-slate-500">Maruti Suzuki Alto</p>
          <h1 className="mt-1 text-lg font-semibold text-[#ff3d81]">
            {ride?.otp}
          </h1>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="trip-row">
          <i className="trip-icon ri-map-pin-user-fill" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">Pickup</h3>
            <p className="text-sm text-slate-500">{ride?.pickup}</p>
          </div>
        </div>
        <div className="trip-row">
          <i className="trip-icon ri-map-pin-2-fill" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">Dropoff</h3>
            <p className="text-sm text-slate-500">{ride?.destination}</p>
          </div>
        </div>
        <div className="trip-row">
          <i className="trip-icon ri-currency-line" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">₹{ride?.fare}</h3>
            <p className="text-sm text-slate-500">Cash payment</p>
          </div>
        </div>
      </div>
      <div className="w-full mt-5">
        <Button
          variant="ghost"
          ariaLabel="Cancel ride"
          onClick={() => setWaitingForDriver(false)}
        >
          Cancel ride
        </Button>
      </div>
    </div>
  );
};

WaitingForDriver.propTypes = {
  ride: PropTypes.object,
  setWaitingForDriver: PropTypes.func,
};

export default WaitingForDriver;
