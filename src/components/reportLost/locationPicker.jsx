import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Replace with your actual API key
const apiKey = import.meta.env.VITE_GOOGLE_API;

const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 40.7128, // New York City coordinates as default
  lng: -74.0060
};

const libraries = ['places'];

// Creating the component with useJsApiLoader instead of LoadScript
const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [marker, setMarker] = useState(
    initialLocation?.latitude ? 
    { lat: initialLocation.latitude, lng: initialLocation.longitude } : 
    null
  );
  
  const [map, setMap] = useState(null);

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "";
    } catch (error) {
      console.error("Error getting address:", error);
      return "";
    }
  }, []);

  const handleMapClick = useCallback(async (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    
    setMarker(newMarker);
    const addressText = await getAddressFromCoordinates(newMarker.lat, newMarker.lng);
    
    // Call parent component callback with location data
    onLocationSelect({
      address: addressText,
      latitude: newMarker.lat,
      longitude: newMarker.lng
    });
  }, [getAddressFromCoordinates, onLocationSelect]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newMarker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setMarker(newMarker);
          if (map) {
            map.panTo(newMarker);
          }
          
          const addressText = await getAddressFromCoordinates(newMarker.lat, newMarker.lng);
          
          onLocationSelect({
            address: addressText,
            latitude: newMarker.lat,
            longitude: newMarker.lng
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  // Update marker when initialLocation changes
  useEffect(() => {
    if (initialLocation?.latitude && isLoaded) {
      setMarker({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
      });
    }
  }, [initialLocation, isLoaded]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        Error loading maps: {loadError.message}
      </div>
    );
  }

  return (
    <div className="location-picker">
      <button 
        onClick={handleCurrentLocation}
        className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded mb-2 w-full"
        type="button"
      >
        Use My Current Location
      </button>
      
      <div className="relative rounded-lg border border-gray-700 overflow-hidden">
        {!isLoaded ? (
          <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center">
            <p className="text-white">Loading map...</p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={marker || defaultCenter}
            zoom={marker ? 14 : 10}
            onClick={handleMapClick}
            onLoad={map => setMap(map)}
            options={{
              styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              ]
            }}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;