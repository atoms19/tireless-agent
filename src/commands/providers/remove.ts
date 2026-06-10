
import { Command } from 'commander';
import { providerInstance } from '../../index';
import { logWarning } from '../../lib/logger';

export const removeCommand = new Command("remove")
    .description('used to remvoe  a registered provider')
    .option('-p, --provider <providerName>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        logWarning("removing provider " + options.provider)
		  providerInstance.removeProvider(options.provider);
    })



