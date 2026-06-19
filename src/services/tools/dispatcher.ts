import chalk from "chalk";
import { ToolRegistry } from "./registry";
import { Environment } from "./sandbox/environment";
import { logWarning } from "../../lib/logger";


interface ToolDispatcher {
	tooRegistry: ToolRegistry
	exectionEnvironment:Environment
}

class ToolDispatcher {
	constructor(toolRegistry: ToolRegistry, executionEnvironment: Environment) {
		this.tooRegistry = toolRegistry;
		this.exectionEnvironment = executionEnvironment;
	}

	async dispatchAll(toolCalls: any[]) {
		let toolResponse: any[] = []
		for (let toolCall of toolCalls) {
		  logWarning("toolcall to be made:")
		  console.log(toolCall);
		  console.log(toolCall.arguments)
		  
			let parsedArguments=""
			try{
			parsedArguments= JSON.parse(toolCall.arguments);
			}catch{
				try {
				  parsedArguments=JSON.parse(toolCall.arguments.slice(1));
				}catch {
					 parsedArguments=JSON.parse(toolCall.arguments.slice(-1));
				}
			}
			let toolRequired = this.tooRegistry.getTool(toolCall.name)
			if (toolRequired == undefined) {
				console.log(chalk.bold.red("TOOL NOT REGISTERED: ", toolCall.name))
				continue;
			}
			let response = await toolRequired.execute(this.exectionEnvironment,parsedArguments)
			toolResponse.push({
				call_id: toolCall.call_id,
			  response})
		}
		return toolResponse;
	}


}

export {ToolDispatcher}
