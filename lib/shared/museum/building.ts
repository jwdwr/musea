import { Direction } from "./directions";
import { Room } from "./room";
import type { LayoutGrid } from "../types";

// Utility functions for building generation
export const generateRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

interface RoomData {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  connections: string[];
  isEntrance?: boolean;
  stairs?: {
    to: string;
    floor: number;
  };
}

interface Story {
  rooms: RoomData[];
}

interface Building {
  stories: Story[];
}

// Export for testing purposes
export const generateRooms = (width: number, depth: number): RoomData[] => {
  // Validate dimensions
  if (width <= 0 || depth <= 0) {
    throw new Error("Invalid dimensions: width and depth must be positive");
  }

  // Generate rooms using the core algorithm
  const rooms = generateRoomsCore(width, depth);

  // Ensure we have at least one room
  if (rooms.length === 0) {
    throw new Error("Failed to generate any rooms");
  }

  // First, choose an entrance room (preferably on the edge)
  const edgeRooms = rooms.filter(
    (r) => r.x === 0 || r.y === 0 || r.x + r.width === width || r.y + r.height === depth
  );

  // If no edge rooms, use any room
  const entrancePool = edgeRooms.length > 0 ? edgeRooms : rooms;
  const entrance = entrancePool[generateRandomInt(0, entrancePool.length - 1)];
  entrance.isEntrance = true;

  // Connect rooms
  connectRooms(rooms);

  return rooms;
};

// Core room generation algorithm - extracted for better testability
export const generateRoomsCore = (width: number, depth: number): RoomData[] => {
  // Initialize grid to track available space
  const grid = Array(width)
    .fill(null)
    .map(() => Array(depth).fill(false));
  const rooms: RoomData[] = [];
  let roomId = 1;

  // Safety counter to prevent infinite loops
  let safetyCounter = 0;
  const MAX_ITERATIONS = width * depth * 2; // Reasonable upper bound

  // Keep trying to add rooms until the grid is filled
  while (safetyCounter < MAX_ITERATIONS) {
    safetyCounter++;

    // Find an empty spot
    let startX = -1,
      startY = -1;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < depth; y++) {
        if (!grid[x][y]) {
          startX = x;
          startY = y;
          break;
        }
      }
      if (startX !== -1) break;
    }

    // If no empty spots found, we're done
    if (startX === -1) break;

    // Determine maximum possible room size at this position
    let maxWidth = 1;
    let maxHeight = 1;

    // Check how far we can extend width
    while (startX + maxWidth < width) {
      let canExtend = true;
      for (let y = startY; y < startY + maxHeight; y++) {
        if (grid[startX + maxWidth][y]) {
          canExtend = false;
          break;
        }
      }
      if (!canExtend) break;
      maxWidth++;
    }

    // Check how far we can extend height
    while (startY + maxHeight < depth) {
      let canExtend = true;
      for (let x = startX; x < startX + maxWidth; x++) {
        if (grid[x][startY + maxHeight]) {
          canExtend = false;
          break;
        }
      }
      if (!canExtend) break;
      maxHeight++;
    }

    // Choose random size within maximum bounds
    const roomWidth = generateRandomInt(1, Math.min(maxWidth, 3));
    const roomHeight = generateRandomInt(1, Math.min(maxHeight, 3));

    // Mark grid spaces as used
    for (let x = startX; x < startX + roomWidth; x++) {
      for (let y = startY; y < startY + roomHeight; y++) {
        grid[x][y] = true;
      }
    }

    // Create the room
    rooms.push({
      id: `room${roomId}`,
      width: roomWidth,
      height: roomHeight,
      x: startX,
      y: startY,
      connections: [],
    });

    roomId++;
  }

  // Check if we hit the safety limit
  if (safetyCounter >= MAX_ITERATIONS) {
    console.warn(`Room generation hit safety limit of ${MAX_ITERATIONS} iterations`);
  }

  return rooms;
};

