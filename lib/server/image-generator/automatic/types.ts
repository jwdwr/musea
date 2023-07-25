export interface AutomaticResponse {
  images: string[];
}

export interface AutomaticRequest {
  prompt: string;
  sampler_index: string;
  steps: number;
  width: number;
  height: number;
  batch_size: number;
}

export const defaultAutomaticRequest = {
  sampler_index: "DPM++ SDE Karras",
  steps: 100,
  width: 512,
  height: 512,
  batch_size: 1,
};
