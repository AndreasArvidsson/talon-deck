import React from "react";
import { getIcon } from "./icons";
import { ButtonConfig } from "./types";
import "./Button.css";

interface Parameters {
  button: ButtonConfig;
  performAction: (action: string) => void;
}

const Button = ({ button, performAction }: Parameters) => {
  const backgroundImage = `url(${getIcon(button.icon)})`;
  if (button.action) {
    return (
      <button className="button" onClick={() => performAction(button.action!)}>
        <div style={{ backgroundImage }} />
      </button>
    );
  }
  return (
    <div className="button">
      <div style={{ backgroundImage }} />
    </div>
  );
};

export default Button;
