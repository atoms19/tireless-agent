type LLMClient =any ;


interface LLMessage{
   role:"user" | "assistant" | "tool" | "system", 
	toolName?:string,
	content:string,
	tool_calls?:any
}

interface LLMSDK{
	 client:LLMClient
	 availableModels: string[]
}

class LLMSDK {
    constructor(client:LLMClient){
		  this.client=client; 
	 }	
}
export {LLMSDK,LLMessage}
