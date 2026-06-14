import { bashTool } from "./toolDefinitions/bash-tool";
import { ToolRegistry } from "./registry";
import { spawnSubagentTool } from "./toolDefinitions/spawn-subagent";

const toolReg = new ToolRegistry();
toolReg.register(spawnSubagentTool);
toolReg.register(bashTool)

export { toolReg }
