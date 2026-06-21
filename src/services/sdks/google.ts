import { GoogleGenAI } from "@google/genai/node";
import { LLMessage, LLMSDK } from "."
export class googleLLMSDK extends LLMSDK {
   defaultModel: string;

   constructor(apiKey: string, model?: string) {   
		  super(new GoogleGenAI({
				apiKey: apiKey
		  }), "google");

		  this.availableModels = [];
		  this.defaultModel = model || "gemini-2.5-flash";
	}

  async *startPrompt(messages: LLMessage[], tools?: any[]) {
    try { 
		let response = await this.client.models.generateContent({
			 model: this.defaultModel,
			 contents: messages
		});
		yield { type: 'response.text.delta', delta: response.text };
		yield []; // toolcalls placeholder
    } catch(e) {
	    console.log('Error in Google LLM SDK:', e);	
	}
  }

}
