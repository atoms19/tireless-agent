#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import {App} from './app.tsx';
import {DockerEnvironment} from "../../services/tools/sandbox/DockerEnvironment.ts"
import {getWorkingdir} from "../../lib/wordir.ts"
import {AgentCaller} from "../../services/AgentCaller.ts"
import {providerInstance, configurationInstance} from "../../index.ts"
import {SessionManager} from "../../services/context/contextManager.ts"
/*
 *	let currentProvider = providerInstance.listProviders();
		let executionEnvironment = new DockerEnvironment();
		await executionEnvironment.initialize(getWorkingdir());
		let agentCallerInstance = new AgentCaller(currentProvider[0], executionEnvironment); //temporary untill default providers are setup
		if (options.resume) {
			let sessionService = new SessionManager();
			let sessionHistory: LLMessage[] = await sessionService.retrieveSession(options.resume);
			if (sessionHistory) {
				await agentCallerInstance.chat([...sessionHistory, {
					role: "user",
					content: options.prompt
				}], true)
				return
			}
		}
		await agentCallerInstance.chat([{
			role: "user",
			content: options.prompt
		}]);
		await executionEnvironment.stopEnvironment();
	})
*/
export async function startTerminalSession(){
	let executionEnvironment = new DockerEnvironment();
	await executionEnvironment.initialize(getWorkingdir());
	let selectedProvider = providerInstance.getProvider(configurationInstance.defaultProvider);
	if (!selectedProvider) {
		let currentProviders = providerInstance.listProviders();
		selectedProvider = currentProviders[0];
	}
	let agentCallerInstance = new AgentCaller(
		selectedProvider,
		executionEnvironment,
		configurationInstance.defaultModel,
		configurationInstance.effort
	);
	let sessionService = new SessionManager();
	render(
		<App
			environment={executionEnvironment}
			client={agentCallerInstance}
			session={sessionService}
			defaultModel={configurationInstance.defaultModel}
			effort={configurationInstance.effort}
		/>
	);
}
