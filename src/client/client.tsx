import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

fetch("temp/config.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(JSON.stringify(data));
  })
  .catch((e) => {
    console.log("Booo", e);
  });

ReactDOM.render(<App />, document.getElementById("root"));
