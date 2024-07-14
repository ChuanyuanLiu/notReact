import React from "../lib/react"

const Counter = () => {
  const [count, setCount] = React.useState(0)
  return /*#__PURE__*/ React.createElement(
    "div",
    null,
    /*#__PURE__*/ React.createElement("h1", null, count),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        onClick: () => setCount(count + 1),
      },
      "Increment"
    )
  )
}

const App = () => {
  const [count, setCount] = React.useState(1)
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "w-screen h-screen",
    },
    count,
    /*#__PURE__*/ React.createElement(
      "button",
      {
        className: "btn btn-primary",
        onClick: () =>
          setCount((x) => {
            return x + 1
          }),
      },
      "+"
    ),
    /*#__PURE__*/ React.createElement(
      "button",
      {
        className: "btn btn-secondary",
        onClick: () => setCount(count - 1),
      },
      "-"
    ),
    Array.from(Array(Math.max(count, 0)).keys()).map((x) =>
      /*#__PURE__*/ React.createElement(Counter, null)
    )
  )
}

React.createRoot(document.getElementById("app")!).render(
  React.createElement(App, null)
)
