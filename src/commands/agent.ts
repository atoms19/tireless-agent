import { Command } from "commander";
import { AgentCaller } from "../services/agentCaller";
import { providerInstance } from "..";
import { LLMessage } from "../services/sdks";
import { SessionManager } from "../services/context/contextManager";
import { DockerEnvironment } from "../services/tools/sandbox/dockerEnvironment";
import { getWorkingdir } from "../lib/wordir";


export const agentCommand = new Command("agent")
	.description('starts the agent')
	.option('-p, --prompt <prompt>', 'prompt', '')
	.option('-r, --resume <sessionId>', 'resume previous session with session id', '')
	.action(async (options) => {
		let currentProvider = providerInstance.listProviders();
		let executionEnvironment = new DockerEnvironment();
		await executionEnvironment.initialize(getWorkingdir());
		let agentCallerInstance = new AgentCaller(currentProvider[0], executionEnvironment); //temporary untill default providers are setup
		if (options.resume) {
			let sessionService = new SessionManager();
			let sessionHistory: LLMessage[] = await sessionService.retrieveSession(options.resume);
			if (sessionHistory) {
				await agentCallerInstance.chat([...sessionHistory, {
					role: "user",
					content: options.prompt
				}], true)
				return
			}
		}
		await agentCallerInstance.chat([{
			role: "user",
			content: options.prompt
		}]);
		await executionEnvironment.stopEnvironment();
	});

