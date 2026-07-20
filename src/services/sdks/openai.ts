import { LLMessage, LLMSDK } from "."
import type {ToolCall} from '../tools/types'


import OpenAI from "openai";
import { logError, logWarning } from "../../lib/logger";
import { exit } from "process";
import { LLMTool } from "../tools/types";



export class openAILLMSDK extends LLMSDK {
	defaultModel: string;
	effort: string;

	constructor(apiKey: string, url: string, model?: string, effort?: string) {
	  console.log("recieved",apiKey,url)
		super(new OpenAI({
			apiKey: apiKey,
			baseURL: url,
		}), "openai")
		this.availableModels = [];
		this.defaultModel = model || "google/gemma-4-31b-it:free";
		this.effort = effort || "low";
	}

	async *startPrompt(messages: LLMessage[], tools: LLMTool[]) {
		try {
			logWarning('new chat entry')
			let response;

			try {
				const params: any = {
					model: this.defaultModel,
					input: messages,
					tools: tools,
					tool_choice: "auto",
					stream: true
				};
				if (this.effort && (this.defaultModel.startsWith("o1") || this.defaultModel.startsWith("o3"))) {
					params.reasoning_effort = this.effort;
				}
				response = await this.client.responses.create(params);
			} catch (e: any) {
				console.log("Error in OpenAI SDK call:", e);
				if (e.status == 429) {
					logError('Rate limit exceeded. Please try again later.');
					process.exit(1);
				}
				throw e;
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
