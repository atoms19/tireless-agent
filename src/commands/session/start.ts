import { Command } from "commander";
import { startTerminalSession } from "../../tui";


const startSession = new Command('start').
  description('starts a new agent session in TUI')
  .action(()=>{
	 startTerminalSession();
  })

export {startSession}
