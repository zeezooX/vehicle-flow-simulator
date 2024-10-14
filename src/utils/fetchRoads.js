import axios from "axios";

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

    const nodes = {};
    let latMin = 90;
    let lngMin = 180;
    for (let i = 0; i < response.data.elements.length; i++) {
      if (response.data.elements[i].type === "node") {
        let element = response.data.elements[i];
        if (
          element.lat >= south &&
          element.lat <= north &&
          element.lon >= west &&
          element.lon <= east
        ) {
          nodes[element.id] = {
            lat: element.lat,
            lng: element.lon,
            to: [],
            from: [],
          };
          latMin = Math.min(latMin, element.lat);
          lngMin = Math.min(lngMin, element.lon);
        }
      }
    }
    for (let key in nodes) {
      nodes[key].lat = (nodes[key].lat - latMin) * 100000;
      nodes[key].lng = (nodes[key].lng - lngMin) * 100000;
    }

    for (let i = 0; i < response.data.elements.length; i++) {
      if (response.data.elements[i].type === "way") {
        let element = response.data.elements[i];
        let last = null;
        for (let j = 0; j < element.nodes.length; j++) {
          let node = {
            id: element.nodes[j],
            lanes: element.tags.lanes ? element.tags.lanes : 1,
          };
          if (nodes[node.id]) {
            if (last) {
              nodes[last.id].to.push(node);
              nodes[node.id].from.push(last);
            }
            last = node;
          }
        }
      }
    }

    return nodes;
  } catch (error) {
    console.error("Error fetching roads:", error);
    return null;
  }
};

export default fetchRoads;
