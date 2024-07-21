import React from "../lib/react"
import "./styles.css"

import Reddit from "./reddit";

export default function App() {
  return (
    <div className="bg-base-100 min-h-screen">
      <Reddit />
    </div>
  );
}


React
  .createRoot(document.getElementById("app")!)
  .render(React.createElement(App, null));
