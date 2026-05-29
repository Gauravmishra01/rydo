import React from "react";
import PropTypes from "prop-types";

const LocationSearchPanel = ({
  suggestions = [],
  setPanelOpen,
  setPickup,
  setDestination,
  activeField,
  error,
}) => {
  const title =
    activeField === "pickup" ? "Pickup suggestions" : "Destination suggestions";

  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") setPickup(suggestion);
    else if (activeField === "destination") setDestination(suggestion);
    if (typeof setPanelOpen === "function") setPanelOpen(false);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="panel p-4 text-sm text-red-700 border border-red-100 bg-red-50/80">
          {error}
        </div>
      </div>
    );
  }

  const list = suggestions || [];
  if (list.length === 0) {
    return (
      <div className="p-4">
        <div className="panel p-4 text-sm text-slate-500 bg-white/80">
          No suggestions found. Try a different street, landmark, or city.
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-3 pt-1">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span>{title}</span>
        <span>{list.length} results</span>
      </div>
      {list.map((elem, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => handleSuggestionClick(elem)}
          className="trip-row my-2 w-full text-left transition hover:border-[#ff6a66]/30 hover:shadow-md"
        >
          <span className="trip-icon" aria-hidden>
            <i className="ri-map-pin-fill"></i>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900">
              {elem?.description || elem}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              Tap to use this location
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

LocationSearchPanel.propTypes = {
  suggestions: PropTypes.array,
  setPanelOpen: PropTypes.func,
  setPickup: PropTypes.func,
  setDestination: PropTypes.func,
  activeField: PropTypes.string,
  error: PropTypes.string,
};

export default LocationSearchPanel;
