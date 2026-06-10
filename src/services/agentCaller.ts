import chalk from "chalk";
import type { Provider } from "./providers";
import { googleLLMSDK } from "./sdks/google";
import { exit } from "process";
import { logError } from "../lib/logger";
import { openAILLMSDK } from "./sdks/openai";
import { LLMessage } from "./sdks";
import { injectSystemPrompt } from "./context/promtInjector";
import { bashTool, useBashTool } from "./tools";
import { SessionManager } from "./context/contextManager";

interface AgentCaller {
	LLMProvider: Provider,
	SDK: any,
	sessionSaver:SessionManager
}

class AgentCaller {
	constructor(provider: Provider) {
		if (!provider) {
			logError("FAILED TO START AGENT, NO PROVIDER SELECTED!!");
		}

		switch (provider.providerType) {
			case "gemini":
				this.SDK = new googleLLMSDK(provider.api_key);
				break;
			case "openai":
				this.SDK = new openAILLMSDK(provider.api_key, provider.url);
				break;
			default:
				logError(chalk.bold.red("INVALID PROVIDER, NOT SUPPORTED!!", provider.providerType));
				exit(1)
		}

		this.sessionSaver= new SessionManager();

	}
	async chat(prompt: LLMessage[], isbot: boolean = false) {
		let messages: LLMessage[] = [];
		if (!isbot) {
			messages.push({
				role: "system",
				content: injectSystemPrompt()
			}, {
				role: "user",
				content: prompt[prompt.length - 1].content
			})
		} else {
			messages = prompt;
		}


		let chat = "";
		let reasoning = "";
		let chunk: any;
		for await (chunk of this.SDK.startPrompt(messages, [bashTool])) {
			if (chunk.type == 'response.reasoning_text.delta') {
				reasoning += chunk.delta || '';
			} else {
				chat += chunk.delta || '';
			}
		}

		console.log(chalk.gray("REASONING: ", reasoning))
		console.log(chalk.white(chat))

		messages.push({
		   role:"assistant",
		   content:chat
		})

		let toolcalls = chunk;
		let toolResponse: any[] = []
		for (const call of toolcalls) {
			call.arguments = JSON.parse(call.arguments)
			switch (call.name) {
				case "bash":
					console.log(chalk.bold.yellowBright("TOOL CALL: ", call.name, call.arguments))
					let response = await useBashTool(call.arguments.command)
					console.log(response)
					toolResponse.push({
						toolName: call.name,
						call_id: call.call_id,
						response
					})
					call.arguments = JSON.stringify(call.arguments)
					messages.push(call)
					break;
				default:
					logError(chalk.bold.red("UNKNOWN TOOL CALL: ", call.name))
			}
		}

		toolResponse = toolResponse.map(res => {
			return {
				type: "function_call_output",
				call_id: res.call_id,
				output: JSON.stringify(res.response.stdout)
			}
		})
		messages.push(...toolResponse)


		console.log(chunk)


		if (toolcalls.length > 0) {
			await this.chat([...messages], true)
		}
	};
}

export { AgentCaller }
