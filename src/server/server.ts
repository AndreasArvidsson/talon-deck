import express from "express";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import os from "os";
import path from "path";
import fs from "fs";

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

app.use("/", express.static(__dirname));
app.use("/temp", express.static(tempDir));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
