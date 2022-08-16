import React from "react";
import { getIcon } from "./icons";
import { ButtonConfig } from "./types";
import "./Button.css";

interface Parameters {
  button: ButtonConfig;
}

const Button = ({ button }: Parameters) => {
  if (button.actionId) {
    return (
      <button
        className="button"
        onClick={() => performAction(button.actionId!)}
      >
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

const performAction = (actionId: string) => {
  const body = JSON.stringify({ actionId });
  const headers = { "Content-Type": "application/json" };
  fetch("rest/action", { method: "POST", body, headers })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.error(e);
    });
};
