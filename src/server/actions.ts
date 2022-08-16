import childProcess from "child_process";
import { getAction, getRepl } from "./config";

export function performAction(actionId: string) {
  const action = getAction(actionId);

  const process = childProcess.exec(getRepl(), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      throw error;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      throw Error(stderr);
    }
  });

  if (!process.stdin) {
    throw Error("stdin is null");
  }

  process.stdin.end(`actions.${action}`);
}
