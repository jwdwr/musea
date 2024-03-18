import { ChatMessage } from "./completer/types";
import { museumParamsPrompt, museumSystemPrompt } from "./prompts";

export const museumSystemMessage: ChatMessage = {
  role: "system",
  content: museumSystemPrompt,
};

export function museumUserMessage(nPrompts: number): ChatMessage {
  return {
    role: "user",
    content: museumParamsPrompt(nPrompts),
  };
}
