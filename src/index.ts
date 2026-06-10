import { program } from 'commander';
import { modelsCommand } from './commands/models';
import { agentCommand } from './commands/agent';
import { providerCommand } from './commands/providers';
import { ProviderService } from './services';
import chalk from 'chalk';
import {AgentCaller} from './services/agentCaller';


export let providerInstance = new ProviderService();
let agentCallerInstance:AgentCaller;

try{
await providerInstance.loadSavedData()
console.log(chalk.green('cached credentials loaded successfully'))
}catch(e){
  console.log(chalk.red('could not load cached credentials'))
  console.log(e)
}

program
  .name('supercoder')
  .description('Very Powerful Coding Agent powered by your terminal')
  .version('1.1.0')
  .addCommand(modelsCommand)
  .addCommand(agentCommand)
  .addCommand(providerCommand);
program.parse()

export {agentCallerInstance}
