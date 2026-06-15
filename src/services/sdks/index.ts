type LLMClient =any ;


interface LLMessage{
   role:"user" | "assistant" | "tool" | "system", 
	toolName?:string,
	reasoning?:string,
	content:string,
	tool_calls?:any
}

interface LLMSDK{
	 client:LLMClient
	 sdkName:string
	 availableModels: string[]
}

class LLMSDK {
    constructor(client:LLMClient, sdkName:string){
		  this.client=client; 
		  this.sdkName=sdkName;
	 }	
}
export {LLMSDK,LLMessage}
