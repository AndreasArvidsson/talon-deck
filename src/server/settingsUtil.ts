import settings from "../../settings";
import { Settings } from "./types";

settings.host = settings.host.trim();

export const getSettings = () => {
  return settings;
};
