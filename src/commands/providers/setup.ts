
import { Command } from 'commander';
import { providerInstance } from '../../index';

export const setUpCommand = new Command("setup")
	.description('Lets user setup a provider (use it as default)')
	.option('-p, --provider <providerType>', 'Name of the provider (gemini, claude etc)', '')
	.option('-a, --api_key <apiKey>', 'Your api key', '')
	.option('-n, --name <name>', 'Provider name', 'Model' + Math.floor(Math.random() * 100))
	.option('-u, --url <url>', 'the url for backend')
	.action((options) => {
		if (options.api_key != "" && options.provider != "" && options.url != "") {
			providerInstance.addProvider(options.provider, options.api_key, options.name, options.url);
			providerInstance.saveData();
		} else {
			console.log(`
you did not pass in valid values type --help along with command to see syntax
						  `);

		}
	})


