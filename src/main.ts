import React from "../lib/react"

const Counter = (props: {x: number}) => {
  const [count, setCount] = React.useState(props.x)

  return React.createElement(
    "div",
    null,
    props.x,
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
  return React.createElement("div", null, [
    React.createElement(Counter, {x: 1}),
    React.createElement(Counter, {x: 1}),
  ])
}

React.createRoot(document.getElementById("app")!).render(
  React.createElement(App, null)
)
