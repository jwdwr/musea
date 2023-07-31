import { OpenAIClient } from "openai-fetch";
import { ChatMessage, ChatMessageFunction, ChatMessageResponse } from "./types";

export class OpenAIFetchCompleter {
  private openai: OpenAIClient;

  constructor() {
    this.openai = new OpenAIClient({
      apiKey: process.env.OPENAI_API_KEY,
      fetchOptions: {
        credentials: undefined,
      },
    });
  }

  async completeChat(
    model: string,
    temperature: number,
    maxTokens: number,
    messages: ChatMessage[],
    functions?: ChatMessageFunction[]
  ): Promise<ChatMessageResponse | undefined> {
    const completion = await this.openai.createChatCompletion({
      model,
      temperature: temperature,
      max_tokens: maxTokens,
      messages,
      functions,
      function_call: "auto",
    });

    return completion.response.choices[0].message;
  }
}
