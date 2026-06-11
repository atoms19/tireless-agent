import { Command } from "commander";
import { AgentCaller } from "../services/agentCaller";
import { providerInstance } from "..";
import { LLMessage } from "../services/sdks";
import { SessionManager } from "../services/context/contextManager";


export const agentCommand = new Command("agent")
	.description('starts the agent')
	.option('-p, --prompt <prompt>', 'prompt', '')
	.option('-r, --resume <sessionId>', 'resume previous session with session id', '')
	.action(async (options) => {
		let currentProvider = providerInstance.listProviders();
		let agentCallerInstance = new AgentCaller(currentProvider[0]); //temporary untill default providers are setup
		if (options.resume) {
		    let sessionService = new SessionManager();
		    let sessionHistory:LLMessage[] =  await sessionService.retrieveSession(options.resume);	
			 if(sessionHistory){
				  await agentCallerInstance.chat([...sessionHistory,{
					role:"user",
					content: options.prompt
				}],true)
				return 
			 }
		}
		await agentCallerInstance.chat([{
			role: "user",
			content: options.prompt
		}]);

	});

