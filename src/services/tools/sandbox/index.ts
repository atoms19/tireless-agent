import { getWorkingdir } from "../../../lib/wordir.ts";
import { DockerEnvironment } from "./dockerEnvironment.ts";


async function testDocker(){

let testEnv = new DockerEnvironment();
await testEnv.initialize(getWorkingdir());


testEnv.execute("ls -la").then((result) => {
	if (result.success) {
		console.log("Command executed successfully:");
		console.log(result.output);
	}
	else {
	  console.log(result)
		console.error("Command execution failed:");
		console.error(result.output);
	}
}).catch((err) => {
	console.error("Error executing command:", err);
}
)


//testEnv.stopEnvironment()
}

//testDocker()
