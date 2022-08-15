import React from "react";
import Button from "./Button";
import "./Buttons.css";
import { ButtonConfig } from "./types";

interface Parameters {
  buttons: ButtonConfig[];
  performAction: (action: string) => void;
}

const Buttons = ({ buttons, performAction }: Parameters) => {
  return (
    <div className="buttons">
      {buttons.map((button, i) => (
        <Button key={i} button={button} performAction={performAction} />
      ))}
    </div>
  );
};

export default Buttons;
