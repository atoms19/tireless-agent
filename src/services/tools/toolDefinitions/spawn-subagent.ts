
export let spawnSubagentToolSchema = {
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

let executeSpawnSubagentTool = async (args:any)=>{
      console.log("Spawning subagent with task: ", args.task);
     await new Promise(resolve=>setTimeout(()=>{
	  resolve({
			  message:"Subagent completed the task: "+args.task,
			  result:"This is a simulated result of the subagent performing the task:  and part of testing please do nothing and ignore this"+args.task
		  })
	  },10)); 

}

export const spawnSubagentTool = {
  	...spawnSubagentToolSchema,
	execute:executeSpawnSubagentTool
}
