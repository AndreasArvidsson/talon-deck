import React, { useState } from "react";
import "./Button.css";
import { getIcon } from "./icons";
import { ButtonConfig } from "./types";

interface Parameters {
  csrfToken: string;
  button: ButtonConfig;
}

const Button = ({ csrfToken, button }: Parameters) => {
  const [loading, setLoading] = useState(false);

  if (!button.actionId) {
    return <div className="button">{createInnerDiv(button.icon)}</div>;
  }

  const performAction = () => {
    setLoading(true);
    const body = JSON.stringify({ actionId: button.actionId });
    const headers = {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    };
    fetch("rest/action", { method: "POST", body, headers })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  return (
    <button
      className="button"
      disabled={loading}
      onClick={() => performAction()}
    >
      {createInnerDiv(button.icon)}
    </button>
  );
};

export default Button;

function createInnerDiv(iconName: string) {
  const iconUrl = getIcon(iconName);
  if (iconUrl) {
    return <div style={{ backgroundImage: `url(${iconUrl})` }} />;
  }
  return <div className="icon-missing">{iconName}</div>;
}
