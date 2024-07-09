import React from "./react"

const Counter = () => {
  return React.createElement(
    "div",
    null,
    React.createElement("p", null, "Counter: " + 0),
    React.createElement("button", {}, "-"),
    React.createElement("button", {}, "+")
  )
}

const App = () => {
  return React.createElement(
    "div",
    null,
    React.createElement("p", null, "My Counter App"),
    React.createElement(Counter)
  )
}

React.createRoot(document.getElementById("app")!).render(
  React.createElement(App)
)
