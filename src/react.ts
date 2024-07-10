// the power of react, calculate diff and update only the necessary parts of the DOM
// Virtual DOM
type VNode = VElement | string | number

class VElement {
  tag: string
  props: {[key: string]: any}
  children: VNode[]

  constructor(tag: string, props: {[key: string]: any}, children: VNode[]) {
    this.tag = tag
    this.props = props
    this.children = children
  }
}

export function createElement(
  type: string | (() => () => VElement),
  props: {[key: string]: any} | null = null,
  ...children: ((() => VElement) | string | number)[]
): () => VElement {
  return () => {
    if (typeof type === "function") {
      return type()()
    }
    componentIndex += 1
    hookIndex = 0
    const element = new VElement(type, props ?? {}, [])
    for (const child of children) {
      if (typeof child === "function") {
        element.children.push(child())
      } else {
        element.children.push(child)
      }
    }
    return element
  }
}

function editProp(
  operation: "add" | "remove",
  element: HTMLElement,
  key: string,
  value: any
) {
  // handle event listeners
  if (key.startsWith("on") && typeof value === "function") {
    const eventName = key.toLowerCase().substring(2)
    if (operation === "add") {
      element.addEventListener(eventName, value)
    } else {
      element.removeEventListener(eventName, value)
    }
    return
  }

  // handle className
  if (key === "className") {
    if (operation === "add") {
      element.className = value
    } else {
      element.className = ""
    }
    return
  }

  // handle other attributes
  if (operation === "add") {
    element.setAttribute(key, value)
  } else {
    element.removeAttribute(key)
  }
}

// mutate element inplace
function updateElement(
  element: HTMLElement,
  newProps: {[key: string]: any},
  oldProps: {[key: string]: any}
) {
  // add and update props
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] !== value) {
      editProp("remove", element, key, oldProps[key])
      editProp("add", element, key, value)
    }
  })
  // remove props
  Object.keys(oldProps).forEach((key) => {
    if (newProps[key] == undefined) {
      editProp("remove", element, key, oldProps[key])
    }
  })
}

function createNode(vnode: VNode) {
  // base case of text and numbers
  if (!(vnode instanceof VElement)) {
    return document.createTextNode(vnode.toString())
  }

  // create element
  const {tag, props, children} = vnode
  const element = document.createElement(tag)

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      editProp("add", element, key, value)
    })
  }

  // render children
  children.forEach((child) => {
    element.appendChild(createNode(child))
  })

  return element
}

function diffAndPatch(
  parent: ChildNode,
  element: ChildNode,
  newVNode: VNode,
  oldVNode: VNode
) {
  // remove
  if (newVNode == undefined) {
    parent.removeChild(element)
    return
  }
  // add
  if (oldVNode == undefined) {
    parent.appendChild(createNode(newVNode))
    return
  }
  // swap
  if (typeof oldVNode != typeof newVNode) {
    parent.replaceChild(createNode(newVNode), element)
    return
  }
  if (typeof oldVNode == "string" || typeof oldVNode == "number") {
    if (oldVNode !== newVNode) {
      parent.replaceChild(createNode(newVNode), element)
    }
    return
  }

  // update
  // compare vitual dom elements and render if props are different
  newVNode = newVNode as VElement
  if (element.nodeType !== Node.ELEMENT_NODE) {
    console.log("critical error", element)
  }
  updateElement(element as HTMLElement, newVNode.props, oldVNode.props)
  componentIndex += 1

  // recursively diff children
  const maxLength = Math.max(oldVNode.children.length, newVNode.children.length)
  const childNodes = [...element.childNodes]
  for (let i = 0; i < maxLength; i++) {
    diffAndPatch(
      element,
      childNodes[i],
      newVNode.children[i],
      oldVNode.children[i]
    )
  }
}

let vals: any[][] = []
let componentIndex = 0
let hookIndex = 0
export function useState<T>(initial: T) {
  if (vals[componentIndex] == undefined) {
    vals[componentIndex] = []
  }
  const hooks = vals[componentIndex]
  const currentHookIndex = hookIndex
  hookIndex += 1
  console.log(vals, componentIndex, currentHookIndex)
  if (hooks[currentHookIndex] === undefined) {
    hooks[currentHookIndex] = initial
  }
  return [
    hooks[currentHookIndex],
    (newVal: T) => {
      hooks[currentHookIndex] = newVal
      rerender()
    },
  ]
}

let oldRoot: VElement
let rootBuilder: () => VElement
let rootElement: HTMLElement

function rerender() {
  componentIndex = 0
  const newRoot = rootBuilder()
  componentIndex = 0
  diffAndPatch(rootElement, rootElement.childNodes[0], newRoot, oldRoot)
  oldRoot = newRoot
}

export function createRoot(element: HTMLElement): {
  render: (builder: () => VElement) => void
} {
  rootElement = element
  return {
    render: (builder) => {
      rootBuilder = builder
      componentIndex = 0
      const newRoot = rootBuilder()
      componentIndex = 0
      diffAndPatch(element, element.childNodes[0], newRoot, oldRoot)
      oldRoot = newRoot
    },
  }
}

export default {createElement, createRoot, useState}
