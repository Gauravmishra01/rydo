const axios = require("axios");
const captainModel = require("../models/captain.model");

const MAPTILER_BASE_URL = "https://api.maptiler.com";

function getMapTilerApiKey() {
  const apiKey = process.env.MAPTILER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing MapTiler API key (MAPTILER_API_KEY)");
  }
  return apiKey;
}

function parseCoordinatePair(value) {
  if (typeof value !== "string") return null;

  const parts = value.split(",");
  if (parts.length !== 2) return null;

  const ltd = Number.parseFloat(parts[0]);
  const lng = Number.parseFloat(parts[1]);

  if (Number.isNaN(ltd) || Number.isNaN(lng)) return null;
  return { ltd, lng };
}

function toCoordinateString(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const parsed = parseCoordinatePair(value);
    if (parsed) return `${parsed.lng},${parsed.ltd}`;
    return null;
  }

  const ltd = value.ltd ?? value.lat ?? value.latitude;
  const lng = value.lng ?? value.lon ?? value.long ?? value.longitude;

  if (typeof ltd !== "number" || typeof lng !== "number") return null;
  return `${lng},${ltd}`;
}

function formatDistance(distanceMeters) {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

function formatDuration(durationSeconds) {
  if (durationSeconds < 60) {
    return "1 min";
  }

  const minutes = Math.round(durationSeconds / 60);
  return `${minutes} mins`;
}

function buildLocalRouteEstimate(origin, destination) {
  const [lng1, lat1] = origin.split(",").map(Number);
  const [lng2, lat2] = destination.split(",").map(Number);
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusMeters = 6371e3;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lng2 - lng1);
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = earthRadiusMeters * c;
  const avgSpeedMetersPerSecond = (30 * 1000) / 3600;
  const durationSeconds = Math.max(
    60,
    distanceMeters / avgSpeedMetersPerSecond,
  );

  return {
    distance: {
      value: Math.round(distanceMeters),
      text: formatDistance(distanceMeters),
    },
    duration: {
      value: Math.round(durationSeconds),
      text: formatDuration(durationSeconds),
    },
    status: "OK",
  };
}

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = getMapTilerApiKey();

  // If address is already a lat,lng pair, return it directly
  const coordinates = parseCoordinatePair(address);
  if (coordinates) {
    return coordinates;
  }

  const url = `${MAPTILER_BASE_URL}/geocoding/${encodeURIComponent(address)}.json?key=${apiKey}&autocomplete=false&limit=1&types=address,place,poi`;

  try {
    const response = await axios.get(url);
    const feature = response.data?.features?.[0];

    if (feature?.geometry?.coordinates?.length === 2) {
      const [lng, ltd] = feature.geometry.coordinates;
      return {
        ltd,
        lng,
      };
    }

    if (!feature) {
      throw new Error("No coordinates found for the given address");
    }

    throw new Error("Unable to fetch coordinates");
  } catch (error) {
    const apiMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.error_message ||
      error?.response?.statusText;
    console.error(
      "maps.service.getAddressCoordinate error:",
      apiMsg || error.message || error,
    );
    if (apiMsg) throw new Error(apiMsg);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
  const apiKey = getMapTilerApiKey();

  const originCoordinates =
    toCoordinateString(origin) ||
    toCoordinateString(await module.exports.getAddressCoordinate(origin));
  const destinationCoordinates =
    toCoordinateString(destination) ||
    toCoordinateString(await module.exports.getAddressCoordinate(destination));

  if (!originCoordinates || !destinationCoordinates) {
    throw new Error("Unable to resolve route coordinates");
  }

  const url = `${MAPTILER_BASE_URL}/directions/driving/${originCoordinates};${destinationCoordinates}.json?key=${apiKey}&overview=false&steps=false`;

  try {
    const response = await axios.get(url);
    const route = response.data?.routes?.[0];

    if (!route) {
      throw new Error("No route information returned");
    }

    return {
      distance: {
        value: Math.round(route.distance),
        text: formatDistance(route.distance),
      },
      duration: {
        value: Math.round(route.duration),
        text: formatDuration(route.duration),
      },
      status: "OK",
    };
  } catch (err) {
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data?.error_message ||
      err?.response?.statusText ||
      err.message;
    console.error(
      "maps.service.getDistanceTime error:",
      apiMsg || err.message || err,
    );

    const originCoord = toCoordinateString(origin);
    const destinationCoord = toCoordinateString(destination);

    if (originCoord && destinationCoord) {
      return buildLocalRouteEstimate(originCoord, destinationCoord);
    }

    if (apiMsg) throw new Error(apiMsg);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  const apiKey = getMapTilerApiKey();

  const url = `${MAPTILER_BASE_URL}/geocoding/${encodeURIComponent(input)}.json?key=${apiKey}&autocomplete=true&limit=6&types=address,place,poi`;

  try {
    const response = await axios.get(url);
    const features = response.data?.features || [];

    return features
      .map((feature) => {
        const coordinates = feature?.geometry?.coordinates;
        if (!coordinates || coordinates.length !== 2) return null;

        const [lng, ltd] = coordinates;
        return {
          description: feature.place_name || feature.text || input,
          place_name: feature.place_name || feature.text || input,
          ltd,
          lng,
          coordinates: { ltd, lng },
          id: feature.id,
        };
      })
      .filter(Boolean);
  } catch (err) {
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data?.error_message ||
      err?.response?.statusText;
    console.error(
      "maps.service.getAutoCompleteSuggestions error:",
      apiMsg || err.message || err,
    );

    if (apiMsg) {
      throw new Error(apiMsg);
    }

    throw err;
  }
};

module.exports.getReverseCoordinate = async (lat, lng) => {
  const apiKey = getMapTilerApiKey();
  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Latitude and longitude are required");
  }

  const url = `${MAPTILER_BASE_URL}/geocoding/${lng},${lat}.json?key=${apiKey}&limit=1`;

  const response = await axios.get(url);
  const feature = response.data?.features?.[0];

  if (!feature) {
    throw new Error("No address found for the provided coordinates");
  }

  return {
    description: feature.place_name || feature.text || "",
    ltd: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
  };
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // radius in km

  if (typeof ltd !== "number" || typeof lng !== "number") return [];

  // Convert radius (km) to degrees approximately (1 deg ~ 111 km)
  const delta = radius / 111;

  const captains = await captainModel.find({
    "location.ltd": { $gte: ltd - delta, $lte: ltd + delta },
    "location.lng": { $gte: lng - delta, $lte: lng + delta },
  });

  return captains;
};
