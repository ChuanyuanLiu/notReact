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
const depsCaches = new Map<string, any[][]>()
const cleanupCaches = new Map<string, (cleanupFnType | void)[]>()

// execute all the cleanup functions for a component
export function unmount(componentIndex: string) {
  console.log("unmount", componentIndex)
  const cleanupFns = cleanupCaches.get(componentIndex)
  if (cleanupFns == undefined) {
    return
  }
  for (const cleanup of cleanupFns) {
    if (cleanup != undefined) {
      cleanup()
    }
  }
  cleanupCaches.delete(componentIndex)
}

export function useEffect(fn: () => void | cleanupFnType, deps?: any[]): void {
  const currentHookIndex = getHookIndex()
  setHookIndex(currentHookIndex + 1)
  const depsCache = depsCaches.get(getComponentIndex())
  // check if deps changed or it is an initial render
  if (
    depsCache != undefined &&
    deps != undefined &&
    deps.every((dep, i) => dep === depsCache[currentHookIndex]?.[i])
  ) {
    return
  }
  // setup for inital render
  if (cleanupCaches.get(getComponentIndex()) == undefined) {
    cleanupCaches.set(getComponentIndex(), [])
  }
  if (depsCache == undefined) {
    depsCaches.set(getComponentIndex(), [])
  }
  // cleanup
  const cleanupCache = cleanupCaches.get(getComponentIndex())![currentHookIndex]
  if (cleanupCache != undefined) {
    cleanupCache()
  }
  // run useEffect
  const cleanup = fn()
  // store cleanup function
  cleanupCaches.get(getComponentIndex())![currentHookIndex] = cleanup
  if (deps != undefined) {
    depsCaches.get(getComponentIndex())![currentHookIndex] = deps
  }
}
