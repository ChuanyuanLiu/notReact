import {genIDOnCallLocation} from "./utils"
import {unmount} from "./hooks"
type VNode = VElement | string | number | null | undefined | object | boolean
let oldRoot: VElement
let rootBuilder: componentType
let rootElement: HTMLElement
// use gloabl componentIndex and hookIndex to send info to the hooks
let componentIndex = ""
let hookIndex = 0
export function getHookIndex() {
  return hookIndex
}
export function setHookIndex(i: number) {
  hookIndex = i
}
export function getComponentIndex() {
  return componentIndex
}
export function setComponentIndex(i: string) {
  componentIndex = i
}

class VElement {
  tag: string
  props: propType
  children: VNode[]
  componentIndex: string

  constructor(
    tag: string,
    props: propType,
    children: VNode[],
    componentIndex: string
  ) {
    this.tag = tag
    this.props = props
    this.children = children
    this.componentIndex = componentIndex
  }
}

type propType = {[key: string]: any; key?: string} | null
type componentType = (defaultKey?: string) => VElement

// IMPORTANT
// primative children such as string and number inherit the componentIndex of the parent
export function createElement<T extends propType>(
  type: string | ((props: T) => componentType),
  props: T,
  ...children: (
    | componentType
    | string
    | number
    | (string | number | componentType)[]
  )[]
): componentType {
  // get the key for the component
  let Index = ""
  if (typeof type === "function") {
    Index = genIDOnCallLocation(4)
  }

  return (defaultKey: string = "") => {
    if (typeof type === "function") {
      // use default key if not provided
      componentIndex = Index
      if (props?.key != undefined) {
        componentIndex += `?key=${props?.key}`
      } else if (defaultKey.length > 0) {
        componentIndex += `?key=${defaultKey}`
      }
      hookIndex = 0
      return type(props)(defaultKey)
    }
    const element = new VElement(type, props ?? {}, [], defaultKey)
    for (const child of children) {
      if (typeof child === "function") {
        element.children.push(child(defaultKey))
        // Handle an array as children
      } else if (Array.isArray(child)) {
        let i = 0
        for (const c of child) {
          if (typeof c === "function") {
            element.children.push(c(i.toString()))
          } else {
            element.children.push(c)
          }
          i += 1
        }
      } else {
        element.children.push(child)
      }
    }
    return element
  }
}

////////////////////////////////////////////////////////////////////////////
////////////////////// Rendering

function editProp(
  operation: "add" | "remove",
  element: HTMLElement,
  key: string,
  value: any
) {
  // handle event listeners
  if (key.startsWith("on") && typeof value === "function") {
    let eventName = key.toLowerCase().substring(2)
    switch (eventName) {
      case "change":
        eventName = "input"
        break
    }
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
  // TODO: handle more cases
  if (operation === "add") {
    switch (key) {
      case "value":
        ;(element as HTMLInputElement).value = value
        break
      case "checked":
        ;(element as HTMLInputElement).checked = value
        break
      default:
        element.setAttribute(key, value)
    }
  } else {
    element.removeAttribute(key)
  }
}

// mutate element inplace
function updateElement(
  element: HTMLElement,
  newProps: propType,
  oldProps: propType
) {
  // add and update props
  if (!(newProps === null)) {
    Object.entries(newProps).forEach(([key, value]) => {
      if (oldProps && oldProps[key] !== value) {
        editProp("remove", element, key, oldProps[key])
        editProp("add", element, key, value)
      }
    })
  }
  // remove props
  if (!(oldProps === null)) {
    Object.keys(oldProps).forEach((key) => {
      if (newProps && newProps[key] === undefined) {
        editProp("remove", element, key, oldProps[key])
      }
    })
  }
}

function createNode(vnode: VNode) {
  // base case of text and numbers
  if (!(vnode instanceof VElement)) {
    if (vnode === undefined || vnode === null || vnode === false) {
      return document.createTextNode("")
    }
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
  if (newVNode === undefined) {
    if (oldVNode === undefined) {
      return
    }
    if (oldVNode instanceof VElement) {
      unmount(oldVNode.componentIndex)
    }
    parent.removeChild(element)
    return
  }
  // add
  if (oldVNode === undefined) {
    parent.appendChild(createNode(newVNode))
    return
  }
  // swap
  if (typeof oldVNode != typeof newVNode) {
    if (oldVNode instanceof VElement) {
      unmount(oldVNode.componentIndex)
    }
    parent.replaceChild(createNode(newVNode), element)
    return
  } else if (
    !(oldVNode instanceof VElement) ||
    !(newVNode instanceof VElement)
  ) {
    if (oldVNode !== newVNode) {
      parent.replaceChild(createNode(newVNode), element)
    }
    return
  }

  // update
  // compare vitual dom elements and render if props are different
  updateElement(element as HTMLElement, newVNode.props, oldVNode.props)

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

export function rerender() {
  const newRoot = rootBuilder()
  diffAndPatch(rootElement, rootElement.childNodes[0], newRoot, oldRoot)
  oldRoot = newRoot
}

// Only support a single instance of root
export function createRoot(element: HTMLElement): {
  render: (builder: componentType) => void
} {
  rootElement = element
  return {
    render: (builder) => {
      rootBuilder = builder
      const newRoot = rootBuilder()
      diffAndPatch(element, element.childNodes[0], newRoot, oldRoot)
      oldRoot = newRoot
    },
  }
}
