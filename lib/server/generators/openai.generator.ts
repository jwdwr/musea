import { Generator } from "./generator";
import type { OpenAIChatParams, Tool, Message, ToolCall, Embedder } from "../types/generator.types";
import { type ClientOptions, OpenAI } from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources";

export type CompletionParams =
  OpenAI.Chat.Completions.ChatCompletionCreateParams.ChatCompletionCreateParamsNonStreaming;

const defaultChatParams: OpenAIChatParams = {
  model: "gpt-4o",
};

export class OpenAIGenerator extends Generator<OpenAIChatParams> implements Embedder {
  constructor(
    apiKey: string,
    chatParams: Partial<OpenAIChatParams> = {},
    clientOptions: ClientOptions = {},
    protected openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true, ...clientOptions })
  ) {
    super({ ...defaultChatParams, ...chatParams });
  }

  async completeChat(
    systemPrompt: string,
    userPrompt: string,
    overrides: Partial<ChatCompletionCreateParamsNonStreaming> = {}
  ): Promise<string> {
    const system: ChatCompletionMessageParam[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }]
      : [];
    const messages: ChatCompletionMessageParam[] = [
      ...system,
      { role: "user", content: userPrompt },
    ];
    const params = {
      ...this.chatParams,
      ...overrides,
      messages,
    };
    const response = await this.openai.chat.completions.create(params);
    const completion = response.choices[0]?.message?.content;

    if (completion === null) {
      throw new Error("Unable to generate chat completion");
    }

    return completion;
  }

  async completeChatConversation(systemPrompt: string, messages: Message[]): Promise<string> {
    const params: ChatCompletionCreateParamsNonStreaming = {
      ...this.chatParams,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    };
    const response = await this.openai.chat.completions.create(params);
    const completion = response.choices[0]?.message?.content;

    if (completion === null) {
      throw new Error("Unable to generate chat completion");
    }

    return completion;
  }

  async completeChatFunction<T>(
    systemPrompt: string,
    userPrompt: string,
    fn: Tool,
    overrides: Partial<CompletionParams> = {}
  ): Promise<T> {
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];
    const params: CompletionParams = {
      ...this.chatParams,
      messages,
      tools: [{ type: "function", function: fn }],
      tool_choice: {
        type: "function",
        function: { name: fn.name },
      },
      ...overrides,
    };
    const response = await this.openai.chat.completions.create(params);
    const functionCall = response.choices[0].message?.tool_calls?.[0].function.arguments;

    if (!functionCall) {
      console.error(params, response, response.choices[0].message);
      throw new Error("Unable to generate function call");
    }

    try {
      return JSON.parse(functionCall) as T;
    } catch (error) {
      throw new Error(`Invalid function call JSON: ${functionCall} (${error})`);
    }
  }

  async completeChatConversationWithTools(
    systemPrompt: string,
    messages: Message[],
    tools: Tool[],
    overrides: Partial<CompletionParams> = {}
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const system: ChatCompletionMessageParam[] = systemPrompt
      ? [{ role: "system", content: systemPrompt }]
      : [];
    const params: CompletionParams = {
      ...this.chatParams,
      messages: [...system, ...messages],
      tools: tools.map((tool) => ({ type: "function", function: tool })),
      ...overrides,
    };
    const response = await this.openai.chat.completions.create(params);

    if (!response.choices) {
      console.error(params, response);
      throw new Error("Unable to generate function call");
    }

    const content = response.choices[0]?.message?.content || "";
    const toolCalls =
      response.choices[0]?.message?.tool_calls?.map((call) => {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function.arguments);
        } catch (error) {
          console.error(error, call.function.arguments);
        }
        return {
          name: call.function.name,
          arguments: args,
        };
      }) || [];

    return { content, toolCalls };
  }

  async completeChatWithTools(
    systemPrompt: string,
    userPrompt: string,
    tools: Tool[],
    assistantPrompt?: string,
    overrides: Partial<CompletionParams> = {}
  ): Promise<{ content: string; toolCalls: ToolCall[] }> {
    const messages: Message[] = [{ role: "user", content: userPrompt }];
    if (assistantPrompt) messages.push({ role: "assistant", content: assistantPrompt });
    return this.completeChatConversationWithTools(systemPrompt, messages, tools, overrides);
  }

  async embed(text: string): Promise<number[]> {
    return this.openai.embeddings
      .create({ model: this.chatParams.model, input: text })
      .then((response) => response.data[0].embedding);
  }
}
