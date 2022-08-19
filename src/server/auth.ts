import auth from "basic-auth";
import { Express, Request, Response, NextFunction } from "express";
import { getSettings } from "./settingsUtil";

const authSettings = getSettings().basicAuth;

const basicAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!authSettings) {
    return next();
  }

  const credentials = auth(request);

  if (
    credentials &&
    credentials.name === authSettings.username &&
    credentials.pass === authSettings.password
  ) {
    return next();
  }

  response.set("WWW-Authenticate", 'Basic realm="Talon Deck"');
  return response.sendStatus(401);
};

export default basicAuth;
