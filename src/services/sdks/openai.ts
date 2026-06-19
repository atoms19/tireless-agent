import { LLMessage, LLMSDK } from "."
import type {ToolCall} from '../tools/types'


import OpenAI from "openai";
import { logError, logWarning } from "../../lib/logger";
import { exit } from "process";
import { LLMTool } from "../tools/types";



export class openAILLMSDK extends LLMSDK {
	constructor(apiKey: string, url: string) {
		super(new OpenAI({
			apiKey: apiKey,
			baseURL: url,
		}), "openai")
		this.availableModels = [];
	}

	async *startPrompt(messages: LLMessage[], tools: LLMTool[]) {
		try {
			logWarning('new chat entry')
			let response;

			try {

				response = await this.client.responses.create({
					model: "google/gemma-4-31b-it:free",
					input: messages,
					tools: tools,
					tool_choice: "auto",
					stream: true
				})
			} catch (e) {
				if (e.status == 429) {
					logError('Rate limit exceeded. Please try again later.');
					exit()
				}
			}

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

	formatToolResponses(toolResponses:any[]):any[]{
		  return toolResponses.map(res => {
			 return {
				type: "function_call_output",
				call_id: res.call_id,
				output: JSON.stringify(res.response)
			}
		})
	}
}
