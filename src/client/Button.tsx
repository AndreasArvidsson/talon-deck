import React from "react";
import { getIcon } from "./icons";
import { ButtonConfig } from "./types";
import "./Button.css";

interface Parameters {
  button: ButtonConfig;
  performAction: (action: string) => void;
}

const Button = ({ button, performAction }: Parameters) => {
  if (button.action) {
    return (
      <button className="button" onClick={() => performAction(button.action!)}>
        {createInnerDiv(button.icon)}
      </button>
    );
  }
  return <div className="button">{createInnerDiv(button.icon)}</div>;
};

export default Button;

function createInnerDiv(iconName: string) {
  const iconUrl = getIcon(iconName);
  if (iconUrl) {
    return <div style={{ backgroundImage: `url(${iconUrl})` }} />;
  }
  return <div className="icon-missing">{iconName}</div>;
}
