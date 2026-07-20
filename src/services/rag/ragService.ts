import * as lancedb from "@lancedb/lancedb"
import { homedir } from "os";

interface RagService{
    ragClient:any 
}

class RagService {
   constructor(){
	 lancedb.connect(homedir()+"/.supercoder/vector_db").then((value)=>{
		this.ragClient =value
	 }).catch((e)=>{
		  console.log(e)
		  console.log("failed to connect to database for rag");
	 })
  }

  search(query:string){
	   
  }

  uploadDocument(path:string){

  }
}


let instance = new RagService();


export {RagService};
