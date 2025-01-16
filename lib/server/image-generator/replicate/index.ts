import { Buffer } from "buffer";
import Replicate, { FileOutput } from "replicate";
import type { ImageGenerator, ImageGeneratorOptions } from "..";
import { defaultReplicateRequest, type ReplicateConfig, type ReplicateRequest } from "./types";

export class ReplicateGenerator implements ImageGenerator {
  private replicate: Replicate;

  constructor(private config: ReplicateConfig) {
    this.replicate = new Replicate({
      auth: config.apiKey,
    });
  }

  public async generateImages(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions = {},
    advanced: Partial<ReplicateRequest> = {}
  ): Promise<Buffer[]> {
    try {
      if (!this.config.apiKey) throw new Error("Missing Replicate API key.");
      if (!this.config.model) throw new Error("Missing Replicate model.");

      if (!/^[^/]+\/[^/:]+(?::[^:]+)?$/.test(this.config.model)) {
        throw new Error(
          "Invalid Replicate model format. Expected 'owner/name' or 'owner/name:version'"
        );
      }

      const outputs = await Promise.all(
        Array(count)
          .fill(null)
          .map(async () => {
            const result = (await this.replicate.run(
              this.config.model as `${string}/${string}` | `${string}/${string}:${string}`,
              {
                input: this.getRequest(prompt, options, advanced),
              }
            )) as FileOutput;
            const blob: Blob = await result.blob();
            const arrayBuffer = await blob.arrayBuffer();
            return Buffer.from(arrayBuffer);
          })
      );

      return outputs;
    } catch (e) {
      console.error("Failed to generate images", e);
      return [];
    }
  }

  private getRequest(
    prompt: string,
    options: ImageGeneratorOptions,
    advanced: Partial<ReplicateRequest>
  ): ReplicateRequest {
    return {
      ...defaultReplicateRequest,
      prompt,
      width: options.width ?? defaultReplicateRequest.width,
      height: options.height ?? defaultReplicateRequest.height,
      ...advanced,
    };
  }
}
