import type { TextGenerator } from "..";
import type { MuseumParams } from "@/lib/shared/types";
import { museumSystemMessage, museumUserMessage } from "./messages";
import { museumFunction } from "./functions";
import { Completer } from "./completer/completer";
import { OpenAICompleter } from "./completer/openaiCompleter";
import { ChatMessage, ChatMessageFunction } from "./completer/types";
import { OpenAIFetchCompleter } from "./completer/openaiFetchCompleter";

export class OpenAITextGenerator implements TextGenerator {
  private completer: Completer;

  constructor() {
    this.completer = new OpenAIFetchCompleter();
  }

  generateMuseumParams(nPrompts: number): Promise<MuseumParams> {
    return this.generate([museumSystemMessage, museumUserMessage(nPrompts)], [museumFunction]);
  }

  async generate<T = Record<string, unknown>>(
    messages: ChatMessage[],
    functions?: ChatMessageFunction[]
  ): Promise<T> {
    let retryCount = 0;
    const maxRetries = 2;
    let model = "gpt-3.5-turbo";
    const temperature = 0.9;
    const maxTokens = 1000;

    const completion = await this.completer.completeChat(
      model,
      temperature,
      maxTokens,
      messages,
      functions
    );

    const functionCall = completion?.function_call?.arguments;
    try {
      if (!functionCall) throw new Error("No function call");
      return JSON.parse(functionCall);
    } catch (error) {
      console.error("Failed on message", completion);
      retryCount++;
      if (retryCount === maxRetries) {
        model = "gpt-4-turbo-preview";
      } else if (retryCount > maxRetries) {
        throw new Error(`Invalid JSON: ${functionCall}`);
      }
    }

    throw new Error("Unexpected error in generate function");
  }
}
