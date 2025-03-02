"use client";

import React from "react";
import { Room as RoomClass } from "@/lib/shared/museum/room";
import { Direction } from "@/lib/shared/museum/directions";
import type { LayoutGrid, Room } from "@/lib/shared/types";

interface RoomWithSize {
  room: Room;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function Layout2D({ grid }: { grid: LayoutGrid }) {
  const cellSize = 40;
  const width = grid.length * cellSize;
  const height = grid[0].length * cellSize;
  const doorWidth = 10;

  // Combine 1x1 room cells into larger rooms
  const rooms: RoomWithSize[] = [];
  const visited = new Set<string>();

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (!grid[x][y] || visited.has(`${x},${y}`)) continue;

      // Find the width of this room
      let roomWidth = 1;
      while (
        x + roomWidth < grid.length &&
        grid[x + roomWidth][y] &&
        !visited.has(`${x + roomWidth},${y}`) &&
        !grid[x + roomWidth - 1][y]!.walls[Direction.East] &&
        !grid[x + roomWidth][y]!.walls[Direction.West]
      ) {
        roomWidth++;
      }

      // Find the height of this room
      let roomHeight = 1;
      while (
        y + roomHeight < grid[0].length &&
        grid[x][y + roomHeight] &&
        !visited.has(`${x},${y + roomHeight}`) &&
        !grid[x][y + roomHeight - 1]!.walls[Direction.South] &&
        !grid[x][y + roomHeight]!.walls[Direction.North]
      ) {
        roomHeight++;
      }

      // Mark all cells in this room as visited
      for (let dx = 0; dx < roomWidth; dx++) {
        for (let dy = 0; dy < roomHeight; dy++) {
          visited.add(`${x + dx},${y + dy}`);
        }
      }

      rooms.push({
        room: grid[x][y]!,
        width: roomWidth,
        height: roomHeight,
        x,
        y,
      });
    }
  }

  // Find door positions for each room
  const findDoorPosition = (
    room: RoomWithSize,
    direction: Direction
  ): { x: number; y: number } | null => {
    switch (direction) {
      case Direction.North:
        for (let dx = 0; dx < room.width; dx++) {
          const cellX = room.x + dx;
          const cellY = room.y;
          if (
            cellY > 0 &&
            grid[cellX][cellY]?.walls[Direction.North]?.hasDoor &&
            grid[cellX][cellY - 1]?.walls[Direction.South]?.hasDoor
          ) {
            return { x: dx, y: 0 };
          }
        }
        break;
      case Direction.South:
        for (let dx = 0; dx < room.width; dx++) {
          const cellX = room.x + dx;
          const cellY = room.y + room.height - 1;
          if (
            cellY < grid[0].length - 1 &&
            grid[cellX][cellY]?.walls[Direction.South]?.hasDoor &&
            grid[cellX][cellY + 1]?.walls[Direction.North]?.hasDoor
          ) {
            return { x: dx, y: room.height - 1 };
          }
        }
        break;
      case Direction.East:
        for (let dy = 0; dy < room.height; dy++) {
          const cellX = room.x + room.width - 1;
          const cellY = room.y + dy;
          if (
            cellX < grid.length - 1 &&
            grid[cellX][cellY]?.walls[Direction.East]?.hasDoor &&
            grid[cellX + 1][cellY]?.walls[Direction.West]?.hasDoor
          ) {
            return { x: room.width - 1, y: dy };
          }
        }
        break;
      case Direction.West:
        for (let dy = 0; dy < room.height; dy++) {
          const cellX = room.x;
          const cellY = room.y + dy;
          if (
            cellX > 0 &&
            grid[cellX][cellY]?.walls[Direction.West]?.hasDoor &&
            grid[cellX - 1][cellY]?.walls[Direction.East]?.hasDoor
          ) {
            return { x: 0, y: dy };
          }
        }
        break;
    }
    return null;
  };

  // Find window positions for each room
  const findWindowPosition = (
    room: RoomWithSize,
    direction: Direction
  ): { x: number; y: number } | null => {
    switch (direction) {
      case Direction.North:
        for (let dx = 0; dx < room.width; dx++) {
          const cellX = room.x + dx;
          const cellY = room.y;
          if (grid[cellX][cellY]?.walls[Direction.North]?.hasWindow) {
            return { x: dx, y: 0 };
          }
        }
        break;
      case Direction.South:
        for (let dx = 0; dx < room.width; dx++) {
          const cellX = room.x + dx;
          const cellY = room.y + room.height - 1;
          if (grid[cellX][cellY]?.walls[Direction.South]?.hasWindow) {
            return { x: dx, y: room.height - 1 };
          }
        }
        break;
      case Direction.East:
        for (let dy = 0; dy < room.height; dy++) {
          const cellX = room.x + room.width - 1;
          const cellY = room.y + dy;
          if (grid[cellX][cellY]?.walls[Direction.East]?.hasWindow) {
            return { x: room.width - 1, y: dy };
          }
        }
        break;
      case Direction.West:
        for (let dy = 0; dy < room.height; dy++) {
          const cellX = room.x;
          const cellY = room.y + dy;
          if (grid[cellX][cellY]?.walls[Direction.West]?.hasWindow) {
            return { x: 0, y: dy };
          }
        }
        break;
    }
    return null;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {rooms.map(({ room, width: roomWidth, height: roomHeight, x, y }, index) => {
        const hasNorthWall = Array.from({ length: roomWidth }).some((_, dx) => {
          const cell = grid[x + dx][y];
          return cell?.walls[Direction.North];
        });
        const hasSouthWall = Array.from({ length: roomWidth }).some((_, dx) => {
          const cell = grid[x + dx][y + roomHeight - 1];
          return cell?.walls[Direction.South];
        });
        const hasEastWall = Array.from({ length: roomHeight }).some((_, dy) => {
          const cell = grid[x + roomWidth - 1][y + dy];
          return cell?.walls[Direction.East];
        });
        const hasWestWall = Array.from({ length: roomHeight }).some((_, dy) => {
          const cell = grid[x][y + dy];
          return cell?.walls[Direction.West];
        });

        const northDoor = findDoorPosition(rooms[index], Direction.North);
        const southDoor = findDoorPosition(rooms[index], Direction.South);
        const eastDoor = findDoorPosition(rooms[index], Direction.East);
        const westDoor = findDoorPosition(rooms[index], Direction.West);

        const northWindow = findWindowPosition(rooms[index], Direction.North);
        const southWindow = findWindowPosition(rooms[index], Direction.South);
        const eastWindow = findWindowPosition(rooms[index], Direction.East);
        const westWindow = findWindowPosition(rooms[index], Direction.West);

        const windowWidth = 15;

        // Determine room style based on its properties
        let roomFill = "#eee";
        let roomLabel = "";

        // Check for entrance
        if (room.metadata?.isEntrance) {
          roomFill = "#c8e6c9"; // Light green for entrance
          roomLabel = "E";
        }

        // Check for staircase
        if (room.metadata?.isStaircase) {
          roomFill = "#bbdefb"; // Light blue for stairs
          roomLabel = "S";

          // If we have connected floor information, display it
          if (room.metadata?.connectedFloors?.length) {
            const connectedFloors = room.metadata.connectedFloors;
            roomLabel = `S→${connectedFloors.join(",")}`;
          }
        }

        return (
          <g key={index} transform={`translate(${x * cellSize} ${y * cellSize})`}>
            <rect
              x={2}
              y={2}
              width={roomWidth * cellSize - 4}
              height={roomHeight * cellSize - 4}
              fill={roomFill}
              stroke="#666"
              strokeWidth={1}
            />

            {/* Room label */}
            {roomLabel && (
              <text
                x={(roomWidth * cellSize) / 2}
                y={(roomHeight * cellSize) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
              >
                {roomLabel}
              </text>
            )}

            {/* North wall */}
            {hasNorthWall && (
              <>
                {northDoor ? (
                  <>
                    <line
                      x1={2}
                      y1={2}
                      x2={northDoor.x * cellSize + (cellSize - doorWidth) / 2}
                      y2={2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={northDoor.x * cellSize + (cellSize + doorWidth) / 2}
                      y1={2}
                      x2={roomWidth * cellSize - 2}
                      y2={2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : northWindow ? (
                  <>
                    <line
                      x1={2}
                      y1={2}
                      x2={northWindow.x * cellSize + (cellSize - windowWidth) / 2}
                      y2={2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={northWindow.x * cellSize + (cellSize - windowWidth) / 2}
                      y1={2}
                      x2={northWindow.x * cellSize + (cellSize + windowWidth) / 2}
                      y2={2}
                      stroke="#000"
                      strokeWidth={1}
                      strokeDasharray="2,1"
                    />
                    <line
                      x1={northWindow.x * cellSize + (cellSize + windowWidth) / 2}
                      y1={2}
                      x2={roomWidth * cellSize - 2}
                      y2={2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <line
                    x1={2}
                    y1={2}
                    x2={roomWidth * cellSize - 2}
                    y2={2}
                    stroke="#000"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
            {/* South wall */}
            {hasSouthWall && (
              <>
                {southDoor ? (
                  <>
                    <line
                      x1={2}
                      y1={roomHeight * cellSize - 2}
                      x2={southDoor.x * cellSize + (cellSize - doorWidth) / 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={southDoor.x * cellSize + (cellSize + doorWidth) / 2}
                      y1={roomHeight * cellSize - 2}
                      x2={roomWidth * cellSize - 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : southWindow ? (
                  <>
                    <line
                      x1={2}
                      y1={roomHeight * cellSize - 2}
                      x2={southWindow.x * cellSize + (cellSize - windowWidth) / 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={southWindow.x * cellSize + (cellSize - windowWidth) / 2}
                      y1={roomHeight * cellSize - 2}
                      x2={southWindow.x * cellSize + (cellSize + windowWidth) / 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={1}
                      strokeDasharray="2,1"
                    />
                    <line
                      x1={southWindow.x * cellSize + (cellSize + windowWidth) / 2}
                      y1={roomHeight * cellSize - 2}
                      x2={roomWidth * cellSize - 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <line
                    x1={2}
                    y1={roomHeight * cellSize - 2}
                    x2={roomWidth * cellSize - 2}
                    y2={roomHeight * cellSize - 2}
                    stroke="#000"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
            {/* East wall */}
            {hasEastWall && (
              <>
                {eastDoor ? (
                  <>
                    <line
                      x1={roomWidth * cellSize - 2}
                      y1={2}
                      x2={roomWidth * cellSize - 2}
                      y2={eastDoor.y * cellSize + (cellSize - doorWidth) / 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={roomWidth * cellSize - 2}
                      y1={eastDoor.y * cellSize + (cellSize + doorWidth) / 2}
                      x2={roomWidth * cellSize - 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : eastWindow ? (
                  <>
                    <line
                      x1={roomWidth * cellSize - 2}
                      y1={2}
                      x2={roomWidth * cellSize - 2}
                      y2={eastWindow.y * cellSize + (cellSize - windowWidth) / 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={roomWidth * cellSize - 2}
                      y1={eastWindow.y * cellSize + (cellSize - windowWidth) / 2}
                      x2={roomWidth * cellSize - 2}
                      y2={eastWindow.y * cellSize + (cellSize + windowWidth) / 2}
                      stroke="#000"
                      strokeWidth={1}
                      strokeDasharray="2,1"
                    />
                    <line
                      x1={roomWidth * cellSize - 2}
                      y1={eastWindow.y * cellSize + (cellSize + windowWidth) / 2}
                      x2={roomWidth * cellSize - 2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <line
                    x1={roomWidth * cellSize - 2}
                    y1={2}
                    x2={roomWidth * cellSize - 2}
                    y2={roomHeight * cellSize - 2}
                    stroke="#000"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
            {/* West wall */}
            {hasWestWall && (
              <>
                {westDoor ? (
                  <>
                    <line
                      x1={2}
                      y1={2}
                      x2={2}
                      y2={westDoor.y * cellSize + (cellSize - doorWidth) / 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={2}
                      y1={westDoor.y * cellSize + (cellSize + doorWidth) / 2}
                      x2={2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : westWindow ? (
                  <>
                    <line
                      x1={2}
                      y1={2}
                      x2={2}
                      y2={westWindow.y * cellSize + (cellSize - windowWidth) / 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                    <line
                      x1={2}
                      y1={westWindow.y * cellSize + (cellSize - windowWidth) / 2}
                      x2={2}
                      y2={westWindow.y * cellSize + (cellSize + windowWidth) / 2}
                      stroke="#000"
                      strokeWidth={1}
                      strokeDasharray="2,1"
                    />
                    <line
                      x1={2}
                      y1={westWindow.y * cellSize + (cellSize + windowWidth) / 2}
                      x2={2}
                      y2={roomHeight * cellSize - 2}
                      stroke="#000"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <line
                    x1={2}
                    y1={2}
                    x2={2}
                    y2={roomHeight * cellSize - 2}
                    stroke="#000"
                    strokeWidth={2}
                  />
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
