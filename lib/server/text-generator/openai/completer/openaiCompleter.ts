import OpenAI from "openai";
import { ChatMessage, ChatMessageFunction, ChatMessageResponse } from "./types";
import { Completer } from "./completer";

export class OpenAICompleter implements Completer {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async completeChat(
    model: string,
    temperature: number,
    maxTokens: number,
    messages: ChatMessage[],
    functions?: ChatMessageFunction[]
  ): Promise<ChatMessageResponse> {
    const completion = await this.openai.chat.completions.create({
      model,
      temperature: temperature,
      max_tokens: maxTokens,
      messages,
      functions,
      function_call: "auto",
    });

    return completion.choices[0].message;
  }
}
