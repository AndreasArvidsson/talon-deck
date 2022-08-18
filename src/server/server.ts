import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { performAction } from "./actions";
import {
  configIsStale,
  configReset,
  getButtons,
  getConfigFile,
  readConfigFile,
} from "./config";
import { getSettings } from "./settingsUtil";
import { validateHost } from "./validate";

const settings = getSettings();
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use("/", express.static(__dirname));

app.get("/rest/csrfToken", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/rest/buttons", (req, res) => {
  res.json(getButtons());
});

app.post("/rest/action", async (req, res) => {
  const [isValid, errorMessage] = validateHost(req.headers.host);
  if (!isValid) {
    res.status(403).send(errorMessage);
    return;
  }
  try {
    await performAction(req.body.actionId);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
  res.end();
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const server = httpServer.listen(settings.port, settings.host, () => {
  console.log(
    `Server listening on host '${settings.host}' port '${settings.port}'`
  );
});

fs.watch(getConfigFile(), () => {
  if (readConfigFile()) {
    io.emit("update");
  }
});

setInterval(() => {
  // Config file is stale. No heartbeat signal sent.
  if (configIsStale()) {
    console.log("Reset stale config");
    configReset();
    io.emit("update");
  }
}, 1000);
