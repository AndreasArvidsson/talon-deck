import express from "express";
import connectLiveReload from "connect-livereload";
import livereload from "livereload";
import fs from "fs";
import childProcess from "child_process";
import {
  getAction,
  getButtons,
  getConfigFile,
  getRepl,
  readConfigFile,
} from "./config";

const port = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

fs.watch(getConfigFile(), () => {
  if (readConfigFile()) {
    liveReloadServer.refresh("/");
  }
});

const app = express();

app.use(connectLiveReload({}));
app.use(express.json());
app.use("/", express.static(__dirname));

app.get("/rest/buttons", (req, res) => {
  res.json(getButtons());
  res.end();
});

app.post("/rest/action", (req, res) => {
  const action = getAction(req.body.actionId);

  const process = childProcess.exec(getRepl(), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.sendStatus(500);
    } else if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.sendStatus(500);
    }
  });

  if (process.stdin) {
    process.stdin.end(`actions.${action}`);
  } else {
    res.sendStatus(500);
  }

  res.end();
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
