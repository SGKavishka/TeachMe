import http from "http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDb } from "./database/connect.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/index.js";

let server;

const closeServer = async () => {
  if (server?.listening) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
};

const startServer = async () => {
  await connectDb();

  const app = createApp();
  server = http.createServer(app);
  initSocket(server, app);

  server.on("error", (error) => {
    console.error("Server error", error);
    process.exit(1);
  });

  server.listen(env.port, () => {
    console.log(`TeachMe API listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

process.once("SIGINT", async () => {
  await closeServer();
  process.exit(0);
});

process.once("SIGTERM", async () => {
  await closeServer();
  process.exit(0);
});

process.once("SIGUSR2", async () => {
  await closeServer();
  process.kill(process.pid, "SIGUSR2");
});
