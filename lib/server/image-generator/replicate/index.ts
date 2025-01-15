import { Buffer } from "buffer";
import Replicate from "replicate";
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
        .map(() =>
          this.replicate.run(
            this.config.model as `${string}/${string}` | `${string}/${string}:${string}`,
            {
              input: this.getRequest(prompt, options, advanced),
            }
          )
        )
    );

    // Replicate returns the image data directly, we need to fetch and convert to Buffer
    const buffers = await Promise.all(
      outputs.map(async (output) => {
        const imageUrl = output as unknown as string;
        const response = await fetch(imageUrl);
        return Buffer.from(await response.arrayBuffer());
      })
    );

    return buffers;
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
