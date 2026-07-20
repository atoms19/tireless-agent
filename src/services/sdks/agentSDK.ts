import { generateText } from "ai"

import { LLMessage, LLMSDK } from "."

export class vercelSDK extends LLMSDK {
	defaultModel: string;

	constructor(apiKey: string, model?: string) {
		super({
			apiKey: apiKey,
			model: model
		}, "vercel")

		this.availableModels = [];
		this.defaultModel = model || "gemini-2.5-flash";
	}

	async *startPrompt(messages: LLMessage[], tools?: any[]) {
		try {
			let response = await this.client.models.generateContent({
				model: this.defaultModel,
				contents: messages
			});
			yield { type: 'response.text.delta', delta: response.text };
			yield []; // toolcalls placeholder
		} catch (e) {
			console.log('Error in Google LLM SDK:', e);
		}
	}

}
