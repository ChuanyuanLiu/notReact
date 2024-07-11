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
  const [text, setText] = React.useState("")

  return React.createElement(
    "div",
    null,
    React.createElement("input", {
      id: 0,
      value: text,
      onInput: (e: any) => {
        setText(e.target.value)
      },
    }),
    React.createElement("p", null, "My Counter App"),
    text.length > 0 ? React.createElement(Counter) : "",
    React.createElement(Counter)
  )
}

React.createRoot(document.getElementById("app")!).render(
  React.createElement(App)
)
