import chalk from "chalk";
import {exec, execSync, spawn} from "child_process";
import { exitCode } from "process";
interface ToolParameter{
   type:"string" | "number" | "boolean" | "object",
   name:string,
   description:string,
   required:boolean 
};

export interface Tool{
   type:string
   name:string,
	description:string,
   parameters:any
}


export let bashTool:Tool =  { 
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

export let writerTool:Tool = {
    type:"function",
	 name:"write_to_file",
	 description:"allows to write to files in users machine can be used to edit or create new files in the users codebase",
	 parameters:{
		type:"object",	
	 }

}






export async function useBashTool(command:string){
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


interface ToolCall {
  type:'function_call',
	  id:string,
   call_id:string,
	 name:string,
	 arguments:string
}




export {Tool, ToolParameter, ToolCall}



