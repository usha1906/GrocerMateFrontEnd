import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const Map = ({ groceryStores, onProximity }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const libraries = ["places"];

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAd9_m1qsCrf1VDDYonyOOOnjuTxSxK3S0", // Use env variable for the API key
    libraries: libraries, // Ensure Places library is loaded
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Check proximity to stores
  useEffect(() => {
    if (currentLocation && groceryStores.length > 0) {
      groceryStores.forEach((store) => {
        if (store.location && store.location.lat && store.location.lng) {
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            store.location.lat,
            store.location.lng
          );

          // 10 miles in meters (1609.34 * 10)
          if (distance <= 1609.34) {
            console.log(`You are near ${store.name}`);
            if (onProximity) onProximity(store); // Call the function if it exists
          }
        } else {
          console.error(`Invalid location for store: ${store.name}`);
        }
      });
    }
  }, [currentLocation, groceryStores, onProximity]);

  // Calculate distance between two locations
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={currentLocation || { lat: 37.7749, lng: -122.4194 }} // Default to SF
      zoom={currentLocation ? 14 : 10}
    >
      {currentLocation && (
        <Marker
          position={currentLocation}
          label="You"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      )}
      {groceryStores.map((store, index) => (
        store.location && store.location.lat && store.location.lng && (
          <Marker
            key={store.docId || index} // Ensure unique keys, fallback to index
            position={store.location}
            label={store.name}
          />
        )
      ))}
    </GoogleMap>
  );
};

export default Map;
