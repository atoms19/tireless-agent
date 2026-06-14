
export interface PermissionManager {  
}
export class PermissionManager {
  private permissions:string[];
  private fullAccess = false;
  constructor (){
     this.permissions=["read","edit"]
  }
  isMalliciousCommand(command:string):boolean{
	 if(this.fullAccess) return false;
	 const destructveCommands = ["rm","del","mv","rmdir","shutdown","reboot","format","mkfs","dd",">:","|&",">>"];
	 for(let cmd of destructveCommands){
		 if(command.startsWith(cmd)){
			 return true;
		 }
	 }
	 return false;
  }

  permitFullAccess(){
		   this.fullAccess = true;
  }


}

export let perms = new PermissionManager();
perms.permitFullAccess()
