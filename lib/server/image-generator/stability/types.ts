export interface StabilityResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export interface StabilityRequest {
  text_prompts: Array<{ text: string }>;
  cfg_scale: number;
  clip_guidance_preset: string;
  height: number;
  width: number;
  samples: number;
  steps: number;
}

export const defaultStabilityRequest = {
  cfg_scale: 7,
  clip_guidance_preset: "FAST_BLUE",
  height: 512,
  width: 512,
  samples: 1,
  steps: 40,
};
