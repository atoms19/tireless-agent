import { LLMessage, LLMSDK } from "."
import type {ToolCall} from '../tools/types'


import OpenAI from "openai";
import { logError, logWarning } from "../../lib/logger";
import { exit } from "process";
import { LLMTool } from "../tools/types";



export class openAICompletionsLLMSDK extends LLMSDK {
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
				let formattedMessages: any[] = [];
				for (const msg of messages as any[]) {
					if (msg.type === 'function_call') {
						let lastAssistantMsg = formattedMessages[formattedMessages.length - 1];
						if (!lastAssistantMsg || lastAssistantMsg.role !== 'assistant') {
							lastAssistantMsg = { role: 'assistant', content: null, tool_calls: [] };
							formattedMessages.push(lastAssistantMsg);
						}
						if (!lastAssistantMsg.tool_calls) lastAssistantMsg.tool_calls = [];
						lastAssistantMsg.tool_calls.push({
							id: msg.call_id,
							type: 'function',
							function: {
								name: msg.name,
								arguments: msg.arguments
							}
						});
					} else if (msg.type === 'function_call_output') {
						formattedMessages.push({
							role: 'tool',
							tool_call_id: msg.call_id,
							content: msg.output
						});
					} else {
						formattedMessages.push({ ...msg });
					}
				}

				const params: any = {
					model: this.defaultModel,
					messages: formattedMessages,
					stream: true
				};
				if (tools && tools.length > 0) {
					params.tools = tools.map((t: any) => {
						if (t.type === 'function' && t.name) {
							return {
								type: 'function',
								function: {
									name: t.name,
									description: t.description,
									parameters: t.parameters
								}
							};
						}
						return t;
					});
					params.tool_choice = "auto";
				}
				if (this.effort && (this.defaultModel.startsWith("o1") || this.defaultModel.startsWith("o3"))) {
					params.reasoning_effort = this.effort;
				}
				response = await this.client.chat.completions.create(params);
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
				const delta = chunk.choices[0]?.delta;
				if (!delta) continue;

				if (delta.content) {
					yield { delta: delta.content };
				} else if (delta.reasoning_content) {
					yield { type: 'response.reasoning_text.delta', delta: delta.reasoning_content };
				}

				if (delta.tool_calls) {
					for (const toolCall of delta.tool_calls) {
						if (toolCall.id) {
							if (currentTool) {
								toolCalls.push(currentTool);
							}
							currentTool = {
								type: 'function_call',
								id: toolCall.id,
								call_id: toolCall.id,
								name: toolCall.function?.name || '',
								arguments: toolCall.function?.arguments || ''
							};
						} else if (currentTool && toolCall.function?.arguments) {
							currentTool.arguments += toolCall.function.arguments;
						}
					}
				}
			}

			if (currentTool) {
				toolCalls.push(currentTool);
				currentTool = null;
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
