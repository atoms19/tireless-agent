import { LLMTool, Tool } from "./types";

export class ToolRegistry {
	 private tools:Map<string,Tool>
	 constructor(){
		 this.tools = new Map();
	 }

	 register(tool:Tool){
		 if(this.tools.has(tool.name)){
			 throw new Error(`Tool with name ${tool.name} is already registered`)
		 }
		 this.tools.set(tool.name,tool)
	 }

	 getTool(toolName:string):Tool | undefined{
		 return this.tools.get(toolName);
	 }
	 getAllToolsForLLM():LLMTool[]{
		 return Array.from(this.tools.values()).map(t=>({
			 type:t.type,
			 name:t.name,
			 parameters:t.parameters,
			 description:t.description
		 } as LLMTool));
	 }
	 getAllToolsForSubagent(subagent:string){
         
	 }
}
