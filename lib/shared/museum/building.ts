import { Direction } from "./directions";
import { Room } from "./room";
import type { LayoutGrid } from "../types";

// Utility functions for building generation
const generateRandomInt = (min: number, max: number) =>
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

// Check if a room is accessible from the entrance using BFS
const isRoomAccessible = (room: RoomData, rooms: RoomData[], entrance: RoomData) => {
  const visited = new Set();
  const queue = [entrance];

  while (queue.length > 0) {
    const currentRoom = queue.shift();
    if (!currentRoom) continue;
    visited.add(currentRoom.id);

    if (currentRoom.id === room.id) return true;

    for (const connectedId of currentRoom.connections) {
      const connectedRoom = rooms.find((r) => r.id === connectedId);
      if (connectedRoom && !visited.has(connectedRoom.id)) {
        queue.push(connectedRoom);
      }
    }

    // Check stairs connections
    if (currentRoom.stairs?.to) {
      const connectedRoom = rooms.find((r) => r.id === currentRoom.stairs?.to);
      if (connectedRoom && !visited.has(connectedRoom.id)) {
        queue.push(connectedRoom);
      }
    }
  }

  return false;
};

// Find all accessible rooms from a starting room
const findAccessibleRooms = (startRoom: RoomData, allRooms: RoomData[]) => {
  const visited = new Set();
  const queue = [startRoom];

  while (queue.length > 0) {
    const currentRoom = queue.shift();
    if (!currentRoom) continue;
    visited.add(currentRoom.id);

    for (const connectedId of currentRoom.connections) {
      const connectedRoom = allRooms.find((r) => r.id === connectedId);
      if (connectedRoom && !visited.has(connectedRoom.id)) {
        queue.push(connectedRoom);
      }
    }

    if (currentRoom.stairs?.to) {
      const connectedRoom = allRooms.find((r) => r.id === currentRoom.stairs?.to);
      if (connectedRoom && !visited.has(connectedRoom.id)) {
        queue.push(connectedRoom);
      }
    }
  }

  return visited;
};

const generateRooms = (width: number, depth: number): RoomData[] => {
  // Initialize grid to track available space
  const grid = Array(width)
    .fill(null)
    .map(() => Array(depth).fill(false));
  const rooms: RoomData[] = [];
  let roomId = 1;

  // Keep trying to add rooms until the grid is filled
  while (true) {
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

  // First, choose an entrance room (preferably on the edge)
  const edgeRooms = rooms.filter(
    (r) => r.x === 0 || r.y === 0 || r.x + r.width === width || r.y + r.height === depth
  );
  const entrance = edgeRooms[generateRandomInt(0, edgeRooms.length - 1)];
  entrance.isEntrance = true;

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
        const isAdjacent =
          ((connectedRoom.x + connectedRoom.width === unconnectedRoom.x ||
            unconnectedRoom.x + unconnectedRoom.width === connectedRoom.x) &&
            connectedRoom.y < unconnectedRoom.y + unconnectedRoom.height &&
            unconnectedRoom.y < connectedRoom.y + connectedRoom.height) ||
          ((connectedRoom.y + connectedRoom.height === unconnectedRoom.y ||
            unconnectedRoom.y + unconnectedRoom.height === connectedRoom.y) &&
            connectedRoom.x < unconnectedRoom.x + unconnectedRoom.width &&
            unconnectedRoom.x < connectedRoom.x + connectedRoom.width);

        if (isAdjacent) {
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
      console.error("Could not find valid connection");
      break;
    }
  }

  // Add some random additional connections
  rooms.forEach((room, i) => {
    rooms.slice(i + 1).forEach((otherRoom) => {
      // Check if rooms are adjacent
      const isAdjacent =
        ((room.x + room.width === otherRoom.x || otherRoom.x + otherRoom.width === room.x) &&
          room.y < otherRoom.y + otherRoom.height &&
          otherRoom.y < room.y + room.height) ||
        ((room.y + room.height === otherRoom.y || otherRoom.y + otherRoom.height === room.y) &&
          room.x < otherRoom.x + otherRoom.width &&
          otherRoom.x < room.x + room.width);

      // 20% chance to add extra connections between adjacent rooms
      if (isAdjacent && Math.random() < 0.2 && !room.connections.includes(otherRoom.id)) {
        room.connections.push(otherRoom.id);
        otherRoom.connections.push(room.id);
      }
    });
  });

  return rooms;
};

export const generateBuilding = (width: number, height: number): LayoutGrid => {
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
  building.stories[0].rooms = generateRooms(width, height);

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

        layoutGrid[x][y] = room;
      }
    }
  });

  return layoutGrid;
};
