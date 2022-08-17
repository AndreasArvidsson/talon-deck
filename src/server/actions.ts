import childProcess from "child_process";
import { getAction, getRepl } from "./config";

export function performAction(actionId: string) {
  return new Promise<void>((resolve, reject) => {
    const action = getAction(actionId);
    const repl = `"${getRepl()}"`;

    const process = childProcess.exec(repl, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
      } else if (stderr) {
        reject(`stderr: ${stderr}`);
      } else {
        resolve();
      }
    });

    if (!process.stdin) {
      reject("stdin is null");
      return;
    }

    process.stdin.end(`actions.${action}`);
  });
}