// Connect rooms using minimum spanning tree and random additional connections
export const connectRooms = (rooms: RoomData[]): void => {
  if (rooms.length <= 1) return; // Nothing to connect

  // Find the entrance room
  const entrance = rooms.find((room) => room.isEntrance) || rooms[0];

  // First ensure minimum spanning tree connectivity
  const unconnectedRooms = new Set(rooms.map((r) => r.id));
  const connectedRooms = new Set<string>();

  // Start with entrance
  connectedRooms.add(entrance.id);
  unconnectedRooms.delete(entrance.id);

  // Keep connecting rooms until all are connected
  while (unconnectedRooms.size > 0) {
    let bestConnection: [RoomData, RoomData] | null = null;
    let shortestDistance = Infinity;

    // Find closest unconnected room to any connected room
    for (const connectedId of connectedRooms) {
      const connectedRoom = rooms.find((r) => r.id === connectedId);
      if (!connectedRoom) continue;

      for (const unconnectedId of unconnectedRooms) {
        const unconnectedRoom = rooms.find((r) => r.id === unconnectedId);
        if (!unconnectedRoom) continue;

        // Check if rooms are adjacent
        if (areRoomsAdjacent(connectedRoom, unconnectedRoom)) {
          const distance =
            Math.abs(connectedRoom.x - unconnectedRoom.x) +
            Math.abs(connectedRoom.y - unconnectedRoom.y);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            bestConnection = [connectedRoom, unconnectedRoom];
          }
        }
      }
    }

    if (bestConnection) {
      // Add the connection
      bestConnection[0].connections.push(bestConnection[1].id);
      bestConnection[1].connections.push(bestConnection[0].id);
      connectedRooms.add(bestConnection[1].id);
      unconnectedRooms.delete(bestConnection[1].id);
    } else {
      // No valid connections found - this shouldn't happen with adjacent rooms
      console.error("Could not find valid connection between rooms");

      // If we can't find a valid connection, just connect to the first unconnected room
      // This is a fallback to prevent the algorithm from getting stuck
      if (unconnectedRooms.size > 0) {
        const connectedId = Array.from(connectedRooms)[0];
        const unconnectedId = Array.from(unconnectedRooms)[0];

        const connectedRoom = rooms.find((r) => r.id === connectedId);
        const unconnectedRoom = rooms.find((r) => r.id === unconnectedId);

        if (connectedRoom && unconnectedRoom) {
          connectedRoom.connections.push(unconnectedRoom.id);
          unconnectedRoom.connections.push(connectedRoom.id);
          connectedRooms.add(unconnectedRoom.id);
          unconnectedRooms.delete(unconnectedRoom.id);
          console.warn(`Created forced connection between ${connectedId} and ${unconnectedId}`);
        }
      }

      if (unconnectedRooms.size > 0) {
        // If we still have unconnected rooms, break and continue with what we have
        console.warn(`${unconnectedRooms.size} rooms remain unconnected`);
        break;
      }
    }
  }

  // Add some random additional connections
  rooms.forEach((room, i) => {
    rooms.slice(i + 1).forEach((otherRoom) => {
      // Check if rooms are adjacent
      const isAdjacent = areRoomsAdjacent(room, otherRoom);

      // 20% chance to add extra connections between adjacent rooms
      if (isAdjacent && Math.random() < 0.2 && !room.connections.includes(otherRoom.id)) {
        room.connections.push(otherRoom.id);
        otherRoom.connections.push(room.id);
      }
    });
  });
};

// Helper function to determine if two rooms are adjacent
export const areRoomsAdjacent = (room1: RoomData, room2: RoomData): boolean => {
  return (
    ((room1.x + room1.width === room2.x || room2.x + room2.width === room1.x) &&
      room1.y < room2.y + room2.height &&
      room2.y < room1.y + room1.height) ||
    ((room1.y + room1.height === room2.y || room2.y + room2.height === room1.y) &&
      room1.x < room2.x + room2.width &&
      room2.x < room1.x + room1.width)
  );
};

