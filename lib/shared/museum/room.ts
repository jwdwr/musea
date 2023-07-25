import type { Location, Painting, Walls } from "../types";
import { Direction, allDirections } from "./directions";

export class Room {
  public painting: Painting | null = null;

  constructor(
    public location: Location = { x: 0, y: 0 },
    public walls: Walls = {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: true,
    }
  ) {}

  public removeWall(direction: Direction) {
    this.walls[direction] = false;
  }

  public addPainting(imageUrl: string) {
    const directions = allDirections.filter((direction) => this.walls[direction] === true);
    const direction = directions[Math.floor(Math.random() * directions.length)];
    this.painting = { direction, imageUrl };
  }
}
