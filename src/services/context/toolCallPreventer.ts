
export const toolCallCorrector = (chatMsg:string):boolean=>{
    try {
		let jsonMaybe =JSON.parse(chatMsg);
		return true;
	 }catch(e){
		  return false;
	 }
}


