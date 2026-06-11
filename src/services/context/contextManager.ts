import {Database}  from "bun:sqlite"; 
import { LLMessage } from "../sdks";
import { Session } from "node:inspector";

interface SessionManager{
  db:Database 
}


interface SessionMetadata {

}

class SessionManager {
    constructor(){
		this.db = new Database("sessions.sqlite",{create:true});

		this.db.exec(`
			 create table if not exists sessions (
                session_id text primary key,
				    model text,
					 provider text not null,
					 chat_history text, 
				    created_at text not null
			 );
						 `)
	 }

	 newSession(model:string,provider:string):string{
		let sessionId = crypto.randomUUID();
       this.db.prepare(`
				insert into sessions (session_id, model, provider,chat_history,created_at) values (?, ?, ?,?,?)
							  `).run(sessionId, model, provider,'', new Date().toISOString());
		return sessionId;
	 }

	 async retrieveSession(sessionId:string):Promise<LLMessage[]>{
		let session = await this.db.prepare(`
			 select chat_history from sessions where session_id = ?
							 `).get(sessionId)

		return JSON.parse(session.chat_history)

	 }

	 saveSession(sessionId:string,chatHistory:LLMessage[]){
		let sessionHistoryAsString = JSON.stringify(chatHistory);
		this.db.prepare(`
				update sessions set chat_history = ? where session_id = ?
				  `).run(sessionHistoryAsString,sessionId)
	 }
	 

}

export {SessionManager}
