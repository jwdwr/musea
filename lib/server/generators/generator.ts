import type { ChatParams, Message, Tool, ToolCall } from "../types/generator.types";

export abstract class Generator<T extends ChatParams = ChatParams> {
  protected chatParams: T;

  constructor(chatParams: T) {
    this.chatParams = chatParams;
  }

  abstract completeChat(
    systemPrompt: string,
    userPrompt: string,
    overrides?: Record<string, unknown>
  ): Promise<string>;

  abstract completeChatFunction<T>(systemPrompt: string, userPrompt: string, fn: Tool): Promise<T>;

  abstract completeChatConversation(systemPrompt: string, messages: Message[]): Promise<string>;

  abstract completeChatConversationWithTools(
    systemPrompt: string,
    messages: Message[],
    tools: Tool[],
    overrides?: Partial<ChatParams>
  ): Promise<{ content: string; toolCalls: ToolCall[] }>;

  abstract completeChatWithTools(
    systemPrompt: string,
    userPrompt: string,
    tools: Tool[],
    assistantPrompt?: string,
    overrides?: Partial<ChatParams>
  ): Promise<{ content: string; toolCalls: ToolCall[] }>;

  async simulateChatWithTools(
    systemPrompt: string,
    userPrompt: string,
    tools: Tool[],
    overrides?: Partial<ChatParams>
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const toolDescriptions = JSON.stringify(tools);
    const adaptedPrompt = `${userPrompt}

    Available tools:
    ${toolDescriptions}

    To use a tool, respond with a JSON object in the following format:
    {"name": "tool_name", "arguments": {"param1": "value1", "param2": "value2"}}

    You can use multiple tools by providing an array of such objects.`;

    const response = await this.completeChat(systemPrompt, adaptedPrompt, overrides);

    const toolCalls = this.parseToolCalls(response);
    const content = toolCalls.length > 0 ? "" : response;

    return { content, toolCalls };
  }

  private parseToolCalls(response: string): ToolCall[] {
    try {
      const jsonResponse = JSON.parse(response);
      if (Array.isArray(jsonResponse)) {
        return jsonResponse.map((call) => ({
          name: call.name,
          arguments: call.arguments,
        }));
      } else if (jsonResponse.name && jsonResponse.arguments) {
        return [
          {
            name: jsonResponse.name,
            arguments: jsonResponse.arguments,
          },
        ];
      }
    } catch (error) {
      // if parsing fails, return an empty array
      console.error("failed to parse tool calls:", error);
    }
    return [];
  }
}
