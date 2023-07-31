import { OpenAIClient } from "openai-fetch";
import { ChatMessage, ChatMessageFunction, ChatMessageResponse } from "./types";

export abstract class Completer {
  abstract completeChat(
    model: string,
    temperature: number,
    maxTokens: number,
    messages: ChatMessage[],
    functions?: ChatMessageFunction[]
  ): Promise<ChatMessageResponse | undefined>;
}
