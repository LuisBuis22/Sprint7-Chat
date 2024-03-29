import { Server } from "./Server";

export class App {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? "27017";
		this.server = new Server(port);

		await this.server.listen();
	}
}
