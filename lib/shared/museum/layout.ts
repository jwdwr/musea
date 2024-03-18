import { Direction, allDirections, getOppositeDirection } from "./directions";
import { Room } from "./room";
import type { LayoutGrid, Location } from "../types";

export class Layout {
  public grid: LayoutGrid;
  private currentLocation: Location;
  private startLocation: Location;

  constructor(public width = 10, public height = 10) {
    this.grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
    this.startLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height + 1),
    };
    this.grid[this.startLocation.x][this.startLocation.y] = new Room(
      this.positionRelativeToStart(this.startLocation)
    );
    this.currentLocation = this.startLocation;
  }

  private positionRelativeToStart(location: Location): Location {
    return {
      x: location.x - this.startLocation.x,
      y: location.y - this.startLocation.y,
    };
  }

  public generateGrid(totalRooms = 10) {
    this.addRoomInDirection(Direction.North);
    for (let i = 0; i < totalRooms; i++) {
      this.addRoomInRandomDirection();
    }
    const currentRoom = this.grid[this.currentLocation.x][this.currentLocation.y];

    currentRoom?.removeWall(
      getOppositeDirection(
        allDirections.filter((direction) => currentRoom.walls[direction] === null)[0]
      )
    );
  }

  private addRoomInRandomDirection() {
    const directions = [Direction.North, Direction.East, Direction.South, Direction.West];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    this.addRoomInDirection(direction);
  }

  private addRoomInDirection(direction: Direction) {
    const newLocation = this.getNewLocation(direction);
    if (this.isLocationValid(newLocation)) {
      const currentRoom = this.grid[this.currentLocation.x][this.currentLocation.y];
      currentRoom?.removeWall(direction);

      const newRoom = new Room(this.positionRelativeToStart(newLocation));
      newRoom.removeWall(getOppositeDirection(direction));
      this.grid[newLocation.x][newLocation.y] = newRoom;
      this.currentLocation = newLocation;
    }
  }

  private getNewLocation(direction: Direction): Location {
    switch (direction) {
      case Direction.North:
        return { x: this.currentLocation.x, y: this.currentLocation.y - 1 };
      case Direction.East:
        return { x: this.currentLocation.x + 1, y: this.currentLocation.y };
      case Direction.South:
        return { x: this.currentLocation.x, y: this.currentLocation.y + 1 };
      case Direction.West:
        return { x: this.currentLocation.x - 1, y: this.currentLocation.y };
    }
  }

  private isLocationValid(location: Location): boolean {
    return (
      location.x >= 0 &&
      location.x < this.width &&
      location.y >= 0 &&
      location.y < this.height &&
      this.grid[location.x][location.y] === null
    );
  }

  public listRooms(): Room[] {
    return this.grid.flat().filter((room) => room !== null) as Room[];
  }

  static generateLayout(width: number, height: number) {
    const layout = new Layout(width, height);
    layout.generateGrid();
    return layout;
  }
}
