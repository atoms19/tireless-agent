import chalk from "chalk";
import type { Provider } from "./providers";
import { googleLLMSDK } from "./sdks/google";
import { exit } from "process";
import { logError, logWarning } from "../lib/logger";
import { openAILLMSDK } from "./sdks/openai";
import { LLMessage } from "./sdks";
import { injectSystemPrompt } from "./context/promtInjector";
import { SessionManager } from "./context/contextManager";
import { toolCallCorrector } from "./context/toolCallPreventer";
import { ToolDispatcher } from "./tools/dispatcher";
import { toolReg } from "./tools/index";

interface AgentCaller {
	LLMProvider: Provider,
	SDK: any,
	sessionSaver:SessionManager
	currentSessionId:string,
	toolDispatcher:ToolDispatcher
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
		this.toolDispatcher=new ToolDispatcher(toolReg)

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

			this.currentSessionId = this.sessionSaver.newSession(this.SDK.provider,"dummy model")
         logWarning("new session started with id: "+ this.currentSessionId)

		} else {
			messages = prompt;
		}


		let chat = "";
		let reasoning = "";
		let chunk: any;
		for await (chunk of this.SDK.startPrompt(messages,toolReg.getAllToolsForLLM())) {
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


		let shouldCorrect = toolCallCorrector(chat);
		if(shouldCorrect && isbot && toolcalls && toolcalls?.length == 0){
				        await this.chat([...messages,{
				role:"user",
				content:"It seems like you wanted to call a tool but there was an error in the format, please try again and make sure to follow the correct format for tool calls"
				}],true)
				return;
		}

		messages = [...messages,...toolcalls]

	   let toolResponses= await this.toolDispatcher.dispatchAll(toolcalls) 
       let transformedResponses =this.SDK.formatToolResponses(toolResponses)
		

			messages.push(...transformedResponses)


		console.log(chunk)


		if (toolcalls.length > 0) {
			await this.chat([...messages], true)
		}else{
		   this.sessionSaver.saveSession(this.currentSessionId,messages)
		}
	};
}

export { AgentCaller }

