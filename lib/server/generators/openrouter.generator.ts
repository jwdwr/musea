import { ChatParams } from "../types/generator.types";
import { OpenAIGenerator } from "./openai.generator";

export class OpenRouterGenerator extends OpenAIGenerator {
  constructor(apiKey: string, chatParams: Partial<ChatParams> = {}) {
    super(apiKey, chatParams, {
      baseURL: "https://openrouter.ai/api/v1",
      fetch: async (url: any, init?: any): Promise<any> => {
        if (init && init.headers) {
          const headers = new Headers(init.headers);
          for (const [key] of headers.entries()) {
            if (key.toLowerCase().startsWith("x-stainless-")) {
              headers.delete(key);
            }
          }
          init.headers = headers;
        }
        return fetch(url, init);
      },
    });
  }
}
