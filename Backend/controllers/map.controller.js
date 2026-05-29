const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Coordinates not found" });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    const distanceTime = await mapService.getDistanceTime(origin, destination);

    res.status(200).json(distanceTime);
  } catch (err) {
    console.error("map.controller.getDistanceTime error:", err);
    const apiMsg =
      err?.response?.data?.error_message ||
      err?.response?.data?.status ||
      err?.response?.data?.message ||
      err.message ||
      "";
    if (
      apiMsg.includes("Missing MapTiler API key") ||
      apiMsg.includes("No routes found") ||
      apiMsg.includes("No route information returned") ||
      apiMsg.includes("Unable to resolve route coordinates")
    ) {
      return res.status(400).json({ message: apiMsg });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getReverseCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const lat = Number.parseFloat(req.query.lat);
  const lng = Number.parseFloat(req.query.lng);

  try {
    const coordinates = await mapService.getReverseCoordinate(lat, lng);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({ message: "Address not found" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await mapService.getAutoCompleteSuggestions(input);

    res.status(200).json(suggestions);
  } catch (err) {
    console.error("map.controller.getAutoCompleteSuggestions error:", err);
    const apiMsg =
      err?.response?.data?.error_message ||
      err?.response?.data?.status ||
      err?.response?.data?.message ||
      err.message ||
      "";
    if (
      apiMsg.includes("Missing MapTiler API key") ||
      apiMsg.includes("No coordinates found") ||
      apiMsg.includes("Unable to fetch coordinates")
    ) {
      return res.status(400).json({ message: apiMsg });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.validateKey = async (req, res, next) => {
  try {
    const apiKey = process.env.MAPTILER_API_KEY;
    if (!apiKey) {
      return res
        .status(400)
        .json({ message: "Missing server MAPTILER_API_KEY key" });
    }

    try {
      const result = await mapService.getAddressCoordinate("New York");
      return res.status(200).json({ ok: true, test: result });
    } catch (err) {
      const msg = err?.message || "MapTiler API error";
      return res.status(400).json({ message: msg });
    }
  } catch (err) {
    console.error("map.controller.validateKey error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
