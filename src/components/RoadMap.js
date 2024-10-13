import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import fetchRoads from "../utils/fetchRoads";
import "leaflet/dist/leaflet.css";

const RoadMap = ({ lat, lng }) => {
  const [roadData, setRoadData] = useState(null);

  useEffect(() => {
    const getRoads = async () => {
      const south = lat - 0.004;
      const west = lng - 0.006;
      const north = lat + 0.004;
      const east = lng + 0.006;

      const data = await fetchRoads(south, west, north, east);
      setRoadData(data);
    };

    getRoads();
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "85vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {roadData && <GeoJSON data={roadData} style={roadStyle} />}
    </MapContainer>
  );
};

const roadStyle = {
  color: "#0000ff",
  weight: 2,
};

export default RoadMap;
