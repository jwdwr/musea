import type { Location, Painting, Size, Walls, RoomMaterials } from "../types";
import { Direction, allDirections } from "./directions";

export class Room {
  public painting: Painting | null = null;

  public walls: Walls = {
    [Direction.North]: { direction: Direction.North },
    [Direction.South]: { direction: Direction.South },
    [Direction.East]: { direction: Direction.East },
    [Direction.West]: { direction: Direction.West },
  };

  public materials?: RoomMaterials;

  constructor(
    public location: Location = { x: 0, y: 0 },
    public size: Size = { width: 1, height: 1, depth: 1 }
  ) {}

  public removeWall(direction: Direction) {
    this.walls[direction] = null;
  }

  public addDoor(direction: Direction) {
    if (this.walls[direction]) {
      this.walls[direction]!.hasDoor = true;
      if (this.materials) {
        this.walls[direction]!.materials = { walls: this.materials.walls };
      }
    }
  }

  public addPainting(imageUrl: string) {
    const directions = allDirections.filter(
      (direction) => this.walls[direction] && !this.walls[direction]?.hasDoor
    );
    const direction = directions[Math.floor(Math.random() * directions.length)];
    if (direction !== undefined) {
      this.walls[direction]!.paintingUrl = imageUrl;
      if (this.materials) {
        this.walls[direction]!.materials = { walls: this.materials.walls };
      }
    }
  }

  public updateWallMaterials() {
    if (!this.materials) return;

    allDirections.forEach((direction) => {
      if (this.walls[direction]) {
        this.walls[direction]!.materials = { walls: this.materials!.walls };
      }
    });
  }
}
