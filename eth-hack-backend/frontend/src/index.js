import React from "react";
import ReactDOM from "react-dom";
import { MyDapp } from "./components/MyDapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <MyDapp />
  </React.StrictMode>,
  document.getElementById("root")
);
