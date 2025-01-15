export interface ReplicateConfig {
  model: string;
  apiKey: string;
}

export interface ReplicateRequest {
  prompt: string;
  aspect_ratio?: string;
  width?: number;
  height?: number;
}

export const defaultReplicateRequest: Partial<ReplicateRequest> = {
  width: 1024,
  height: 1024,
};
