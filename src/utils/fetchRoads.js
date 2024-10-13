import axios from "axios";
import osmtogeojson from "osmtogeojson";

const fetchRoads = async (south, west, north, east) => {
  const query = `
    [out:json][timeout:25];
    (
      way["highway"~"motorway|trunk|primary|secondary|motorway_link|trunk_link|primary_link|secondary_link"] (${south},${west},${north},${east});
    );
    out body;
    >;
    out skel qt;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await axios.post(url, query, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const geojson = osmtogeojson(response.data);
    return geojson;
  } catch (error) {
    console.error("Error fetching roads:", error);
    return null;
  }
};

export default fetchRoads;
