import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Button from "./Button";
import { ButtonConfig } from "./types";

const Buttons = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  const fetchButtons = () => {
    fetch("rest/buttons")
      .then((response) => response.json())
      .then(setButtons)
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    io()
      .on("update", fetchButtons)
      .on("connect", fetchButtons)
      .on("disconnect", () => setButtons([]));
  }, []);

  return (
    <div className="buttons">
      {buttons.map((button, i) => (
        <Button key={i} button={button} />
      ))}
    </div>
  );
};

export default Buttons;
