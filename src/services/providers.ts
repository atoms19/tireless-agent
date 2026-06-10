import {join} from "path";
import { homedir } from "os";
import chalk from "chalk";
import { logError, logWarning } from "../lib/logger";

type ProviderTypes = "gemini" | "openai" |  "claude" | "custom"

type Provider = {
  api_key:string,
  name:string
  id: string,
  providerType:ProviderTypes
  url:string
}

interface ProviderService {
   providers: Map<String,Provider>,
	configPath: string,
}

class ProviderService {
     constructor(){
	   this.configPath= join(homedir(), ".supercoder/providers.json");
		this.providers=new Map<String,Provider>(); 
	}
  
  addProvider(providerType:ProviderTypes,api_key:string,providerName:string,url:string) { 
		  this.providers.set(providerName, {
           api_key,
			  providerType,
			  name: providerName,
			  id: ""+Math.random()*100,
			  url
		  } as Provider);
		  this.saveData();
  }

  getProvider(name: string): Provider | undefined {
	   return this.providers.get(name);
  }

  listProviders(): Provider[] { 
	   return Array.from(this.providers.values()); 
	}

	async loadSavedData(){
	   const file = Bun.file(this.configPath);
	   if(!await (file.exists())) {
		   logError("No providers found, please add a provider using the setup command");
		   return;
	   }
      (await file.json()).forEach((provider:Provider) => {
				  this.providers.set(provider.name, provider);
		  });
	}

	saveData(){
	     // use bun file apis to write the tokens to a file in the user home directory/.supercoder/providers.json
	  const file = Bun.file(this.configPath);  
	  if (!file ){
			   Bun.mkdir(join(homedir(), ".supercoder"));
				Bun.write(this.configPath, "[]");
		}
	  const json = JSON.stringify(Array.from(this.providers.values()),null,2);

	    Bun.write(this.configPath, json);

	}
	removeProvider(name:string){
     this.providers.delete(name);
	  logWarning('Provider removed successfully');
	  this.saveData();
	  this.loadSavedData();
	}

}

export { ProviderService, Provider, ProviderTypes }
