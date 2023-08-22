import type { Location, Painting, Walls } from "../types";
import { Direction, allDirections } from "./directions";

export class Room {
  public painting: Painting | null = null;

  constructor(
    public location: Location = { x: 0, y: 0 },
    public walls: Walls = {
      [Direction.North]: { direction: Direction.North },
      [Direction.East]: { direction: Direction.East },
      [Direction.South]: { direction: Direction.South },
      [Direction.West]: { direction: Direction.West },
    }
  ) {}

  public removeWall(direction: Direction) {
    this.walls[direction] = null;
  }

  public addPainting(imageUrl: string) {
    const directions = allDirections.filter((direction) => this.walls[direction]);
    const direction = directions[Math.floor(Math.random() * directions.length)];
    this.walls[direction]!.paintingUrl = imageUrl;
  }
}
