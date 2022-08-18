import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Button from "./Button";
import { ButtonConfig } from "./types";

const Buttons = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);
  const [connected, setConnected] = useState(false);
  const [csrfToken, setCsrfToken] = useState();

  const fetchButtons = () => {
    Promise.all([
      fetch("rest/buttons").then((r) => r.json()),
      fetch("rest/csrfToken").then((r) => r.json()),
    ])
      .then((responses) => {
        setButtons(responses[0]);
        setCsrfToken(responses[1].csrfToken);
      })
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

  if (!connected || !csrfToken) {
    return <h1>Disconnected</h1>;
  }

  return (
    <>
      {buttons.map((button) => (
        <Button key={button.icon} csrfToken={csrfToken} button={button} />
      ))}
    </>
  );
};

export default Buttons;