export const generateBuilding = (width: number, height: number): LayoutGrid => {
  // Validate input dimensions
  if (width <= 0 || height <= 0) {
    console.error(`Invalid dimensions: ${width}x${height}`);
    // Return an empty grid for invalid dimensions
    // Use Math.max to ensure we don't try to create arrays with negative length
    return Array(Math.max(0, 1))
      .fill(null)
      .map(() => Array(Math.max(0, 1)).fill(null));
  }

  // Building parameters
  const numStories = 1; // For now, just generate one floor for the 2D view

  // Initialize building
  const building: Building = {
    stories: Array(numStories)
      .fill(null)
      .map(() => ({
        rooms: [],
      })),
  };

  // Generate ground floor with varying room sizes
  try {
    building.stories[0].rooms = generateRooms(width, height);
  } catch (error) {
    console.error("Error generating rooms:", error);
    // Fallback to a simple 1x1 room if generation fails
    building.stories[0].rooms = [
      {
        id: "room1",
        width: 1,
        height: 1,
        x: 0,
        y: 0,
        connections: [],
        isEntrance: true,
      },
    ];
  }

  // Convert the building format to our LayoutGrid format
  const layoutGrid: LayoutGrid = Array(width)
    .fill(null)
    .map(() => Array(height).fill(null));

  // Place rooms in the grid
  building.stories[0].rooms.forEach((roomData) => {
    // First, determine door positions for each connection
    const doorPositions = new Map<string, { x: number; y: number; direction: Direction }>();

    roomData.connections.forEach((connectedId) => {
      const connectedRoom = building.stories[0].rooms.find((r) => r.id === connectedId);
      if (!connectedRoom) return;

      // Calculate the overlapping range of cells between the rooms
      let doorPos;
      if (connectedRoom.x === roomData.x + roomData.width) {
        // Connected room is to the east
        const overlapStart = Math.max(roomData.y, connectedRoom.y);
        const overlapEnd = Math.min(
          roomData.y + roomData.height,
          connectedRoom.y + connectedRoom.height
        );
        const doorY = Math.floor(overlapStart + (overlapEnd - overlapStart) / 2);
        doorPos = {
          x: roomData.x + roomData.width - 1,
          y: doorY,
          direction: Direction.East,
        };
      } else if (connectedRoom.x + connectedRoom.width === roomData.x) {
        // Connected room is to the west
        const overlapStart = Math.max(roomData.y, connectedRoom.y);
        const overlapEnd = Math.min(
          roomData.y + roomData.height,
          connectedRoom.y + connectedRoom.height
        );
        const doorY = Math.floor(overlapStart + (overlapEnd - overlapStart) / 2);
        doorPos = {
          x: roomData.x,
          y: doorY,
          direction: Direction.West,
        };
      } else if (connectedRoom.y === roomData.y + roomData.height) {
        // Connected room is to the south
        const overlapStart = Math.max(roomData.x, connectedRoom.x);
        const overlapEnd = Math.min(
          roomData.x + roomData.width,
          connectedRoom.x + connectedRoom.width
        );
        const doorX = Math.floor(overlapStart + (overlapEnd - overlapStart) / 2);
        doorPos = {
          x: doorX,
          y: roomData.y + roomData.height - 1,
          direction: Direction.South,
        };
      } else if (connectedRoom.y + connectedRoom.height === roomData.y) {
        // Connected room is to the north
        const overlapStart = Math.max(roomData.x, connectedRoom.x);
        const overlapEnd = Math.min(
          roomData.x + roomData.width,
          connectedRoom.x + connectedRoom.width
        );
        const doorX = Math.floor(overlapStart + (overlapEnd - overlapStart) / 2);
        doorPos = {
          x: doorX,
          y: roomData.y,
          direction: Direction.North,
        };
      }

      if (doorPos) {
        doorPositions.set(connectedId, doorPos);
      }
    });

    // Create a Room instance for each grid cell the room occupies
    for (let x = roomData.x; x < roomData.x + roomData.width; x++) {
      for (let y = roomData.y; y < roomData.y + roomData.height; y++) {
        const room = new Room({ x, y });

        // For multi-cell rooms, remove interior walls
        if (x > roomData.x) room.removeWall(Direction.West);
        if (x < roomData.x + roomData.width - 1) room.removeWall(Direction.East);
        if (y > roomData.y) room.removeWall(Direction.North);
        if (y < roomData.y + roomData.height - 1) room.removeWall(Direction.South);

        // Add doors only at the predetermined positions
        roomData.connections.forEach((connectedId) => {
          const doorPos = doorPositions.get(connectedId);
          if (doorPos && doorPos.x === x && doorPos.y === y) {
            room.addDoor(doorPos.direction);
          }
        });

        // Track if we've already added a window to each side of the room
        // We'll use this to ensure only one window per side
        const roomSideHasWindow = {
          [Direction.North]: false,
          [Direction.South]: false,
          [Direction.East]: false,
          [Direction.West]: false,
        };

        // Check if any cell in this room already has a window on each side
        for (let rx = roomData.x; rx < roomData.x + roomData.width; rx++) {
          for (let ry = roomData.y; ry < roomData.y + roomData.height; ry++) {
            // Skip cells that haven't been processed yet
            if (rx > x || (rx === x && ry > y)) continue;

            const cell = layoutGrid[rx][ry];
            if (!cell) continue;

            if (cell.walls[Direction.North]?.hasWindow) roomSideHasWindow[Direction.North] = true;
            if (cell.walls[Direction.South]?.hasWindow) roomSideHasWindow[Direction.South] = true;
            if (cell.walls[Direction.East]?.hasWindow) roomSideHasWindow[Direction.East] = true;
            if (cell.walls[Direction.West]?.hasWindow) roomSideHasWindow[Direction.West] = true;
          }
        }

        // Add windows to exterior walls with a 40% chance
        // Check if this is an exterior wall (edge of the grid)
        if (x === 0 && room.walls[Direction.West]) {
          // Add a window with 40% chance if this side doesn't have one yet and there's no door
          if (
            !roomSideHasWindow[Direction.West] &&
            Math.random() < 0.4 &&
            !room.walls[Direction.West]?.hasDoor
          ) {
            room.addWindow(Direction.West);
            roomSideHasWindow[Direction.West] = true;
          }
        }
        if (x === width - 1 && room.walls[Direction.East]) {
          // Add a window with 40% chance if this side doesn't have one yet and there's no door
          if (
            !roomSideHasWindow[Direction.East] &&
            Math.random() < 0.4 &&
            !room.walls[Direction.East]?.hasDoor
          ) {
            room.addWindow(Direction.East);
            roomSideHasWindow[Direction.East] = true;
          }
        }
        if (y === 0 && room.walls[Direction.North]) {
          // Add a window with 40% chance if this side doesn't have one yet and there's no door
          if (
            !roomSideHasWindow[Direction.North] &&
            Math.random() < 0.4 &&
            !room.walls[Direction.North]?.hasDoor
          ) {
            room.addWindow(Direction.North);
            roomSideHasWindow[Direction.North] = true;
          }
        }
        if (y === height - 1 && room.walls[Direction.South]) {
          // Add a window with 40% chance if this side doesn't have one yet and there's no door
          if (
            !roomSideHasWindow[Direction.South] &&
            Math.random() < 0.4 &&
            !room.walls[Direction.South]?.hasDoor
          ) {
            room.addWindow(Direction.South);
            roomSideHasWindow[Direction.South] = true;
          }
        }

        // Mark entrance rooms with a special property
        if (roomData.isEntrance) {
          // Store entrance information in a way that doesn't conflict with Room type
          (room as any).metadata = { ...(room as any).metadata, isEntrance: true };
        }

        // Handle stairs if present
        if (roomData.stairs) {
          // Store stairs information in a way that doesn't conflict with Room type
          (room as any).metadata = { ...(room as any).metadata, stairs: roomData.stairs };
        }

        layoutGrid[x][y] = room;
      }
    }
  });

  return layoutGrid;
};
