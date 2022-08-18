import settings from "../../settings";
import { Settings } from "./types";

settings.host = settings.host.trim();

if (settings.host === "localhost") {
  settings.host = "127.0.0.1";
}

export const getSettings = () => {
  return settings;
};
