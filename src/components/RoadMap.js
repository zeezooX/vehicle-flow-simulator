import React, { useState, useEffect } from "react";
import fetchRoads from "../utils/fetchRoads";

const RoadMap = ({ lat, lng }) => {
  const [roads, setRoads] = useState(null);

  useEffect(() => {
    const getRoads = async () => {
      const south = lat - 0.004;
      const west = lng - 0.006;
      const north = lat + 0.004;
      const east = lng + 0.006;

      const data = await fetchRoads(south, west, north, east);
      setRoads(data);
    };

    getRoads();
  }, []);

  return (
    <div></div>
  );
};

export default RoadMap;
