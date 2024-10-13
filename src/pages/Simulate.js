import { useParams } from "react-router-dom";
import RoadMap from "../components/RoadMap";
import { Button, Stack } from "@mui/material";

function Simulate() {
  const { lat, lng } = useParams();

  return (
    <Stack spacing={2}>
      <Button variant="contained" href="/select">
        Reselect Region
      </Button>
      <RoadMap lat={parseFloat(lat)} lng={parseFloat(lng)} />
    </Stack>
  );
}

export default Simulate;
