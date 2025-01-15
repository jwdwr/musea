import { OpenAIGenerator } from './openai.generator';
import type { ChatParams } from '../../types/generator.types';

export class OpenRouterGenerator extends OpenAIGenerator {
	constructor(apiKey: string, chatParams: Partial<ChatParams> = {}) {
		super(apiKey, chatParams, {
			baseURL: 'https://openrouter.ai/api/v1',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			fetch: async (url: any, init?: any): Promise<any> => {
				if (init && init.headers) {
					const headers = new Headers(init.headers);
					for (const [key] of (headers as unknown as Map<string, string>).entries()) {
						if (key.toLowerCase().startsWith('x-stainless-')) {
							headers.delete(key);
						}
					}
					init.headers = headers;
				}
				return fetch(url, init);
			}
		});
	}
}
