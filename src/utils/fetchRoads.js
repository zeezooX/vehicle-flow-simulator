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
    for (const element of response.data.elements) {
      if (element.type === "node") {
        nodes[element.id] = {
          id: element.id,
          lat: (element.lat - south) / (north - south),
          lng: (element.lon - west) / (east - west),
          to: [],
          from: [],
        };
      }
    }

    for (const element of response.data.elements) {
      if (element.type === "way") {
        let last = null;
        for (const nodeId of element.nodes) {
          let node = {
            id: nodeId,
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

    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      if (node.lat < 0 || node.lat > 1 || node.lng < 0 || node.lng > 1) {
        let flag = false;
        for (const nodeto of node.to) {
          const other = nodes[nodeto.id];
          if (other && other.lat >= 0 && other.lat <= 1 && other.lng >= 0 && other.lng <= 1) {
            flag = true;
            break;
          }
        }
        for (const nodefrom of node.from) {
          const other = nodes[nodefrom.id];
          if (other && other.lat >= 0 && other.lat <= 1 && other.lng >= 0 && other.lng <= 1) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          delete nodes[nodeId];
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
