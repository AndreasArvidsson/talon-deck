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
  // console.log("Temp directory changed");
  liveReloadServer.refresh("/");
});

const app = express();

app.use(connectLiveReload({}));
app.use(express.json());

app.use("/", express.static(__dirname));
app.use("/temp", express.static(tempDir));

app.post("/rest/action", (req, res) => {
  // const command = `echo "actions.${req.body.action}" | ${req.body.repl}`;
  const command = req.body.repl;

  const child = childProcess.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });

  child.stdin?.write(`actions.${req.body.action}`);
  child.stdin?.end();

  res.end();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
