export interface Tool{
   type:string
   name:string,
	description:string,
   parameters:any,
	 execute:(args:any)=>Promise<any>
}

export type LLMTool = Pick<Tool, "name" | "description" | "parameters" | "type" >;

export interface ToolCall {
  type:'function_call',
	  id:string,
   call_id:string,
	 name:string,
	 arguments:string
}

