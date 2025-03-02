import type { Direction } from "./museum/directions";

export type LayoutGrid = (Room | null)[][];

export interface MuseumPalette {
  light: string;
  medium: string;
  dark: string;
}

export interface MuseumParams {
  theme: string;
  prompts: string[];
  palette: MuseumPalette;
}

export type Walls = {
  [key in Direction]: Wall | null;
};

export interface Wall {
  direction: Direction;
  paintingUrl?: string;
  hasDoor?: boolean;
  hasWindow?: boolean;
  materials?: {
    walls?: TextureMaps;
  };
}

export interface Location {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
  depth: number;
}

export interface TextureMaps {
  diffuse?: string; // Base color/diffuse texture
  normal?: string; // Normal map texture
  arm?: string; // Ambient Occlusion, Roughness, Metallic combined texture
}

export interface RoomMaterials {
  floor?: TextureMaps;
  walls?: TextureMaps;
  ceiling?: TextureMaps;
}

export interface Room {
  location: Location;
  size: Size;
  walls: Walls;
  materials?: RoomMaterials;
}

export interface Museum {
  params: MuseumParams;
  grid: LayoutGrid;
}

export interface Painting {
  direction: Direction;
  imageUrl?: string;
}

export interface MuseumGenerationRecord {
  status: "generating" | "generated" | "failed";
  museum?: Museum;
  error?: string;
}

export interface GeneratingMuseum {
  status: "generating";
}

export interface GeneratedMuseum {
  status: "generated";
  museum: Museum;
}

export interface FailedMuseumGeneration {
  status: "failed";
  error: string;
}

export type MuseumGeneration = GeneratingMuseum | GeneratedMuseum | FailedMuseumGeneration;
