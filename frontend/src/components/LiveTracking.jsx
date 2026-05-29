import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import Skeleton from "./ui/Skeleton";
import "maplibre-gl/dist/maplibre-gl.css";

const center = {
  lat: 28.6139,
  lng: 77.209,
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(center);
  const [mapError, setMapError] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapError("Location services are unavailable in this browser.");
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      () => {
        setMapError("Unable to access your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      () => {
        setMapError("Unable to update your location.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    if (!apiKey || !mapContainerRef.current) {
      if (!apiKey) {
        setMapError("MapTiler API key missing; map disabled.");
      }
      return undefined;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [currentPosition.lng, currentPosition.lat],
      zoom: 15,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const marker = new maplibregl.Marker({ color: "#111827" })
      .setLngLat([currentPosition.lng, currentPosition.lat])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    markerRef.current.setLngLat([currentPosition.lng, currentPosition.lat]);
    mapRef.current.easeTo({
      center: [currentPosition.lng, currentPosition.lat],
      duration: 500,
    });
  }, [currentPosition]);

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="max-w-md p-6">
          <Skeleton height="300px" />
          <div className="text-center mt-3 text-sm text-gray-600">
            {mapError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
        Live location on MapTiler
      </div>
    </div>
  );
};

export default LiveTracking;
