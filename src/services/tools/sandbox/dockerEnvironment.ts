import { spawn } from 'child_process';
import { Environment } from './environment';



export class DockerEnvironment extends Environment {
	private environmentProcess: any;
	private imageName: string = "vimbox:latest";
	private currentContainerName: string | null = null;
	constructor() {
		super()
	}
	async isAvailable(): Promise<boolean> {
		return new Promise((resolve) => {
			let check = spawn("bash", ["-c", "docker -v"], {
				stdio: "pipe"
			})

			check.on("error", () => {
				resolve(false)
			})

			check.on("exit", (code) => {
				if (code === 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}

	async buildImage() {
		return new Promise((resolve, reject) => {
			let build = spawn("bash", ["-c", "docker build -t " + this.imageName + "."], {
				stdio: "pipe"
			})

			build.on("error", (err: any) => {
				console.error("Failed to build image:", err)
				reject(err)
			})

			build.stdout.on("data", (data: any) => {
				console.log(`Build output: ${data}`)

			})

			build.on("exit", (code: any) => {
				if (code === 0) {
					console.log("Image built successfully")
					resolve(true)
				} else {
					console.error("Image build failed with code " + code)
					reject(new Error("Image build failed with code " + code))
				}
			})
		})

	}

	async StartEnvironment(environmentImage: string) {
		if (!await this.hasImageReady(environmentImage)) {
			console.error("Environment image not found:", environmentImage)
			return;
		} else {
			try {
				let res = await this.buildImage();
			} catch (err) {
				console.error("Failed to build environment image:", err)
				return;
			}

		}
		let namegen = crypto.randomUUID();
		this.environmentProcess = spawn("bash", ["-c", `docker run -t --rm -d ${namegen} --name my-container ${ environmentImage}`], {
			stdio: "pipe"
		})

		this.environmentProcess.on("error", (err: any) => {
			console.error("Failed to start environment:", err)
		})

		this.environmentProcess.stdout.on("data", (data: any) => {
			console.log(`Environment output: ${data}`)
		})

		return new Promise((resolve, reject) => {
			this.environmentProcess.on("exit", (code: any) => {
				if (code === 0) {
				   this.currentContainerName = namegen;
					resolve(true)
				} else {
					reject(new Error("Environment process exited with code " + code))
				}
			})
		})
	}

	async hasImageReady(imageName: String): Promise<boolean> {
		return new Promise(async (resolve) => {
			if (!await this.isAvailable()) {
				return resolve(false);
			}

			let check = spawn("bash", ["-c", "docker images -q " + imageName], {
				stdio: "pipe"
			})
			let output = ""
			check.stdout.on("data", (data) => {
				output += data
			})
			check.on("error", () => {
				resolve(false)
			})
			check.stdout.on("end", () => {
				if (output.trim().length > 0) {
					resolve(true)
				} else {
					resolve(false)
				}
			})


		})
	}
	async initialize() {
		await this.StartEnvironment(this.imageName).then(dat => {
			console.log("Environment started successfully")
		}).catch(() => {
			console.error("Failed to start environment")
		});

	}


}
