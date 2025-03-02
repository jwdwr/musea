"use client";

import React, { useState } from "react";
import { Layout2D } from "@/components/Museum/Layout2D";
import { Museum } from "@/components/Museum";
import { World } from "@/components/World";
import type { LayoutGrid, RoomMaterials, Wall, BuildingLayout } from "@/lib/shared/types";
import { Room } from "@/lib/shared/museum/room";
import { Direction } from "@/lib/shared/museum/directions";

// Define default materials
const defaultMaterials: RoomMaterials = {
  floor: {
    diffuse: "/textures/herringbone/herringbone_parquet_diff_4k.jpg",
    normal: "/textures/herringbone/herringbone_parquet_nor_gl_4k.jpg",
  },
  walls: {
    diffuse: "/textures/brick/red_brick_diff_4k.jpg",
    normal: "/textures/brick/red_brick_disp_4k.png",
  },
  ceiling: {
    diffuse: "/textures/granite/granite_tile_diff_4k.jpg",
    normal: "/textures/granite/granite_tile_disp_4k.png",
  },
};

export default function PlaygroundPage() {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [numFloors, setNumFloors] = useState(2);
  const [buildingLayout, setBuildingLayout] = useState<BuildingLayout | null>(null);
  const [currentFloor, setCurrentFloor] = useState(0);

  const generateLayout = async () => {
    const response = await fetch(
      `/api/museum/layout?width=${width}&height=${height}&numFloors=${numFloors}`
    );
    const { buildingLayout: rawBuildingLayout } = await response.json();

    // Convert raw grid to proper Room instances for each floor
    const processedLayout: BuildingLayout = rawBuildingLayout.map((floorGrid: any[]) =>
      floorGrid.map((row: any[], y: number) =>
        row.map((cell: any, x: number) => {
          if (!cell) return null;

          // Create new Room instance with the same properties
          const room = new Room(
            { x: cell.location.x, y: cell.location.y },
            { width: cell.size.width, height: cell.size.height, depth: cell.size.depth }
          );

          // Copy over walls and their properties
          Object.entries(cell.walls).forEach(([dir, wallData]) => {
            const direction = Number(dir) as Direction;
            if (wallData) {
              const wall: Wall = {
                direction,
                ...wallData,
              };
              room.walls[direction] = wall;
            } else {
              room.removeWall(direction);
            }
          });

          // Add materials and update walls
          room.materials = defaultMaterials;
          room.updateWallMaterials();

          // Copy metadata
          if (cell.metadata) {
            room.metadata = { ...cell.metadata };
          }

          return room;
        })
      )
    );

    setBuildingLayout(processedLayout);
    setCurrentFloor(0); // Reset to ground floor when generating new layout
  };

  // Helper to get the current floor's grid
  const getCurrentFloorGrid = (): LayoutGrid | null => {
    if (!buildingLayout || currentFloor >= buildingLayout.length) {
      return null;
    }
    return buildingLayout[currentFloor];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Museum Layout Playground</h1>

        <div className="mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              min="1"
              max="10"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height</label>
            <input
              type="number"
              min="1"
              max="10"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Floors</label>
            <input
              type="number"
              min="1"
              max="5"
              value={numFloors}
              onChange={(e) => setNumFloors(parseInt(e.target.value))}
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={generateLayout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-end"
          >
            Generate Layout
          </button>
        </div>

        {buildingLayout && (
          <>
            <div className="mb-4 flex gap-2">
              <label className="text-sm font-medium self-center">Current Floor:</label>
              <div className="flex">
                {buildingLayout.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFloor(index)}
                    className={`px-3 py-1 border ${
                      currentFloor === index
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {index === 0 ? "Ground" : `Floor ${index}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  2D View - {currentFloor === 0 ? "Ground Floor" : `Floor ${currentFloor}`}
                </h2>
                <Layout2D grid={getCurrentFloorGrid() || []} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow h-[400px]">
                <h2 className="text-xl font-semibold mb-4">3D View</h2>
                <World>
                  <Museum
                    museum={{
                      grid: getCurrentFloorGrid() || [],
                      params: {
                        theme: "",
                        prompts: [],
                        palette: { light: "#fff", medium: "#999", dark: "#666" },
                      },
                      floors: buildingLayout,
                      currentFloor: currentFloor,
                    }}
                  />
                </World>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
