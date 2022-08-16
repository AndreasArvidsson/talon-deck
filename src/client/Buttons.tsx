import React, { useEffect, useState } from "react";
import Button from "./Button";
import { ButtonConfig } from "./types";
import "./Buttons.css";

const Buttons = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  useEffect(() => {
    fetch("rest/buttons")
      .then((response) => response.json())
      .then(setButtons)
      .catch((e) => console.error(e));
  }, []);

  if (!buttons) {
    return null;
  }

  return (
    <div className="buttons">
      {buttons.map((button, i) => (
        <Button key={i} button={button} />
      ))}
    </div>
  );
};

export default Buttons;
