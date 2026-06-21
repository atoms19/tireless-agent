
import { join } from "path";
import { homedir } from "os";
import { existsSync, mkdirSync } from "fs";
import { logError, logWarning } from "../lib/logger";

interface ConfigurationService {
	configPath: string;
	defaultProvider: string;
	defaultModel: string;
	effort: string;
}

class ConfigurationService {
	constructor() {
		this.configPath = join(homedir(), ".supercoder/configuration.json");
		this.defaultProvider = "";
		this.defaultModel = "";
		this.effort = "";
	}

	setDefaultProvider(providerName: string) {
		this.defaultProvider = providerName;
		this.saveData();
	}

	getDefaultProvider(): string {
		return this.defaultProvider;
	}

	setDefaultModel(modelName: string) {
		this.defaultModel = modelName;
		this.saveData();
	}

	getDefaultModel(): string {
		return this.defaultModel;
	}

	setEffort(effort: string) {
		this.effort = effort;
		this.saveData();
	}

	getEffort(): string {
		return this.effort;
	}
	
	async loadSavedData() {
		const file = Bun.file(this.configPath);
		if (!await (file.exists())) {
			logError("No configuration exists");
			return;
		}
		let data = (await file.json());
		this.defaultModel = data.defaultModel || "";
		this.effort = data.effort || "";
		this.defaultProvider = data.defaultProvider || "";
	}

	saveData() {
		const dir = join(homedir(), ".supercoder");
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
		const json = JSON.stringify({
			defaultProvider: this.defaultProvider,
			defaultModel: this.defaultModel,
			effort: this.effort
		}, null, 2);

		Bun.write(this.configPath, json);
	}
}

export { ConfigurationService }
