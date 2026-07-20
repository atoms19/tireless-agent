import { SubAgentCaller } from "../../subagent";
import {configurationInstance,providerInstance} from "../../../index"
import { Environment } from "../sandbox/environment";
import { LLMTool, Tool } from "../types";

export let spawnSubagentToolSchema:LLMTool= {
    type:"function",
    name:"spawnsubagent",
	description:"allows to spawn a subagent with a specific task to do things such as research the codebase ",
	parameters:{
			 type:"object",
			 properties:{
				 task:{
					 type:"string",
					 description:"the task the subagent should perform, be specific and clear in your instructions"
				 }
				 			 },
			 required:["task"],
			 additionalProperties:false
	}
}


let executeSpawnSubagentTool = async (environment:Environment,args:any)=>{
      console.log("Spawning subagent with task: ", args.task);
		let selectedProvider = providerInstance.getProvider(configurationInstance.defaultProvider)
		if(selectedProvider==undefined){
		   return 
		}
	  const subagent  = new SubAgentCaller(
      selectedProvider!,
		environment,
	  ) 

	  try {
		 const subagentResult = await subagent.invoke(args.task);
		 return {
			 message:`subagent completed the task : ${args.task} `,
			 result: subagentResult?.content || "NO output generated"
		 }
	 }catch (e){
		  return {error:`subagent encountered an error`}
	 }


}

export const spawnSubagentTool = {
  	...spawnSubagentToolSchema,
	execute:executeSpawnSubagentTool
};
