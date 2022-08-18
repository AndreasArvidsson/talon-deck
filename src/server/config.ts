import fs from "fs";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ButtonClient, ButtonConfig, Config } from "./types";

const configFile = path.join(os.tmpdir(), "talonDeck.json");

let lastUpdate = 0;
let currentConfigString = "";
let repl = "";
let buttons: ButtonClient[] = [];
let idToAction = new Map<string, string>();

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
  const action = idToAction.get(actionId);
  if (!action) {
    throw Error(`Unknown actionId: '${actionId}'`);
  }
  return action;
}

export function readConfigFile() {
  lastUpdate = Date.now();

  try {
    const content = fs.readFileSync(getConfigFile()).toString();
    if (content !== currentConfigString) {
      const config: Config = JSON.parse(content);
      sortButtons(config.buttons);
      const [actionToId, _idToAction] = createActionMaps(config.buttons);
      buttons = config.buttons.map((b) => createClientButton(actionToId, b));
      repl = config.repl;
      idToAction = _idToAction;
      currentConfigString = content;
      return true;
    }
  } catch (e) {}

  return false;
}

export function configIsStale() {
  return currentConfigString && Date.now() - lastUpdate > 1900;
}

export function configReset() {
  currentConfigString = "";
  buttons = [];
}

function createClientButton(
  actionToId: Map<string, string>,
  button: ButtonConfig
): ButtonClient {
  return {
    icon: button.icon,
    actionId: button.action ? actionToId.get(button.action) : undefined,
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
  const actionToId = new Map<string, string>();
  const idToAction = new Map<string, string>();
  buttons.forEach((button) => {
    if (button.action) {
      const id = uuidv4();
      actionToId.set(button.action, id);
      idToAction.set(id, button.action);
    }
  });
  return [actionToId, idToAction];
}
