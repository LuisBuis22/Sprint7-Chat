"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = require("../user/domain/entities/UserModel");
class Server {
    constructor(port) {
        this.port = port;
        this.express = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.express);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: "http://localhost:" + port,
            },
        });
        this.express.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: Object.assign(Object.assign({}, helmet_1.default.contentSecurityPolicy.getDefaultDirectives()), { "script-src": ["'self'", "https://cdn.socket.io"] }),
            },
        }));
        this.express.use(express_1.default.static(path_1.default.join(__dirname, "../../client")));
        this.express.use((0, cors_1.default)({ origin: "*" }));
        this.express.use((0, body_parser_1.json)());
        this.express.use((0, body_parser_1.urlencoded)({ extended: true }));
        this.setupRoutes();
        this.handleSocketEvents();
    }
    setupMongoDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                console.error("MONGO_URI not defined in environment variables.");
                return;
            }
            try {
                yield mongoose_1.default.connect(mongoUri);
                console.log("Connected to MongoDB");
                const db = mongoose_1.default.connection.db;
                const collectionNames = yield db.listCollections().toArray();
                const userCollectionExists = collectionNames.some((coll) => coll.name === "users");
                if (!userCollectionExists) {
                    yield db.createCollection("users");
                    console.log("Created 'users' collection");
                }
            }
            catch (error) {
                console.error("Error connecting to MongoDB:", error);
            }
        });
    }
    setupRoutes() {
        this.express.get("/", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "../../client/index.html"));
        });
    }
    handleSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log(`Usuario conectado: ${socket.id}`);
            socket.on("joinRoom", (data) => __awaiter(this, void 0, void 0, function* () {
                const { room, username } = data;
                try {
                    yield UserModel_1.UserModel.create({ name: username });
                    socket.join(room);
                    this.io.to(room).emit("userJoined", username);
                }
                catch (error) {
                    console.error("Error creating user:", error);
                }
            }));
            socket.on("chat message", (data) => __awaiter(this, void 0, void 0, function* () {
                const { room, username, message } = data;
                try {
                    const user = yield UserModel_1.UserModel.findOne({ name: username });
                    if (user) {
                        user.messages.push({ text: message, timestamp: new Date() });
                        yield user.save();
                        this.io.to(room).emit("chat message", { username, message });
                    }
                    else {
                        console.error("User not found:", username);
                    }
                }
                catch (error) {
                    console.error("Error saving message:", error);
                }
            }));
            socket.on("disconnect", () => {
                console.log(`Usuario desconectado: ${socket.id}`);
            });
        });
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupMongoDB();
            yield new Promise((resolve) => {
                this.httpServer.listen(this.port, () => {
                    console.log(`✅ Backend App is running at http://localhost:${this.port} in ${this.express.get("env")} mode`);
                    console.log("✋ Press CTRL-C to stop\n");
                    resolve();
                });
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map