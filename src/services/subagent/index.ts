import chalk from "chalk";
import type { Provider } from "../providers";
import { googleLLMSDK } from "../sdks/google";
import { exit } from "process";
import { logError, logWarning } from "../../lib/logger";
import { openAILLMSDK } from "../sdks/openai";
import { LLMessage } from "../sdks";
import { injectSystemPrompt } from "../context/promtInjector";
import { SessionManager } from "../context/contextManager";
import { toolCallCorrector } from "../context/toolCallPreventer";
import { ToolDispatcher } from "../tools/dispatcher";
import { toolReg } from "../tools/index";
import { Environment } from "../tools/sandbox/environment";
import { openAICompletionsLLMSDK } from "../sdks/local";

interface SubAgentCaller {
	LLMProvider: Provider,
	SDK: any,
	toolDispatcher: ToolDispatcher
	environment: Environment,
	name: string,
	systemPrompt: string
}

class SubAgentCaller {
	constructor(provider: Provider, executionEnvironment: Environment, model?: string, effort?: string) {
		if (!provider) {
			logError("FAILED TO START SUBAGENT, NO PROVIDER SELECTED!!");
		}
		this.environment = executionEnvironment;
		switch (provider.providerType) {
			case "gemini":
				this.SDK = new googleLLMSDK(provider.api_key, model);
				break;
			case "openai-responses":
				this.SDK = new openAILLMSDK(provider.api_key, provider.url, model, effort);
				break;
			case "openai-completions":
				this.SDK = new openAICompletionsLLMSDK(provider.api_key, provider.url, model, effort);
				break;
			default:
				logError(chalk.bold.red("INVALID PROVIDER, NOT SUPPORTED!!", provider.providerType));
				exit(1)
		}
		this.toolDispatcher = new ToolDispatcher(toolReg, executionEnvironment)

	}
	async invoke(prompt: string) {
		let messages: LLMessage[] = [];
		messages.push({
			role: "system",
			content: injectSystemPrompt()
		}, {
			role: "user",
			content: prompt
		})

		while (true) {

			let chat = "";
			let reasoning = "";
			let chunk: any;

			for await (chunk of this.SDK.startPrompt(messages, toolReg.getAllToolsForLLM())) {
				if (chunk.type == 'response.reasoning_text.delta') {
					let delta = chunk.delta || '';
					reasoning += delta
					// process.stdout.write(chalk.gray(delta))
				} else {
					if (chat.length == 0 && reasoning.length > 0) {
						process.stdout.write('\n')
					}
					let chatDelta = chunk.delta || '';
					chat += chatDelta;
					// process.stdout.write(chalk.white(chatDelta))
				}
			}
			messages.push({
				role: "assistant",
				content: chat
			})

			let toolcalls = chunk;
			console.log(toolcalls)

			messages = [...messages, ...toolcalls]

			let toolResponses = await this.toolDispatcher.dispatchAll(toolcalls)
			if (toolResponses[0] == "INVALID TOOLCALL") {
				messages.push({
				  role:"user",
				  content : "it seems like you wanted to call a tool but theere was an error in the format  please try again and make sure to =follow correct format for tool calls and arguments"
				})
				continue ;
			}
			let transformedResponses = this.SDK.formatToolResponses(toolResponses)


			messages.push(...transformedResponses)


			console.log(chunk)

			if (toolcalls.length == 0) {
				break;
			}
		}
		return messages[messages.length-1];
	};
}

export { SubAgentCaller }

