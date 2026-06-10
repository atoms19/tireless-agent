import {Database}  from "bun:sqlite"; 

interface SessionManager{
  db:Database 
}


interface SessionMetadata {

}

class SessionManager {
    constructor(){
		this.db = new Database("~/.supercoder/sessions.sqlite",{create:true});

		this.db.exec(`
			 create table sessions if not exists (
                session_id text primary key,
				    model text not null,
					 provider text not null,
				    created_at text not null default (strftime('%Y-%m-%d %H:%M:%f', 'now')),
						 `)
	 }

	 newSession(session:SessionMetadata):string{
       return ''
	 }

	 retrieveSession(sessionId:string){

	 }

}

export {SessionManager}
