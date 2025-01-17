"use client";

import React from "react";
import { Room } from "@/lib/shared/museum/room";
import { Direction } from "@/lib/shared/museum/directions";
import type { LayoutGrid } from "@/lib/shared/types";

export function Layout2D({ grid }: { grid: LayoutGrid }) {
  const cellSize = 40;
  const width = grid.length * cellSize;
  const height = grid[0].length * cellSize;
  const doorWidth = 10; // Width of the door opening

  const renderDoor = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={2} />
  );

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {grid.map((row, x) =>
        row.map((room, y) => {
          if (!room) return null;
          return (
            <g key={`${x}-${y}`} transform={`translate(${x * cellSize} ${y * cellSize})`}>
              <rect
                x={2}
                y={2}
                width={cellSize - 4}
                height={cellSize - 4}
                fill="#eee"
                stroke="#666"
                strokeWidth={1}
              />
              {/* North wall */}
              {room.walls[Direction.North] && (
                <>
                  {room.walls[Direction.North].hasDoor ? (
                    <>
                      <line
                        x1={2}
                        y1={2}
                        x2={(cellSize - doorWidth) / 2}
                        y2={2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                      <line
                        x1={(cellSize + doorWidth) / 2}
                        y1={2}
                        x2={cellSize - 2}
                        y2={2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <line x1={2} y1={2} x2={cellSize - 2} y2={2} stroke="#000" strokeWidth={2} />
                  )}
                </>
              )}
              {/* South wall */}
              {room.walls[Direction.South] && (
                <>
                  {room.walls[Direction.South].hasDoor ? (
                    <>
                      <line
                        x1={2}
                        y1={cellSize - 2}
                        x2={(cellSize - doorWidth) / 2}
                        y2={cellSize - 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                      <line
                        x1={(cellSize + doorWidth) / 2}
                        y1={cellSize - 2}
                        x2={cellSize - 2}
                        y2={cellSize - 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <line
                      x1={2}
                      y1={cellSize - 2}
                      x2={cellSize - 2}
                      y2={cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  )}
                </>
              )}
              {/* East wall */}
              {room.walls[Direction.East] && (
                <>
                  {room.walls[Direction.East].hasDoor ? (
                    <>
                      <line
                        x1={cellSize - 2}
                        y1={2}
                        x2={cellSize - 2}
                        y2={(cellSize - doorWidth) / 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                      <line
                        x1={cellSize - 2}
                        y1={(cellSize + doorWidth) / 2}
                        x2={cellSize - 2}
                        y2={cellSize - 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <line
                      x1={cellSize - 2}
                      y1={2}
                      x2={cellSize - 2}
                      y2={cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  )}
                </>
              )}
              {/* West wall */}
              {room.walls[Direction.West] && (
                <>
                  {room.walls[Direction.West].hasDoor ? (
                    <>
                      <line
                        x1={2}
                        y1={2}
                        x2={2}
                        y2={(cellSize - doorWidth) / 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                      <line
                        x1={2}
                        y1={(cellSize + doorWidth) / 2}
                        x2={2}
                        y2={cellSize - 2}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <line x1={2} y1={2} x2={2} y2={cellSize - 2} stroke="#000" strokeWidth={2} />
                  )}
                </>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}
