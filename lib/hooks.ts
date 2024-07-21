import {rerender, setHookIndex, getHookIndex, getComponentIndex} from "./vDOM"

// useState
// TODO: improve type hints
let vals = new Map<string, any[]>()

export function useState<T>(
  initial: T
): [T, (newVal: T | ((oldVal: T) => T)) => void] {
  if (vals.get(getComponentIndex()) == undefined) {
    vals.set(getComponentIndex(), [])
  }
  const hooks = vals.get(getComponentIndex())!
  const currentHookIndex = getHookIndex()
  setHookIndex(currentHookIndex + 1)
  if (hooks[currentHookIndex] === undefined) {
    if (typeof initial == "function") {
      hooks[currentHookIndex] = initial()
    } else {
      hooks[currentHookIndex] = initial
    }
  }
  return [
    hooks[currentHookIndex],
    (newVal) => {
      if (typeof newVal === "function") {
        hooks[currentHookIndex] = (newVal as (oldVal: T) => T)(
          hooks[currentHookIndex]
        )
      } else {
        hooks[currentHookIndex] = newVal
      }
      rerender()
    },
  ]
}
