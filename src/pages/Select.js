import React, { useState } from "react";
import Map from "../components/RegionSelector";
import { Typography, Button, Stack } from "@mui/material/";

function Select() {
  const [coordinates, setCoordinates] = useState(null);

  const handleCoordinateSelect = (latlng) => {
    setCoordinates(latlng);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4"> Vehicle Flow Simulator </Typography>
      <Typography variant="subtitle2">
        Simulates vehicle flow and inter-connectivity in a user-defined area on
        a real map. Designed to be used to test vehicle communication protocols
        and routing algorithms.
      </Typography>
      <Typography variant="h6">
        Click on the map to select a 500m x 750m region.
      </Typography>
      <Map onCoordinateSelect={handleCoordinateSelect} />
      {coordinates && (
        <Stack direction="row" spacing={2}>
          <Typography variant="body2">
            Selected Coordinates: Latitude:{" "}
            {(coordinates.lat.toString() + "0000").slice(0, 18)}, Longitude:{" "}
            {(coordinates.lng.toString() + "0000").slice(0, 18)}
          </Typography>
          <Button variant="contained" size="small" href={`/simulate/${coordinates.lat}/${coordinates.lng}`}>
            Simulate
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default Select;
