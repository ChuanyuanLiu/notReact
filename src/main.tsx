import React from "../lib/react"
import "./styles.css"

import TodoList from "./TodoList.tsx";

export default function App() {
  return (
    <div className="bg-base-100 min-h-screen">
      <TodoList />
    </div>
  );
}


React
  .createRoot(document.getElementById("app")!)
  .render(React.createElement(App, null));
