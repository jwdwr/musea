import type { Buffer } from "buffer";
import { StabilityGenerator } from "./stability";
import type { StabilityConfig } from "./stability/types";

const imagenProvider = "stability";

export type ImageGeneratorConfig = StabilityConfig;

export interface ImageGeneratorOptions {
  count?: number;
  steps?: number;
  width?: number;
  height?: number;
  stylePreset?: string;
}

export abstract class ImageGenerator {
  abstract generateImages(
    prompt: string,
    count: number,
    options?: Partial<ImageGeneratorOptions>
  ): Promise<Buffer[]>;

  static create(provider = imagenProvider, config: ImageGeneratorConfig): ImageGenerator {
    if (provider === "stability") {
      return new StabilityGenerator(config);
    } else {
      throw new Error(`Invalid image generator provider: ${provider}`);
    }
  }
}
