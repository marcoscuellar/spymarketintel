import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { hydrate } from "./spyglass/sync.js";

// Pull any server-saved workspace into localStorage BEFORE the app reads it,
// so the first render already shows whatever was last saved. Never block boot
// on a failure — render regardless.
function boot() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

hydrate().finally(boot);
