import { Command } from 'commander';
import { setUpCommand } from './setup';
import { removeCommand  } from './remove';

export const providerCommand = new Command("providers")
    .description("Provider related information")
    .addCommand(setUpCommand)
    .addCommand(removeCommand)
