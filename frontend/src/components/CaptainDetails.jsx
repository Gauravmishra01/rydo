import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CapatainContext";
import PropTypes from "prop-types";
import Button from "./ui/Button";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  const stats = [
    { label: "Hours Online", value: "10.2", icon: "ri-timer-2-line" },
    { label: "Trips Completed", value: "148", icon: "ri-speed-up-line" },
    { label: "Rating", value: "4.9", icon: "ri-booklet-line" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <img
            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
            src={
              captain?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
            }
            alt={captain?.fullname?.firstname || "Captain"}
          />
          <div className="min-w-0">
            <h4 className="truncate text-lg font-semibold capitalize text-slate-900">
              {(captain?.fullname?.firstname || "") +
                " " +
                (captain?.fullname?.lastname || "")}
            </h4>
            <p className="text-sm text-slate-500">Captain</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-semibold tracking-tight text-slate-900">
            ₹295.20
          </h4>
          <p className="text-sm text-slate-500">Earned today</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="panel p-4 text-center">
            <i
              className={`mb-3 block text-3xl text-[#ff3d81] ${stat.icon}`}
              aria-hidden
            ></i>
            <h5 className="text-lg font-semibold text-slate-900">
              {stat.value}
            </h5>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        ariaLabel="Go offline"
        className="w-full sm:w-auto"
      >
        Go offline
      </Button>
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Keep the app open to receive new ride requests in real time.
      </div>
    </div>
  );
};

CaptainDetails.propTypes = {
  // reads captain from context
};

export default CaptainDetails;
