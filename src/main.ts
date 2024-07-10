import React from "./react"

const Counter = () => {
  const [count, setCount] = React.useState(0)

  return React.createElement(
    "div",
    {id: 3},
    React.createElement("p", {id: 4}, "Counter: " + count),
    React.createElement(
      "button",
      {
        id: 5,
        onClick: () => {
          setCount(count - 1)
        },
      },
      "-"
    ),
    React.createElement(
      "button",
      {
        id: 6,
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
    {id: 1},
    React.createElement("input", {
      id: 0,
      value: text,
      onInput: (e: any) => {
        setText(e.target.value)
      },
    }),
    React.createElement("p", {id: 2}, "My Counter App"),
    text.length > 0 ? React.createElement(Counter) : "",
    React.createElement(Counter)
  )
}

React.createRoot(document.getElementById("app")!).render(
  React.createElement(App)
)
