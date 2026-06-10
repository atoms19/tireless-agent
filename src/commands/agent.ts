import { Command } from "commander";
import { AgentCaller } from "../services/agentCaller";
import { providerInstance } from "..";
import { LLMessage } from "../services/sdks";


export const agentCommand = new Command("agent")
  .description('starts the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => { 

let currentProvider =providerInstance.listProviders();
let  agentCallerInstance = new AgentCaller(currentProvider[0]); //temporary
 await agentCallerInstance.chat([{
	 role:"user",
	content:options.prompt
  }]);

  });
