import chalk from "chalk";

export function  logError(message:string,error?:Error) {
   console.log(chalk.bold.red(message.toUpperCase()));
}

export function logWarning(message:string){
	 console.log(chalk.yellow(message));
}
