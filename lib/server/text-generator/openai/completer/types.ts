export interface ChatMessage {
  role: "system" | "user" | "assistant" | "function";
  content: string | null;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface ChatMessageResponse {
  role: "system" | "user" | "assistant" | "function";
  content?: string | null;
  function_call?: {
    name?: string;
    arguments?: string;
  };
}

export interface ChatMessageFunction {
  name: string;
  parameters: Record<string, unknown>;
  description: string;
}
