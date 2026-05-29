const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;
  const pickupCoordinates = req.body.pickupCoordinates;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });
    res.status(201).json(ride);

    const resolvedPickupCoordinates =
      pickupCoordinates &&
      typeof pickupCoordinates.ltd === "number" &&
      typeof pickupCoordinates.lng === "number"
        ? pickupCoordinates
        : await mapService.getAddressCoordinate(pickup);

    const captainsInRadius = await mapService.getCaptainsInTheRadius(
      resolvedPickupCoordinates.ltd,
      resolvedPickupCoordinates.lng,
      2,
    );

    ride.otp = "";

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    // Distinguish client-side issues (bad input, missing API key, no routes) from server errors
    const apiMsg =
      (err &&
        (err.response?.data?.error_message ||
          err.response?.data?.message ||
          err.response?.data?.status)) ||
      err?.message ||
      "";

    const clientIndicators = [
      "Missing MapTiler API key",
      "Origin and destination are required",
      "No route information returned",
      "No coordinates found for the given address",
      "Unable to resolve route coordinates",
      "No address found for the provided coordinates",
    ];

    if (
      typeof apiMsg === "string" &&
      clientIndicators.some((s) =>
        apiMsg.toLowerCase().includes(s.toLowerCase()),
      )
    ) {
      console.warn("ride.controller.getFare client error:", apiMsg);
      return res.status(400).json({ message: apiMsg });
    }

    // If error is an instance of Error with a message that looks like a client problem, return 400
    if (
      err &&
      err.message &&
      clientIndicators.some((s) =>
        err.message.toLowerCase().includes(s.toLowerCase()),
      )
    ) {
      console.warn(
        "ride.controller.getFare client error (from message):",
        err.message,
      );
      return res.status(400).json({ message: err.message });
    }

    console.error("ride.controller.getFare unexpected error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });
    // ride started - notify user
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
