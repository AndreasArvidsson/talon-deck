import auth from "basic-auth";
import { Express, Request, Response, NextFunction } from "express";
import hostValidation_ from "host-validation";
import net from "net";
import { getSettings } from "./settingsUtil";

const settings = getSettings();
const authSettings = settings.basicAuth;
let validHostsMessage = "";

export const basicAuth = (
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

const hostValidationIP = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const portString = `:${settings.port}`;
  let host = request.headers.host;

  if (!host) {
    return response.status(403).send("Host header is required");
  }

  if (host.endsWith(portString)) {
    host = host.substring(0, host.length - portString.length);
  } else if (settings.port !== 80) {
    return response
      .status(403)
      .send(
        `Expected host header '${host}' to end with port '${settings.port}'`
      );
  }

  if (host === "localhost") {
    host = "127.0.0.1";
  }

  if (net.isIP(host) === 0) {
    return response
      .status(403)
      .send(`Host '${host}' is not a valid IP address`);
  }

  next();
};

export const hostValidation = () => {
  if (settings.host === "0.0.0.0" || settings.host === "::") {
    validHostsMessage = "Valid hosts are all IP addresses";
    return hostValidationIP;
  }

  const validIP = [settings.host];
  const validPorts = [`:${settings.port}`];

  if (settings.host === "localhost") {
    validIP.push("127.0.0.1");
  }
  if (settings.host === "127.0.0.1") {
    validIP.push("localhost");
  }
  if (settings.port === 80) {
    validPorts.push("");
  }

  const hosts = validIP
    .flatMap((ip) => validPorts.map((port) => `${ip}${port}`))
    .sort();

  validHostsMessage = `Valid hosts: [${hosts.join(", ")}]`;

  return hostValidation_({ hosts });
};

export const getValidHostsMessage = () => {
  return validHostsMessage;
};
