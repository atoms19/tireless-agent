import { bashTool } from "./toolDefinitions/bash-tool";
import { ToolRegistry } from "./registry";

const toolReg = new ToolRegistry();

toolReg.register(bashTool)

export { toolReg }
