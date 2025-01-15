import { OpenAIGenerator } from "./openai.generator";
import type { ChatParams } from "../types/generator.types";

export class LambdaGenerator extends OpenAIGenerator {
  constructor(apiKey: string, chatParams: Partial<ChatParams> = {}) {
    super(apiKey, chatParams, { baseURL: "https://api.lambdalabs.com/v1" });
  }
}
