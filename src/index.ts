import { program } from 'commander';
import { modelsCommand } from './commands/models';
import { agentCommand } from './commands/agent';
import { providerCommand } from './commands/providers';
import { ProviderService, ConfigurationService } from './services';
import chalk from 'chalk';
import {AgentCaller} from './services/agentCaller';
import { sessionCommand } from './commands/session/index';
import { configCommand } from './commands/config';


export let providerInstance = new ProviderService();
export let configurationInstance = new ConfigurationService();
let agentCallerInstance:AgentCaller;

try{
  await providerInstance.loadSavedData()
  console.log(chalk.green('cached credentials loaded successfully'))
}catch(e){
  console.log(chalk.red('could not load cached credentials'))
  console.log(e)
}

try{
  await configurationInstance.loadSavedData()
console.log(chalk.green('configuration loaded successfully'))
}catch(e){
  console.log(chalk.red('could not load configuration'))
}

program
  .name('tireless agent')
  .description('Very Powerful Coding Agent powered by your terminal')
  .version('1.1.0')
  .addCommand(modelsCommand)
  .addCommand(agentCommand)
  .addCommand(sessionCommand)
  .addCommand(providerCommand)
  .addCommand(configCommand);
program.parse()

export {agentCallerInstance}
