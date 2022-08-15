import childProcess from "child_process";
import connectLiveReload from "connect-livereload";
import express from "express";
import fs from "fs";
import livereload from "livereload";
import os from "os";
import path from "path";

const tempDir = path.join(os.tmpdir(), "talonDeck");
const port = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

fs.watch(tempDir, () => {
  liveReloadServer.refresh("/");
});

const app = express();

app.use(connectLiveReload({}));
app.use(express.json());

app.use("/", express.static(__dirname));
app.use("/temp", express.static(tempDir));

app.post("/rest/action", (req, res) => {
  const process = childProcess.exec(req.body.repl, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.sendStatus(500);
    } else if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.sendStatus(500);
    }
  });

  if (process.stdin) {
    process.stdin.end(`actions.${req.body.action}`);
  } else {
    res.sendStatus(500);
  }

  res.end();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
