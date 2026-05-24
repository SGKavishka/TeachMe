import http from "http";
import { createApp } from "./app.js";
import { connectDb } from "./database/connect.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/index.js";

const startServer = async () => {
  await connectDb();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server, app);

  server.listen(env.port, () => {
    console.log(`TeachMe API listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
