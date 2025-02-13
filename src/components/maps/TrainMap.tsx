import React, { FC, useMemo } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";

export interface RoutePoint {
  lat: number;
  lng: number;
}

interface TrainMapProps {
  route: RoutePoint[];
  center?: RoutePoint;
  zoom?: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const TrainMap: FC<TrainMapProps> = ({ route, center, zoom = 8 }) => {
  const mapCenter = useMemo(() => {
    if (center) return center;
    if (route.length > 0) return route[0];
    return { lat: 0, lng: 0 };
  }, [center, route]);

  const currentPosition = route.length > 0 ? route[route.length - 1] : null;
  const routePositions = useMemo(
    () => route.map((pt) => ({ lat: pt.lat, lng: pt.lng })),
    [route]
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="w-full h-[400px] relative">
      {!apiKey ? (
        <p className="p-4 text-red-500">No Google Maps API Key found!</p>
      ) : (
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
          >
            {routePositions.length > 1 && (
              <Polyline
                path={routePositions}
                options={{ strokeColor: "#FF0000", strokeWeight: 4 }}
              />
            )}
            {currentPosition && (
              <Marker
                position={{
                  lat: currentPosition.lat,
                  lng: currentPosition.lng,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default TrainMap;
