import { App } from "./App";
import 'dotenv/config';


try {
	void new App().start();
} catch (e) {
	console.error(e);
	process.exit(1);
}

process.on("uncaughtException", (err) => {
	console.error(err);
	process.exit(1);
});
