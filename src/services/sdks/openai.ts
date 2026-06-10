import { LLMessage, LLMSDK } from "."
import type { Tool, ToolCall } from "../tools"

import OpenAI from "openai";
import { logError, logWarning } from "../../lib/logger";



export class openAILLMSDK extends LLMSDK {
	constructor(apiKey: string, url: string) {
		super(new OpenAI({
			apiKey: apiKey,
			baseURL: url
		}))
		this.availableModels = [];
	}

	async *startPrompt(messages: LLMessage[], tools: Tool[]) {
		try {
		 logWarning('new chat entry')
			let response = await this.client.responses.create({
				model: "openai/gpt-oss-120b:free",
				input: messages,
				tools: tools,
				tool_choice: "auto",
				stream: true
			})

			let toolCalls: ToolCall[] = [];

			let currentTool: ToolCall | null = null;
			for await (const chunk of response) {
				yield chunk;
				if (chunk.type === 'response.output_item.added' && chunk.item.type == 'function_call') {
					logError('TOOL CALL STARTED: ')
					currentTool = {
						type: 'function_call',
						id: chunk.item.id,
						call_id: chunk.item.call_id,
						name: chunk.item.name,
						arguments: chunk.item.arguments
					}
				}

				if (chunk.type === 'response.function_call_arguments.delta') {
					if (currentTool) {
						currentTool.arguments += chunk.delta;
					}
				}

				if (chunk.type === 'response.function_call_arguments.done') {

					logError('TOOL CALL ENDED: ')

					if (currentTool) {
						toolCalls.push(currentTool);
						currentTool = null;
					}
				}
			}
			yield toolCalls;
		} catch (e) {
			console.log(e)
			logError('Error in OpenAI LLM SDK:', e as Error);
		}
	}

}
