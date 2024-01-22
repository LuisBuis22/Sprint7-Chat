import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import { createServer } from "http";
import path from "path";
import mongoose from "mongoose";
import { UserModel, InfoMessage, InfoUser } from "../user/domain/entities/UserModel";

export class Server {
  private readonly express: express.Express;
  private readonly port: string;
  private readonly httpServer: HttpServer;
  private readonly io: SocketIoServer;

  constructor(port: string) {
    this.port = port;
    this.express = express();
    this.httpServer = createServer(this.express);

    // Especificar el host para el servidor WebSockets
    this.io = new SocketIoServer(this.httpServer, {
      cors: {
        origin: "http://localhost:" + port,
      },
    });

    // Configuración del contentSecurityPolicy
    this.express.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://cdn.socket.io"],
          },
        },
      })
    );

    // Configuración para servir archivos estáticos
    this.express.use(express.static(path.join(__dirname, "../../client")));

    this.express.use(cors({ origin: "*" }));
    this.express.use(json());
    this.express.use(urlencoded({ extended: true }));

    this.setupRoutes();
    this.handleSocketEvents();
  }

  private async setupMongoDB(): Promise<void> {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not defined in environment variables.");
      return;
    }

    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");

      const db = mongoose.connection.db;
      const collectionNames = await db.listCollections().toArray();
      const userCollectionExists = collectionNames.some(
        (coll) => coll.name === "users"
      );

      if (!userCollectionExists) {
        await db.createCollection("users");
        console.log("Created 'users' collection");
      }
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  // Configuración ruta básica para servir el archivo html
  private setupRoutes(): void {
    this.express.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../../client/index.html"));
    });
  }

  // Manejar distintos eventos de Socket.IO
  private handleSocketEvents(): void {
    // Cuando un usuario se conecta, se manejan 3 escuchadores para eventos
    this.io.on("connection", (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);

      // 1. Usuario se une a una sala
      socket.on("joinRoom", async (data) => {
        const { room, username } = data;

        try {
          // Guarda usuario en MongoDB
          await UserModel.create({ name: username });

          socket.join(room);
          // Emitimos un evento 'userJoined' con el nombre de usuario
          this.io.to(room).emit("userJoined", username);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      });

      // 2. Recibimos evento chat message
      socket.on("chat message", async (data) => {
        const { room, username, message } = data;

        try {
          // Encuentra el usuario en MongoDB
          const user = await UserModel.findOne({ name: username });

          if (user) {
            // Agrega el mensaje al usuario
            user.messages.push({ text: message, timestamp: new Date() });
            await user.save();

            // Emitimos un evento 'chat message' con nombre de usuario y mensaje en la sala específica
            this.io.to(room).emit("chat message", { username, message });
          } else {
            console.error("User not found:", username);
          }
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      // 3. Emitimos mensaje cuando usuario se deconecta
      socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.id}`);
      });
    });
  }

  async listen(): Promise<void> {
    await this.setupMongoDB();
    await new Promise<void>((resolve) => {
      this.httpServer.listen(this.port, () => {
        console.log(
          `✅ Backend App is running at http://localhost:${
            this.port
          } in ${this.express.get("env")} mode`
        );
        console.log("✋ Press CTRL-C to stop\n");

        resolve();
      });
    });
  }
}
