import { Command } from "commander";
import { configurationInstance } from "../index";

export const configCommand = new Command("config")
	.description("Configuration settings management");

const setCommand = new Command("set")
	.description("Set a configuration option")
	.argument("<key>", "Configuration key (defaultProvider, defaultModel, effort)")
	.argument("<value>", "Value to set")
	.action((key, value) => {
		if (key === "defaultProvider") {
			configurationInstance.setDefaultProvider(value);
			console.log(`defaultProvider set to: ${value}`);
		} else if (key === "defaultModel") {
			configurationInstance.setDefaultModel(value);
			console.log(`defaultModel set to: ${value}`);
		} else if (key === "effort") {
			configurationInstance.setEffort(value);
			console.log(`effort set to: ${value}`);
		} else {
			console.error(`Invalid configuration key: ${key}. Valid keys: defaultProvider, defaultModel, effort`);
		}
	});

const showCommand = new Command("show")
	.description("Show current configuration settings")
	.action(() => {
		console.log("Current Configuration:");
		console.log(`  defaultProvider: ${configurationInstance.defaultProvider || "(not set)"}`);
		console.log(`  defaultModel:    ${configurationInstance.defaultModel || "(not set)"}`);
		console.log(`  effort:          ${configurationInstance.effort || "(not set)"}`);
	});

configCommand.addCommand(setCommand);
configCommand.addCommand(showCommand);
