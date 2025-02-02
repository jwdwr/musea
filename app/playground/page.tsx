"use client";

import React, { useState } from "react";
import { Layout2D } from "@/components/Museum/Layout2D";
import { Museum } from "@/components/Museum";
import { World } from "@/components/World";
import type { LayoutGrid, RoomMaterials, Wall } from "@/lib/shared/types";
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
  const [grid, setGrid] = useState<LayoutGrid | null>(null);

  const generateLayout = async () => {
    const response = await fetch(`/api/museum/layout?width=${width}&height=${height}`);
    const { grid: rawGrid } = await response.json();

    // Convert raw grid to proper Room instances
    const processedGrid = rawGrid.map((row: any[], y: number) =>
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

        return room;
      })
    );

    setGrid(processedGrid);
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
          <button
            onClick={generateLayout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-end"
          >
            Generate Layout
          </button>
        </div>

        {grid && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">2D View</h2>
              <Layout2D grid={grid} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
              <h2 className="text-xl font-semibold mb-4">3D View</h2>
              <World>
                <Museum
                  museum={{
                    grid,
                    params: {
                      theme: "",
                      prompts: [],
                      palette: { light: "#fff", medium: "#999", dark: "#666" },
                    },
                  }}
                />
              </World>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
