import type { ChatMessage } from "openai-fetch";

export const museumSystemMessage: ChatMessage = {
  role: "system",
  content: process.env.MUSEUM_PARAMS_SYSTEM_PROMPT!,
};

export const museumUserMessage: ChatMessage = {
  role: "user",
  content: process.env.MUSEUM_PARAMS_PROMPT!,
};
