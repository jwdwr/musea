export const generatorNames = ['openai', 'anthropic', 'lambda', 'groq', 'openrouter'] as const;
export type GeneratorName = (typeof generatorNames)[number];

export interface ChatParams {
	model: string;
	max_tokens?: number;
	temperature?: number;
	top_p?: number;
}

export interface AnthropicChatParams extends ChatParams {
	max_tokens: number;
}

export interface OpenAIChatParams extends ChatParams {
	frequency_penalty?: number;
	presence_penalty?: number;
}

export interface Tool {
	name: string;
	description: string;
	parameters: {
		type: 'object';
		properties?: unknown | null;
		[k: string]: unknown;
	};
}

export interface ToolCall<T extends Record<string, unknown> = Record<string, unknown>> {
	name: string;
	arguments: T;
}

export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export interface Embedder {
	embed(text: string): Promise<number[]>;
}
