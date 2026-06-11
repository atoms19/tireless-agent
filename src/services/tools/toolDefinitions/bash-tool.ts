import chalk from "chalk";
import { LLMTool } from "../types";
import { spawn } from "child_process";

export let bashToolSchema:LLMTool =  { 
   type:"function",
   name:"bash",
	description:"allows to run bash commands to perform tasks such as reading files, writing to them, inspecting the codebase and running developer commands and more in users machine",
	parameters:{
      type:"object",
		properties:{
		  command:{
			  type:"string",
			  description:"the bash command to be run, (Do not run any Command that is Desctructive in nature leave such commands to users)"
		  }
		},
		required:["command"],
		additionalProperties:false
	}
}


const execBashTool = (args)=>{
  let command = args.command;
   console.log(chalk.bold.yellowBright("Executing bash command: ", command))
 return new Promise((resolve,reject)=>{

  let child = spawn("bash",["-c",command],{
		stdio:["ignore","pipe","pipe"]
	}); 
	let stdout = ""
	let stderr = ""

	child.stdout.on("data",(data)=>{
	  stdout+= data.toString();
	});
	child.stderr.on("data",(data)=>{
	  stderr+= data.toString();
	})

	child.on("close",(code)=>{
      resolve({
		  stdout:stdout.length>1000 ? stdout.slice(1000) : stdout,
		  stderr,
		  exitCode:code
		})
	})
  child.on("error",(err)=>{
	 		 reject(err);
	})

})
}

export let bashTool = {
	 ...bashToolSchema,
	 execute: execBashTool
}


