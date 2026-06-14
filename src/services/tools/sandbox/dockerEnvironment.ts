import { spawn } from 'child_process';
import { Environment } from './environment';

interface ExecutorOutput {
	success: boolean;
	output: string
	error: string,
	exitCode: number
};


export class DockerEnvironment implements Environment {
	private environmentProcess: any;
	private imageName: string = "vimbox:latest";
	private currentContainerName: string | null = null;
	private initialized = false;
	constructor() {
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
			let build = spawn("bash", ["-c", "docker build -t " + this.imageName + " ."], {
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

	async StartEnvironment(environmentImage: string, options?: {
		mountPath?: string
	}): Promise<boolean> {
		if (await this.hasImageReady(environmentImage)) {
		} else {
			try {
				let res = await this.buildImage();
			} catch (err) {
				console.error("Failed to build environment image:", err)
				return false;
			}
		}
		let namegen = crypto.randomUUID();
		let mounts = "";
		if (options) {
			if (options.mountPath) {
				mounts += ` -v ${options.mountPath}:/app `
			}
		}
		this.environmentProcess = spawn("bash", ["-c", `docker run -t --rm -d --name ${namegen} ${mounts} ${environmentImage}`], {
			stdio: ["ignore", "pipe", "pipe"]
		})

		this.environmentProcess.on("error", (err: any) => {
			console.error("Failed to start environment:", err)
		})

		this.environmentProcess.stdout.on("data", (data: any) => {
			this.currentContainerName = data.toString().trim();
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
	async initialize(mountPaht?: string) {
		try {
			this.initialized = await this.StartEnvironment(this.imageName, {
				mountPath: mountPaht
			})
		} catch (e) {
			console.error("Failed to initialize Docker environment:", e)
		}
	}

	async execute(command: string): Promise<ExecutorOutput> {
		if (!this.initialized || !this.currentContainerName) return {
			success: false, output: "", error: "Environment not initialized", exitCode: -1

		}
		console.log(`Executing command in container ${this.currentContainerName}: ${command}`)
		return new Promise((resolve) => {
			let exc = spawn("docker", ["exec", this.currentContainerName ?? '', "bash", "-c", command], {
				stdio: ["ignore", "pipe", "pipe"]
			})
			let stddata = "";
			let stderrdata = "";

			exc.stdout.on("data", (data) => {
				stddata += data.toString();
			})
			exc.stderr.on("data", (err) => {
				stderrdata += err.toString();
			})

			exc.on("error", (err) => {
				resolve({
					success: false, output: stderrdata,
					error: err.message, exitCode: -1
				})
			})

			exc.on("exit", (code) => {
				if (code === 0) {
					resolve({
						success: true, output: stddata,
						error: stderrdata, exitCode: code
					})
				} else {
					resolve({
						success: false, output: stderrdata
						, error: stderrdata, exitCode: code ?? 1
					})
				}
			})

		})

	}

	async stopEnvironment() {
		return new Promise((resolve, reject) => {
			if (!this.currentContainerName) {
				return resolve(false);
			}

			let stop = spawn("bash", ["-c", `docker stop ${this.currentContainerName}`], {
				stdio: ["ignore", "pipe", "pipe"]
			})

			stop.on("error", (err: any) => {
				console.error("Failed to stop environment:", err)
				reject(err)
			})

			resolve(true)
		})

	}


}

