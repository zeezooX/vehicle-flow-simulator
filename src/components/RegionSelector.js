import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Rectangle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LocationMarker = ({ onCoordinateSelect }) => {
  const [position, setPosition] = useState(null);
  const [bounds, setBounds] = useState(null);

  useMapEvents({
    click(e) {
      const latlng = e.latlng;
      setPosition(latlng);

      const latOffset = 0.00450;
      const lngOffset = 0.00675;
      const boxBounds = [
        [latlng.lat - latOffset, latlng.lng - lngOffset],
        [latlng.lat + latOffset, latlng.lng + lngOffset],
      ];
      setBounds(boxBounds);

      onCoordinateSelect(latlng);
    },
  });

  return (
    <>
      {position && <Marker position={position} />}
      {bounds && <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />}
    </>
  );
};

const RegionSelector = ({ onCoordinateSelect }) => {
  return (
    <MapContainer
      center={[31.2, 29.9]}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onCoordinateSelect={onCoordinateSelect} />
    </MapContainer>
  );
};

export default RegionSelector;
