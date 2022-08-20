import cookieParser from "cookie-parser";
import csrf from "csurf";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { performAction } from "./actions";
import { basicAuth, getValidHostsMessage, hostValidation } from "./auth";
import {
  configIsStale,
  configReset,
  getButtons,
  getConfigFile,
  readConfigFile,
} from "./config";
import log from "./log";
import { getSettings } from "./settingsUtil";

const settings = getSettings();
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(basicAuth);
app.use(hostValidation());
app.use(csrf({ cookie: true }));
app.use("/", express.static(__dirname));

app.get("/rest/csrfToken", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/rest/buttons", (req, res) => {
  res.json(getButtons());
});

app.post("/rest/action", async (req, res) => {
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
  log.info(
    `Server listening on host '${settings.host}' port '${settings.port}'`
  );
  log.info(getValidHostsMessage());
});

fs.watch(getConfigFile(), () => {
  if (readConfigFile()) {
    io.emit("update");
  }
});

setInterval(() => {
  // Config file is stale. No heartbeat signal sent.
  if (configIsStale()) {
    log.debug("Reset stale config");
    configReset();
    io.emit("update");
  }
}, 1000);
