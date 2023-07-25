import type { Location } from "../types";

export enum Direction {
  North,
  East,
  South,
  West,
}

export const allDirections = [Direction.North, Direction.East, Direction.South, Direction.West];

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.North:
      return Direction.South;
    case Direction.East:
      return Direction.West;
    case Direction.South:
      return Direction.North;
    case Direction.West:
      return Direction.East;
  }
}

export function getRotationForDirection(direction: Direction): string {
  return `0 ${[Direction.North, Direction.South].includes(direction) ? 0 : 90} 0`;
}

export function getPositionForDirection(
  center: Location,
  direction: Direction,
  forward = false
): string {
  let position = "";
  const offset = forward ? 6.7 : 6.9;
  switch (direction) {
    case Direction.North:
      position = `${center.x} 3 ${center.y - offset}`;
      break;
    case Direction.East:
      position = `${center.x + offset} 3 ${center.y}`;
      break;
    case Direction.South:
      position = `${center.x} 3 ${center.y + offset}`;
      break;
    case Direction.West:
      position = `${center.x - offset} 3 ${center.y}`;
      break;
  }
  return position;
}
