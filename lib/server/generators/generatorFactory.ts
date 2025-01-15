import { Generator } from "./generator";
import { OpenAIGenerator } from "./openai.generator";
import { AnthropicGenerator } from "./anthropic.generator";
import { LambdaGenerator } from "./lambda.generator";
import { OpenRouterGenerator } from "./openrouter.generator";
import type { ChatParams } from "../types/generator.types";

export class GeneratorFactory {
  static createGenerator(
    provider: { generator: string; apiKey: string },
    chatParams?: Partial<ChatParams>
  ): Generator {
    switch (provider.generator) {
      case "openai":
        return new OpenAIGenerator(provider.apiKey, chatParams);
      case "anthropic":
        return new AnthropicGenerator(provider.apiKey, chatParams);
      case "lambda":
        return new LambdaGenerator(provider.apiKey, chatParams);
      case "openrouter":
        return new OpenRouterGenerator(provider.apiKey, chatParams);
      default:
        throw new Error(`Unsupported generator: ${provider.generator}`);
    }
  }
}
