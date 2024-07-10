import React from "./react"

const Counter = () => {
  const [count, setCount] = React.useState(0)

  return React.createElement(
    "div",
    null,
    React.createElement("p", null, "Counter: " + count),
    React.createElement(
      "button",
      {
        onClick: () => {
          setCount(count - 1)
        },
      },
      "-"
    ),
    React.createElement(
      "button",
      {
        onClick: () => {
          setCount(count + 1)
        },
      },
      "+"
    )
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
