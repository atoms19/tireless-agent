
import { join } from "path";
import { homedir } from "os";
import { logError, logWarning } from "../lib/logger";

interface ConfigurationService {
	configPath: string,
	defaultProvider:string 
	defaultModel: string,
	effort: string
}

class ConfigurationService {
	constructor() {
		this.configPath = join(homedir(), ".supercoder/configuration.json");
	}

	setDefaultModel(modelName: string) {
		this.defaultModel = modelName;
		this.saveData();
	}

	getDefaultModel():string{
	  return this.defaultModel;
   }
	
	async loadSavedData() {
		const file = Bun.file(this.configPath);
		if (!await (file.exists())) {
			logError("No configuration exists");
			return;
		}
		let data = (await file.json())
		this.defaultModel=data.defaultModel;
		this.effort = data.effort;
		this.defaultProvider = data.defaultProvider
	}

	saveData() {
		// use bun file apis to write the tokens to a file in the user home directory/.supercoder/providers.json
		const file = Bun.file(this.configPath);
		if (!file) {
			Bun.mkdir(join(homedir(), ".supercoder"));
			Bun.write(this.configPath, "{}");
		}
		const json = JSON.stringify({
		  defaultProvider:this.defaultModel,
		  defaultModel:this.defaultModel,
		  effort:this.effort
		}, null, 2);

		Bun.write(this.configPath, json);

	}
}

export { ConfigurationService }
