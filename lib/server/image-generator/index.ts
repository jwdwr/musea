import type { Buffer } from "buffer";
import { StabilityGenerator } from "./stability";
import type { StabilityConfig } from "./stability/types";
import { ReplicateGenerator } from "./replicate";
import type { ReplicateConfig } from "./replicate/types";

const imagenProvider = "stability";

export type ImageGeneratorConfig = StabilityConfig | ReplicateConfig;

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
      return new StabilityGenerator(config as StabilityConfig);
    } else if (provider === "replicate") {
      return new ReplicateGenerator(config as ReplicateConfig);
    } else {
      throw new Error(`Invalid image generator provider: ${provider}`);
    }
  }
}
