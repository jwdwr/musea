import Anthropic from "@anthropic-ai/sdk";
import { Generator } from "./generator";
import type { Tool, ToolCall, AnthropicChatParams } from "../types/generator.types";
import { MessageParam, ToolUseBlock } from "@anthropic-ai/sdk/resources";

const defaultChatParams: AnthropicChatParams = {
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
};

export class AnthropicGenerator extends Generator<AnthropicChatParams> {
  constructor(
    apiKey: string,
    chatParams: Partial<AnthropicChatParams> = {},
    private readonly anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  ) {
    super({ ...defaultChatParams, ...chatParams });
  }

  async completeChat(
    systemPrompt: string,
    userPrompt: string,
    overrides: Partial<Anthropic.Messages.MessageCreateParamsNonStreaming> = {}
  ): Promise<string> {
    const message = await this.anthropic.messages.create({
      ...defaultChatParams,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      ...overrides,
      stream: false,
    });

    return message.content[0].type === "text" ? message.content[0].text : "";
  }

  async completeChatConversation(
    systemPrompt: string,
    messages: MessageParam[],
    overrides: Partial<Anthropic.Messages.MessageCreateParamsNonStreaming> = {}
  ): Promise<string> {
    const message = await this.anthropic.messages.create({
      ...defaultChatParams,
      system: systemPrompt,
      messages,
      stream: false,
      ...overrides,
    });

    return message.content[0].type === "text" ? message.content[0].text : "";
  }

  async completeChatFunction<T>(
    systemPrompt: string,
    userPrompt: string,
    fn: Tool,
    overrides: Partial<Anthropic.MessageCreateParamsNonStreaming> = {}
  ): Promise<T> {
    const params: Anthropic.MessageCreateParamsNonStreaming = {
      ...this.chatParams,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      tools: [
        {
          name: fn.name,
          description: fn.description,
          input_schema: fn.parameters,
        },
      ],
      ...overrides,
    };
    const response = await this.anthropic.messages.create(params);

    const functionCall =
      response.stop_reason === "tool_use" &&
      response.content[0].type === "tool_use" &&
      response.content[0].input;

    if (!functionCall) {
      console.error(params, response);
      throw new Error("Unable to generate function call");
    }

    try {
      return functionCall as T;
    } catch (error) {
      throw new Error(`Invalid function call JSON: ${functionCall} (${error})`);
    }
  }

  async completeChatConversationWithTools(
    systemPrompt: string,
    messages: MessageParam[],
    tools: Tool[],
    overrides: Partial<Anthropic.MessageCreateParamsNonStreaming> = {}
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const params: Anthropic.MessageCreateParamsNonStreaming = {
      ...this.chatParams,
      system: systemPrompt,
      messages,
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters,
      })),
      ...overrides,
    };
    const message = await this.anthropic.messages.create(params);

    // concatenate all text content
    const content = message.content
      .filter((block): block is { type: "text"; text: string } => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // map all tool calls
    const toolCalls = message.content
      .filter((block): block is ToolUseBlock => block.type === "tool_use")
      .map((block) => ({ name: block.name, arguments: block.input as Record<string, unknown> }));

    return { content, toolCalls };
  }

  async completeChatWithTools(
    systemPrompt: string,
    userPrompt: string,
    tools: Tool[],
    assistantPrompt?: string,
    overrides: Partial<Anthropic.MessageCreateParamsNonStreaming> = {}
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const messages: MessageParam[] = [{ role: "user", content: userPrompt }];
    if (assistantPrompt) messages.push({ role: "assistant", content: assistantPrompt });
    return this.completeChatConversationWithTools(systemPrompt, messages, tools, overrides);
  }
}
