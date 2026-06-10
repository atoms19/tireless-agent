import { GoogleGenAI } from "@google/genai/node";
import { LLMessage, LLMSDK } from "."
export  class googleLLMSDK extends LLMSDK {
   constructor(apiKey:string){   
		  super(new GoogleGenAI({
				apiKey:apiKey
		  }))

		  this.availableModels = [];
	}

 async startPrompt(messages:LLMessage[]){
   try { 
	let response = await this.client.models.generateContent({
			 model:"gemini-2.5-flash",
			 contents:messages
		})
	  for await(const chunk of response){
				 console.log(chunk.text)
	  }
   }catch(e){
	    console.log('Error in Google LLM SDK:', e);	
	}
 }

}
