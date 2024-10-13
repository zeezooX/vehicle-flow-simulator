import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchRoads from "../utils/fetchRoads";

function Simulate() {
  const { lat, lng } = useParams();

  useEffect(() => {
    const getRoads = async () => {
      const south = parseFloat(lat) - 0.004;
      const west = parseFloat(lng) - 0.006;
      const north = parseFloat(lat) + 0.004;
      const east = parseFloat(lng) + 0.006;

      const data = await fetchRoads(south, west, north, east);
      console.log(data);
    };

    getRoads();
  }, []);

  return (
    <div>
      <h1>Simulate</h1>
      <p>South: {parseFloat(lat) - 0.004}</p>
      <p>West: {parseFloat(lng) - 0.006}</p>
      <p>North: {parseFloat(lat) + 0.004}</p>
      <p>East: {parseFloat(lng) + 0.006}</p>
    </div>
  );
}

export default Simulate;
