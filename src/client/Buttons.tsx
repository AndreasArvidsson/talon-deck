import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Button from "./Button";
import { ButtonConfig } from "./types";

const Buttons = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [connected, setConnected] = useState(false);

  const fetchButtons = () => {
    fetch("rest/buttons")
      .then((response) => response.json())
      .then(setButtons)
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    io()
      .on("update", fetchButtons)
      .on("connect", () => {
        setConnected(true);
        fetchButtons();
      })
      .on("disconnect", () => {
        setConnected(false);
        setButtons([]);
      });
  }, []);

  if (!connected) {
    return <h1>Disconnected</h1>;
  }

  return (
    <>
      {buttons.map((button) => (
        <Button key={button.icon} button={button} />
      ))}
    </>
  );
};

export default Buttons;
