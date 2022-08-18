import { getSettings } from "./settingsUtil";
import net from "net";

const settings = getSettings();

export const validateHost = (host?: string): [boolean, string] => {
  if (!host) {
    return [false, "Host header is required"];
  }
  // Remove trailing port so that we can validate host address
  const portString = `:${settings.port}`;
  if (host.endsWith(portString)) {
    host = host.substring(0, host.length - portString.length);
  } else if (settings.port !== 80) {
    return [
      false,
      `Expected host header '${host}' to end with port '${settings.port}'`,
    ];
  }
  host = convertLocalhost(host);
  // All hosts are valid just make sure it's an actual IP address
  if (settings.host === "0.0.0.0" || settings.host === "::") {
    if (net.isIP(host) === 0) {
      return [false, `Host '${host}' is not a valid IP address`];
    }
    return [true, ""];
  }
  if (host !== convertLocalhost(settings.host)) {
    return [
      false,
      `Host header '${host}' does not match expected '${settings.host}'`,
    ];
  }
  return [true, ""];
};

function convertLocalhost(host: string) {
  return host === "localhost" ? "127.0.0.1" : host;
}

// [
//   // Failing
//   ["localhost", 3000, undefined],
//   ["localhost", 3000, ""],
//   ["localhost", 3000, "localhost"],
//   ["localhost", 3000, "localhost:3001"],
//   ["localhost", 3000, "a:3000"],
//   ["192.168.1.100", 3000, "192.168.1.101:3000"],
//   ["0.0.0.0", 3000, "a:3000"],
//   // Passing
//   ["0.0.0.0", 3000, "192.168.1.100:3000"],
//   ["::", 3000, "2001:0db8:85a3:0000:0000:8a2e:0370:7334:3000"],
//   ["127.0.0.1", 3000, "localhost:3000"],
//   ["localhost", 3000, "127.0.0.1:3000"],
//   ["localhost", 3000, "localhost:3000"],
//   ["localhost", 80, "localhost:80"],
//   ["localhost", 80, "localhost"],
// ].forEach(([host, port, input]) => {
//   settings.host = <string>host;
//   settings.port = <number>port;
//   const [isValid, message] = validateHost(<string>input);
//   console.log(isValid, host, port, input, message);
// });
