import react from "../lib/react"

const Counter = () => {
  const [count, setCount] = react.useState(0)

  return react.createElement(
    "div",
    null,
    react.createElement("p", null, "Counter: " + count),
    react.createElement(
      "button",
      {
        onClick: () => {
          setCount(count - 1)
        },
      },
      "-"
    ),
    react.createElement(
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
  const [text, setText] = react.useState("")

  return react.createElement(
    "div",
    null,
    react.createElement("input", {
      id: 0,
      value: text,
      onInput: (e: any) => {
        setText(e.target.value)
      },
    }),
    react.createElement("p", null, "My Counter App"),
    text.length > 0 ? react.createElement(Counter) : "",
    react.createElement(Counter)
  )
}

react
  .createRoot(document.getElementById("app")!)
  .render(react.createElement(App))
