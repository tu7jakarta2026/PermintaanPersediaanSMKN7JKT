import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

import healthHandler from "./api/health.js";
import configHandler from "./api/config.js";
import itemsHandler from "./api/items.js";
import employeesHandler from "./api/employees.js";
import requestsHandler from "./api/requests.js";
import testConnectionHandler from "./api/test-connection.js";
import loginHandler from "./api/auth/login.js";
import meHandler from "./api/auth/me.js";
import logoutHandler from "./api/auth/logout.js";
import changePinHandler from "./api/auth/change-pin.js";
import switchRoleHandler from "./api/auth/switch-role.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "12mb" }));

app.all("/api/health", healthHandler);
app.all("/api/config", configHandler);
app.all("/api/items", itemsHandler);
app.all("/api/employees", employeesHandler);
app.all("/api/requests", requestsHandler);
app.all("/api/test-connection", testConnectionHandler);
app.all("/api/auth/login", loginHandler);
app.all("/api/auth/me", meHandler);
app.all("/api/auth/logout", logoutHandler);
app.all("/api/auth/change-pin", changePinHandler);
app.all("/api/auth/switch-role", switchRoleHandler);

async function start() {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Permintaan Barang berjalan di http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
