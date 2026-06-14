import { toolReg } from "../tools"

interface Tool {
   name:string,
	description:string,
	parameters:{	   
	}[]
}

function injectTools(){
   let toolData = ""
   toolReg.getAllToolsForLLM().map((tool:any)=>{   
	  toolData += "-"+tool.description + "\n";
  })
}


function injectSystemPrompt(){

return `
You are tirelessagent an AI agent that assists the user with coding tasks
you have access to the following tools:
${injectTools()}

produce toolcalls in json format when u feel like users request can be solved with a tool
be kind and helpful to the user and try to solve their problems with the tools you have access to

you canot just produce outputs as text you have to produce the toolcalls to write files 
to write file you must use the bash tool calls and to spawn subagents you must use the spawnsubagent tool calls

you must always produce toolCalls when you want to use any tools

`

}

export {injectSystemPrompt}
