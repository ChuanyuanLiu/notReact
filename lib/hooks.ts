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

// react.useEffect(() => {}, [])
// useEffect
type cleanupFnType = () => void
const depsCache = new Map<string, any[][]>()
const cleanupCache = new Map<string, (cleanupFnType | void)[]>()

export function unmount(componentIndex: string) {
  console.log("unmount", componentIndex)
  const cleanupFns = cleanupCache.get(componentIndex)
  if (cleanupFns == undefined) {
    return
  }
  for (const cleanup of cleanupFns) {
    if (cleanup != undefined) {
      cleanup()
    }
  }
  cleanupCache.delete(componentIndex)
}

export function useEffect(fn: () => void | cleanupFnType, deps: any[]): void {
  const currentHookIndex = getHookIndex()
  setHookIndex(currentHookIndex + 1)
  const currentDepsCache = depsCache.get(getComponentIndex())
  // check if deps changed or it is an initial render
  if (
    currentDepsCache != undefined &&
    deps.every((dep, i) => dep === currentDepsCache[currentHookIndex]?.[i])
  ) {
    return
  }
  // run useEffect
  const cleanup = fn()
  // inital render
  if (cleanupCache.get(getComponentIndex()) == undefined) {
    cleanupCache.set(getComponentIndex(), [])
  }
  if (currentDepsCache == undefined) {
    depsCache.set(getComponentIndex(), [])
  }
  // update
  cleanupCache.get(getComponentIndex())![currentHookIndex] = cleanup
  depsCache.get(getComponentIndex())![currentHookIndex] = deps
}
