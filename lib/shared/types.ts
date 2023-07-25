import type { Direction } from "./museum/directions";
import type { Room } from "./museum/room";

export type LayoutGrid = (Room | null)[][];

export interface MuseumPalette {
  light: string;
  medium: string;
  dark: string;
}

export interface MuseumParams {
  theme: string;
  prompt: string;
  palette: MuseumPalette;
}

export type Walls = {
  [key in Direction]: boolean;
};

export interface Location {
  x: number;
  y: number;
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
