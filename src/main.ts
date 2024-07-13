import react from "../lib/react"

const Counter = ({x}: {x: number}) => {
  const [count, setCount] = react.useState(x)

  return react.createElement(
    "div",
    null,
    x,
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
    Array.from(Array(text.length).keys()).map((x) =>
      react.createElement(Counter, {x: x})
    )
  )
}

react
  .createRoot(document.getElementById("app")!)
  .render(react.createElement(App))
