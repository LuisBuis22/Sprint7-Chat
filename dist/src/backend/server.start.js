"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
require("dotenv/config");
try {
    void new App_1.App().start();
}
catch (e) {
    console.error(e);
    process.exit(1);
}
process.on("uncaughtException", (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=server.start.js.map