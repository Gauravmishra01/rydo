import React from "react";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const RidePopUp = ({
  ride = {},
  setRidePopupPanel,
  setConfirmRidePopupPanel,
  confirmRide,
}) => {
  return (
    <div
      role="dialog"
      aria-labelledby="ride-popup-title"
      className="p-2 sm:p-0"
    >
      <button
        type="button"
        aria-label="Close ride popup"
        className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          setRidePopupPanel(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>
      <div className="drawer-handle" />
      <h3 id="ride-popup-title" className="section-title mb-2">
        New Ride Available
      </h3>
      <p className="section-subtitle mb-5">
        Review the passenger details and decide quickly before the ride is
        reassigned.
      </p>
      <div className="trip-row mt-4 items-center justify-between border-amber-200 bg-amber-50/90">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
            src={
              ride?.user?.avatar ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt={ride?.user?.fullname?.firstname || "User avatar"}
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {(ride?.user?.fullname?.firstname || "") +
                " " +
                (ride?.user?.fullname?.lastname || "")}
            </h2>
            <p className="text-sm text-slate-600">Passenger</p>
          </div>
        </div>
        <h5 className="text-lg font-semibold text-slate-900">2.2 km</h5>
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
      <div className="mt-5 w-full flex flex-col gap-2">
        <Button
          type="button"
          variant="primary"
          ariaLabel="Accept ride"
          onClick={() => {
            setConfirmRidePopupPanel(true);
            confirmRide();
          }}
        >
          Accept ride
        </Button>

        <Button
          type="button"
          variant="ghost"
          ariaLabel="Ignore ride"
          onClick={() => setRidePopupPanel(false)}
        >
          Ignore
        </Button>
      </div>
    </div>
  );
};

RidePopUp.propTypes = {
  ride: PropTypes.object,
  setRidePopupPanel: PropTypes.func,
  setConfirmRidePopupPanel: PropTypes.func,
  confirmRide: PropTypes.func,
};

export default RidePopUp;
