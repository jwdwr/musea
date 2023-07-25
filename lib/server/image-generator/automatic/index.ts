import { Buffer } from "buffer";
import type { ImageGeneratorOptions, ImageGenerator } from "..";
import { defaultAutomaticRequest, type AutomaticRequest, type AutomaticResponse } from "./types";

export class AutomaticGenerator implements ImageGenerator {
  public async generateImages(
    prompt: string,
    count = 1,
    options: ImageGeneratorOptions = {},
    advanced: Partial<AutomaticRequest> = {}
  ): Promise<Buffer[]> {
    const apiHost = process.env.AUTOMATIC_API_HOST;
    if (!apiHost) throw new Error("Missing Automatic API host.");

    const response = await fetch(`${apiHost}/sdapi/v1/txt2img`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.getRequest(prompt, count, options, advanced)),
    });

    const data: AutomaticResponse = await response.json();
    return data.images.map((base64) => Buffer.from(base64, "base64"));
  }

  private getRequest(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions,
    advanced: Partial<AutomaticRequest>
  ): AutomaticRequest {
    return {
      ...defaultAutomaticRequest,
      prompt,
      batch_size: count,
      steps: options.steps ?? defaultAutomaticRequest.steps,
      width: options.width ?? defaultAutomaticRequest.width,
      height: options.height ?? defaultAutomaticRequest.height,
      ...advanced,
    };
  }
}
