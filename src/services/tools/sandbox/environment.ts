
export interface Environment{
	  execute:(command:string) => any,
	 isAvailable:()=> Promise<boolean>,
	 initialize:()=>void
	 getEnvironmentId:()=>string
}

