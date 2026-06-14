import chalk from "chalk";
import { ToolRegistry } from "./registry";

interface ToolDispatcher {
	tooRegistry: ToolRegistry
}

class ToolDispatcher {
	constructor(toolRegistry: ToolRegistry) {
		this.tooRegistry = toolRegistry;
	}

	async dispatchAll(toolCalls: any[]) {
		let toolResponse: any[] = []
		for (let toolCall of toolCalls) {
			let parsedArguments = JSON.parse(toolCall.arguments);
			let toolRequired = this.tooRegistry.getTool(toolCall.name)
			if (toolRequired == undefined) {
				console.log(chalk.bold.red("TOOL NOT REGISTERED: ", toolCall.name))
				continue;
			}
			let response = await toolRequired.execute(parsedArguments)
			toolResponse.push({
				call_id: toolCall.call_id,
			  response})
		}
		return toolResponse;
	}


}

export {ToolDispatcher}
