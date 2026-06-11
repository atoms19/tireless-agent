import {Database}  from "bun:sqlite"; 

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

	 retrieveSession(sessionId:string){

	 }

}

export {SessionManager}
