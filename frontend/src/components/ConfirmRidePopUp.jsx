import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHander = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate("/captain-riding", { state: { ride: props.ride } });
      }
    } catch (err) {
      console.error("start ride error:", err);
    }
  };
  return (
    <div className="p-2 sm:p-0">
      <button
        type="button"
        aria-label="Close confirm ride popup"
        className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-line"></i>
      </button>
      <div className="drawer-handle" />
      <h3 className="section-title mb-2">Confirm this ride to Start</h3>
      <p className="section-subtitle mb-5">
        Verify the OTP with the passenger before starting the trip.
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
            <h2 className="truncate text-lg font-semibold capitalize text-slate-900">
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

      <div className="mt-6 w-full">
        <form onSubmit={submitHander} className="space-y-3">
          <label htmlFor="otp" className="label">
            OTP
          </label>
          <input
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            inputMode="numeric"
            className="input font-mono text-lg tracking-[0.35em] text-center"
            placeholder="••••••"
            aria-label="Enter ride OTP"
            autoComplete="one-time-code"
          />

          <Button type="submit" variant="primary" ariaLabel="Confirm ride">
            Confirm ride
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              props.setConfirmRidePopupPanel(false);
              props.setRidePopupPanel(false);
            }}
            ariaLabel="Cancel"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;

ConfirmRidePopUp.propTypes = {
  ride: PropTypes.object,
  setConfirmRidePopupPanel: PropTypes.func,
  setRidePopupPanel: PropTypes.func,
};
