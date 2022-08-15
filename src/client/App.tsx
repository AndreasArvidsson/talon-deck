import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { Config } from "./types";

const App = () => {
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    fetch("temp/config.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  if (!config) {
    return null;
  }

  const performAction = (action: string) => {
    const body = JSON.stringify({ action, repl: config.repl });
    const headers = { "Content-Type": "application/json" };
    fetch("rest/action", { method: "POST", body, headers })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return <Buttons buttons={config.buttons} performAction={performAction} />;
};

export default App;
