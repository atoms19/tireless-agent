import { Command } from "commander";
import { providerInstance } from "../index";

export const modelsCommand = new Command("models")
  .description('lists all supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options) => {
     console.log(providerInstance.listProviders());
});
