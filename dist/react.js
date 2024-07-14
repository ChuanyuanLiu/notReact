var React = (function (exports) {
    'use strict';

    function genIDOnCallLocation(depth = 4) {
        const { filePath, lineNumber, columnNumber } = getCallLocation(depth);
        return `${filePath}:${lineNumber}:${columnNumber}`;
    }
    function getCallLocation(depth = 2) {
        try {
            throw new Error();
        }
        catch (error) {
            const stack = error.stack.split("\n");
            let callerLine = stack[depth]; // Adjust this index as needed
            // Handle different stack trace formats
            let match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
            if (!match) {
                match = callerLine.match(/at\s+()(.*):(\d+):(\d+)/);
            }
            if (match) {
                const [, caller, filePath, lineNumber, columnNumber] = match;
                return { caller, filePath, lineNumber, columnNumber };
            }
            return { error: "Unable to parse stack trace" };
        }
    }

    // the power of react, calculate diff and update only the necessary parts of the DOM
    class VElement {
        constructor(tag, props, children) {
            this.tag = tag;
            this.props = props;
            this.children = children;
        }
    }
    function createElement(type, props, ...children) {
        // get the key for the component
        let Index = "";
        if (typeof type === "function") {
            Index = genIDOnCallLocation(4);
        }
        return (defaultKey = "") => {
            if (typeof type === "function") {
                // use default key if not provided
                componentIndex = Index;
                if ((props === null || props === void 0 ? void 0 : props.key) != undefined) {
                    componentIndex += `?key=${props === null || props === void 0 ? void 0 : props.key}`;
                }
                else if (defaultKey.length > 0) {
                    componentIndex += `?key=${defaultKey}`;
                }
                hookIndex = 0;
                return type(props)(defaultKey);
            }
            const element = new VElement(type, props !== null && props !== void 0 ? props : {}, []);
            for (const child of children) {
                if (typeof child === "function") {
                    element.children.push(child(defaultKey));
                    // Handle an array as children
                }
                else if (Array.isArray(child)) {
                    let i = 0;
                    for (const c of child) {
                        if (typeof c === "function") {
                            element.children.push(c(i.toString()));
                        }
                        else {
                            element.children.push(c);
                        }
                        i += 1;
                    }
                }
                else {
                    element.children.push(child);
                }
            }
            return element;
        };
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////// Rendering
    function editProp(operation, element, key, value) {
        // handle event listeners
        if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.toLowerCase().substring(2);
            if (operation === "add") {
                element.addEventListener(eventName, value);
            }
            else {
                element.removeEventListener(eventName, value);
            }
            return;
        }
        // handle className
        if (key === "className") {
            if (operation === "add") {
                element.className = value;
            }
            else {
                element.className = "";
            }
            return;
        }
        // handle other attributes
        if (operation === "add") {
            element.setAttribute(key, value);
        }
        else {
            element.removeAttribute(key);
        }
    }
    // mutate element inplace
    function updateElement(element, newProps, oldProps) {
        // add and update props
        if (!(newProps == null)) {
            Object.entries(newProps).forEach(([key, value]) => {
                if (oldProps && oldProps[key] !== value) {
                    editProp("remove", element, key, oldProps[key]);
                    editProp("add", element, key, value);
                }
            });
        }
        // remove props
        if (!(oldProps == null)) {
            Object.keys(oldProps).forEach((key) => {
                if (newProps && newProps[key] == undefined) {
                    editProp("remove", element, key, oldProps[key]);
                }
            });
        }
    }
    function createNode(vnode) {
        // base case of text and numbers
        if (!(vnode instanceof VElement)) {
            return document.createTextNode(vnode.toString());
        }
        // create element
        const { tag, props, children } = vnode;
        const element = document.createElement(tag);
        if (props) {
            Object.entries(props).forEach(([key, value]) => {
                editProp("add", element, key, value);
            });
        }
        // render children
        children.forEach((child) => {
            // extra type check if user forces an undefined child
            if (child == undefined) {
                return;
            }
            element.appendChild(createNode(child));
        });
        return element;
    }
    function diffAndPatch(parent, element, newVNode, oldVNode) {
        // remove
        if (newVNode == undefined) {
            parent.removeChild(element);
            return;
        }
        // add
        if (oldVNode == undefined) {
            parent.appendChild(createNode(newVNode));
            return;
        }
        // swap
        if (typeof oldVNode != typeof newVNode) {
            parent.replaceChild(createNode(newVNode), element);
            return;
        }
        if (typeof oldVNode == "string" || typeof oldVNode == "number") {
            if (oldVNode !== newVNode) {
                parent.replaceChild(createNode(newVNode), element);
            }
            return;
        }
        // update
        // compare vitual dom elements and render if props are different
        newVNode = newVNode;
        if (element.nodeType !== Node.ELEMENT_NODE) {
            console.error("critical error", element);
        }
        updateElement(element, newVNode.props, oldVNode.props);
        // recursively diff children
        const maxLength = Math.max(oldVNode.children.length, newVNode.children.length);
        const childNodes = [...element.childNodes];
        for (let i = 0; i < maxLength; i++) {
            diffAndPatch(element, childNodes[i], newVNode.children[i], oldVNode.children[i]);
        }
    }
    function rerender() {
        const newRoot = rootBuilder();
        diffAndPatch(rootElement, rootElement.childNodes[0], newRoot, oldRoot);
        oldRoot = newRoot;
    }
    // Only support a single instance of root
    function createRoot(element) {
        rootElement = element;
        return {
            render: (builder) => {
                rootBuilder = builder;
                const newRoot = rootBuilder();
                diffAndPatch(element, element.childNodes[0], newRoot, oldRoot);
                oldRoot = newRoot;
            },
        };
    }
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////// Hooks
    // TODO: improve type hints
    let vals = new Map();
    let componentIndex = "";
    let hookIndex = 0;
    function useState(initial) {
        if (vals.get(componentIndex) == undefined) {
            vals.set(componentIndex, []);
        }
        const hooks = vals.get(componentIndex);
        const currentHookIndex = hookIndex;
        hookIndex += 1;
        if (hooks[currentHookIndex] === undefined) {
            if (typeof initial == "function") {
                hooks[currentHookIndex] = initial();
            }
            else {
                hooks[currentHookIndex] = initial;
            }
        }
        return [
            hooks[currentHookIndex],
            (newVal) => {
                if (typeof newVal === "function") {
                    hooks[currentHookIndex] = newVal(hooks[currentHookIndex]);
                }
                else {
                    hooks[currentHookIndex] = newVal;
                }
                rerender();
            },
        ];
    }
    ////////////////////////////////////////////////////////////////////////////
    // Global variables
    let oldRoot;
    let rootBuilder;
    let rootElement;
    var react = { createElement, createRoot, useState };

    exports.createElement = createElement;
    exports.createRoot = createRoot;
    exports.default = react;
    exports.useState = useState;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
