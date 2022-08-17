import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ButtonClient, ButtonConfig, Config, StringMap } from "./types";

const tempDir = path.join(os.tmpdir(), "talonDeck");
const configFile = path.join(tempDir, "config.json");

let lastUpdate = 0;
let currentConfigString = "";
let repl = "";
let buttons: ButtonClient[] = [];
let actionToId: StringMap = {};
let idToAction: StringMap = {};

export function getConfigFile() {
  return configFile;
}

export function getRepl() {
  return repl;
}

export function getButtons() {
  return buttons;
}

export function getAction(actionId: string) {
  return idToAction[actionId];
}

export function readConfigFile() {
  lastUpdate = Date.now();

  try {
    const content = fs.readFileSync(getConfigFile()).toString();
    if (content !== currentConfigString) {
      const config: Config = JSON.parse(content);
      repl = config.repl;
      sortButtons(config.buttons);
      [actionToId, idToAction] = createActionMaps(config.buttons);
      buttons = config.buttons.map(createClientButton);
      currentConfigString = content;
      return true;
    }
  } catch (e) {}

  return false;
}

export function configIsStale() {
  return currentConfigString && Date.now() - lastUpdate > 1500;
}

export function configReset() {
  currentConfigString = "";
  buttons = [];
}

function createClientButton(button: ButtonConfig): ButtonClient {
  return {
    icon: button.icon,
    actionId: button.action ? actionToId[button.action] : undefined,
  };
}

function sortButtons(buttons: ButtonConfig[]) {
  buttons.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER)
  );
}

function createActionMaps(buttons: ButtonConfig[]) {
  const actionToId: StringMap = {};
  const idToAction: StringMap = {};
  buttons.forEach((button) => {
    if (button.action) {
      const id = uuidv4();
      actionToId[button.action] = id;
      idToAction[id] = button.action;
    }
  });
  return [actionToId, idToAction];
}
