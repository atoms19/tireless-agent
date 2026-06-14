import chalk from "chalk";
import { LLMTool } from "../types";
import { spawn } from "child_process";
import { PermissionManager, perms } from "../permissionManager";
import { Environment } from "../sandbox/environment";

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

const execBashToolNew = async (environment:Enviroment,args:any)=> {
	 let command = args.command; 
	 console.log(chalk.bold.yellowBright("Executing bash command in docker : ", command))
	 try {
		 let response = await environment.execute(command);
		 return response;

	 } catch (err) {
		 return {
			 stdout:"",
			 stderr:err,
			 exitCode:-1
		 }
	 }

}

const execBashTool = (args:any)=>{
  let command = args.command;
   console.log(chalk.bold.yellowBright("Executing bash command: ", command))
 return new Promise((resolve,reject)=>{
  if (perms.isMalliciousCommand(command)) reject({
	  stdout:"",
	  stderr:"Command rejected due to security reasons",
	  exitCode:1
  })
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
	 execute: execBashToolNew
}


