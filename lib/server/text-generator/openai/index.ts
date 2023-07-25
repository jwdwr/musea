import { OpenAIClient, type ChatMessageFunction, type ChatMessage } from "openai-fetch";
import type { TextGenerator } from "..";
import type { MuseumParams } from "@/lib/shared/types";
import { museumSystemMessage, museumUserMessage } from "./messages";
import { museumFunction } from "./functions";

export class OpenAITextGenerator implements TextGenerator {
  private openai: OpenAIClient;

  constructor() {
    this.openai = new OpenAIClient({
      apiKey: process.env.OPENAI_API_KEY,
      fetchOptions: {
        credentials: undefined,
      },
    });
  }

  generateMuseumParams(): Promise<MuseumParams> {
    return this.generate([museumSystemMessage, museumUserMessage], [museumFunction]);
  }

  async generate<T = Record<string, unknown>>(
    messages: ChatMessage[],
    functions?: ChatMessageFunction[]
  ): Promise<T> {
    let retryCount = 0;
    const maxRetries = 2;
    let model = "gpt-3.5-turbo-0613";
    const temperature = 0.7;
    const maxTokens = 1000;

    while (retryCount <= maxRetries) {
      const completion = await this.openai.createChatCompletion({
        model,
        temperature: temperature,
        max_tokens: maxTokens,
        messages,
        functions,
        function_call: "auto",
      });

      const functionCall = completion.message?.function_call?.arguments;
      try {
        if (!functionCall) throw new Error("No function call");
        return JSON.parse(functionCall);
      } catch (error) {
        console.error("Failed on message", completion.message);
        retryCount++;
        if (retryCount === maxRetries) {
          model = "gpt-4-0613";
        } else if (retryCount > maxRetries) {
          throw new Error(`Invalid JSON: ${functionCall}`);
        }
      }
    }

    throw new Error("Unexpected error in generate function");
  }
}
