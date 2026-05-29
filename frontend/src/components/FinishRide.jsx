import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FinishRide = (props) => {
  const navigate = useNavigate();

  async function endRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: props.ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (response.status === 200) {
      navigate("/captain-home");
    }
  }

  return (
    <div className="p-2 sm:p-0">
      <button
        type="button"
        aria-label="Close finish ride"
        className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>
      <div className="drawer-handle" />
      <h3 className="section-title mb-2">Finish this ride</h3>
      <p className="section-subtitle mb-5">
        Confirm the trip is complete and settle the fare with the passenger.
      </p>
      <div className="trip-row mt-4 items-center justify-between border-amber-200 bg-amber-50/90">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
            src={
              props.ride?.user?.avatar ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt={props.ride?.user?.fullname?.firstname || "User avatar"}
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {props.ride?.user?.fullname?.firstname}
            </h2>
            <p className="text-sm text-slate-500">Passenger</p>
          </div>
        </div>
        <h5 className="text-lg font-semibold text-slate-900">2.2 km</h5>
      </div>
      <div className="mt-5 grid gap-3">
        <div className="trip-row">
          <i className="trip-icon ri-map-pin-user-fill" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">Pickup</h3>
            <p className="text-sm text-slate-500">{props.ride?.pickup}</p>
          </div>
        </div>
        <div className="trip-row">
          <i className="trip-icon ri-map-pin-2-fill" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">Dropoff</h3>
            <p className="text-sm text-slate-500">{props.ride?.destination}</p>
          </div>
        </div>
        <div className="trip-row">
          <i className="trip-icon ri-currency-line" aria-hidden></i>
          <div>
            <h3 className="font-semibold text-slate-900">
              ₹{props.ride?.fare}
            </h3>
            <p className="text-sm text-slate-500">Cash payment</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={endRide}
          className="btn btn-primary w-full"
        >
          Finish ride
        </button>
      </div>
    </div>
  );
};

FinishRide.propTypes = {
  ride: PropTypes.object,
  setFinishRidePanel: PropTypes.func,
};

export default FinishRide;
