import React, { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import fetchRoads from "../utils/fetchRoads";

const RoadMap = ({ lat, lng }) => {
  const [roads, setRoads] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const getRoads = async () => {
      const south = lat - 0.0045;
      const west = lng - 0.00675;
      const north = lat + 0.0045;
      const east = lng + 0.00675;

      const data = await fetchRoads(south, west, north, east);
      setRoads(data);
    };

    getRoads();
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageScale(newScale);

    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const handleDragMove = (e) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const calculateOffset = (x1, y1, x2, y2, laneIndex, totalLanes) => {
    const laneWidth = window.innerWidth * 0.00205;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const perpendicularAngle = angle + Math.PI / 2;
    const offset = ((laneIndex - (totalLanes - 1) / 2) * laneWidth);
    return {
      offsetX: Math.cos(perpendicularAngle) * offset,
      offsetY: Math.sin(perpendicularAngle) * offset,
    };
  };

  return roads === null ? (
    <div>Loading...</div>
  ) : (
    <Stage
      width={window.innerWidth * 0.6}
      height={window.innerWidth * 0.4}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stagePos.x}
      y={stagePos.y}
      draggable
      onDragMove={handleDragMove}
      onWheel={handleWheel}
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <Layer scaleY={-1} y={window.innerWidth * 0.4}>
        {Object.entries(roads).map((node) =>
          node[1].to.map((connection) => {
            const targetNode = roads[connection.id];
            if (!targetNode) return null;

            const lanes = parseInt(connection.lanes, 10);
            const lines = [];

            for (let i = 0; i < lanes; i++) {
              const { offsetX, offsetY } = calculateOffset(
                node[1].lng * window.innerWidth * 0.6,
                node[1].lat * window.innerWidth * 0.4,
                targetNode.lng * window.innerWidth * 0.6,
                targetNode.lat * window.innerWidth * 0.4,
                i,
                lanes
              );

              lines.push(
                <Line
                  key={`${node[1].id}-${targetNode.id}-lane-${i}`}
                  points={[
                    node[1].lng * window.innerWidth * 0.6 + offsetX,
                    node[1].lat * window.innerWidth * 0.4 + offsetY,
                    targetNode.lng * window.innerWidth * 0.6 + offsetX,
                    targetNode.lat * window.innerWidth * 0.4 + offsetY,
                  ]}
                  stroke="black"
                  strokeWidth={window.innerWidth * 0.002}
                />
              );
            }

            return lines;
          })
        )}
      </Layer>
    </Stage>
  );
};

export default RoadMap;
