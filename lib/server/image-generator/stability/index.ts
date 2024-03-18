import { Buffer } from "buffer";
import type { ImageGenerator, ImageGeneratorOptions } from "..";
import {
  defaultStabilityRequest,
  type StabilityConfig,
  type StabilityRequest,
  type StabilityResponse,
} from "./types";

export class StabilityGenerator implements ImageGenerator {
  constructor(private config: StabilityConfig) {}
  public async generateImages(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions = {},
    advanced: Partial<StabilityRequest> = {},
  ): Promise<Buffer[]> {
    const { apiKey, apiHost, model } = this.config;
    if (!apiKey) throw new Error("Missing Stability API key.");
    if (!apiHost) throw new Error("Missing Stability API host.");

    const response = await fetch(`${apiHost}/v1/generation/${model}/text-to-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(this.getRequest(prompt, count, options, advanced)),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON = (await response.json()) as StabilityResponse;
    return responseJSON.artifacts.map((artifact) => Buffer.from(artifact.base64, "base64"));
  }

  private getRequest(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions,
    advanced: Partial<StabilityRequest>,
  ): StabilityRequest {
    return {
      ...defaultStabilityRequest,
      text_prompts: [{ text: prompt }],
      samples: count,
      steps: options.steps ?? defaultStabilityRequest.steps,
      width: options.width ?? defaultStabilityRequest.width,
      height: options.height ?? defaultStabilityRequest.height,
      style_preset: options.stylePreset,
      ...advanced,
    };
  }
}
