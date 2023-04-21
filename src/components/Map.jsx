import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

function Map({ destination, pickup_location }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries: ["places"],
  });

  const center = {
    lat: -1.2921,
    lng: 36.8219,
  };

  useEffect(() => {
    if (map) {
      calculateRoute();
    }
  }, [map]);

  function onLoad(mapInstance) {
    setMap(mapInstance);
  }

  if (!isLoaded) {
    return <h2 className="text-2xl text-center mt-2">Loading map..</h2>;
  }

  async function calculateRoute() {
    if (pickup_location === "" || destination === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: String(pickup_location),
      destination: String(destination),
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  return (
    <>
      <div className="flex justify-evenly mt-8">
        {distance !== "" && (
          <p className="bg-indigo-600 px-4 py-1 rounded-sm">
            Distance: {distance}
          </p>
        )}
        {duration !== "" && (
          <p className="bg-indigo-600 px-4 py-1 rounded-sm">
            Duration: {duration}
          </p>
        )}
      </div>
      <div className="flow-root m-12 h-96 border rounded-lg">
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={10}
        >
          <MarkerF position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </>
  );
}

export default Map;
