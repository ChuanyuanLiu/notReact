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
    const childNodes: VNode[] = []
    for (const child of children) {
      if (typeof child === "function") {
        childNodes.push(child())
      } else {
        childNodes.push(child)
      }
    }
    return new VElement(type, props ?? {}, childNodes)
  }
}

function editProp(
  operation: "add" | "remove",
  element: HTMLElement,
  key: string,
  value: any
) {
  if (value == undefined) {
    return
  }
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

function diffAndRender(
  parent: HTMLElement,
  newVNode: VNode,
  oldVNode: VNode,
  index = 0
) {
  parent.appendChild(createNode(newVNode))
}

export function createRoot(rootElement: HTMLElement): {
  render: (builder: () => VElement) => void
} {
  let oldRoot: VElement
  let rootBuilder: () => VElement
  return {
    render: (builder) => {
      rootBuilder = builder
      const newRoot = rootBuilder()
      diffAndRender(rootElement, newRoot, oldRoot)
      oldRoot = newRoot
    },
  }
}

export default {createElement, createRoot}
