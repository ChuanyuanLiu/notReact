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

    // useState
    // TODO: improve type hints
    let vals = new Map();
    function useState(initial) {
        if (vals.get(getComponentIndex()) == undefined) {
            vals.set(getComponentIndex(), []);
        }
        const hooks = vals.get(getComponentIndex());
        const currentHookIndex = getHookIndex();
        setHookIndex(currentHookIndex + 1);
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
    const depsCaches = new Map();
    const cleanupCaches = new Map();
    // execute all the cleanup functions for a component
    function unmount(componentIndex) {
        const cleanupFns = cleanupCaches.get(componentIndex);
        if (cleanupFns == undefined) {
            return;
        }
        for (const cleanup of cleanupFns) {
            if (cleanup != undefined) {
                cleanup();
            }
        }
        cleanupCaches.delete(componentIndex);
    }
    function useEffect(fn, deps) {
        const currentHookIndex = getHookIndex();
        setHookIndex(currentHookIndex + 1);
        const currentComponentIndex = getComponentIndex();
        const depsCache = depsCaches.get(currentComponentIndex);
        // check if deps changed or it is an initial render
        if (depsCache != undefined &&
            deps != undefined &&
            deps.every((dep, i) => { var _a; return dep === ((_a = depsCache[currentHookIndex]) === null || _a === void 0 ? void 0 : _a[i]); })) {
            return;
        }
        // setup for inital render
        if (cleanupCaches.get(currentComponentIndex) == undefined) {
            cleanupCaches.set(currentComponentIndex, []);
        }
        if (depsCache == undefined) {
            depsCaches.set(currentComponentIndex, []);
        }
        if (deps != undefined) {
            depsCaches.get(currentComponentIndex)[currentHookIndex] = deps;
        }
        // run cleanup function
        const oldCleanup = cleanupCaches.get(currentComponentIndex)[currentHookIndex];
        if (oldCleanup != undefined) {
            oldCleanup();
        }
        // run useEffect
        const cleanup = fn();
        // store cleanup function
        cleanupCaches.get(currentComponentIndex)[currentHookIndex] = cleanup;
    }

    let oldRoot;
    let rootBuilder;
    let rootElement;
    // use gloabl componentIndex and hookIndex to send info to the hooks
    let componentIndex = "";
    let hookIndex = 0;
    function getHookIndex() {
        return hookIndex;
    }
    function setHookIndex(i) {
        hookIndex = i;
    }
    function getComponentIndex() {
        return componentIndex;
    }
    class VElement {
        constructor(tag, props, children, componentIndex) {
            this.tag = tag;
            this.props = props;
            this.children = children;
            this.componentIndex = componentIndex;
        }
    }
    // IMPORTANT
    // primative children such as string and number inherit the componentIndex of the parent
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
            const element = new VElement(type, props !== null && props !== void 0 ? props : {}, [], defaultKey);
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
            let eventName = key.toLowerCase().substring(2);
            switch (eventName) {
                case "change":
                    eventName = "input";
                    break;
            }
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
        // TODO: handle more cases
        if (operation === "add") {
            switch (key) {
                case "value":
                    element.value = value;
                    break;
                case "checked":
                    element.checked = value;
                    break;
                default:
                    element.setAttribute(key, value);
            }
        }
        else {
            element.removeAttribute(key);
        }
    }
    // mutate element inplace
    function updateElement(element, newProps, oldProps) {
        // add and update props
        if (!(newProps === null)) {
            Object.entries(newProps).forEach(([key, value]) => {
                if (oldProps && oldProps[key] !== value) {
                    editProp("remove", element, key, oldProps[key]);
                    editProp("add", element, key, value);
                }
            });
        }
        // remove props
        if (!(oldProps === null)) {
            Object.keys(oldProps).forEach((key) => {
                if (newProps && newProps[key] === undefined) {
                    editProp("remove", element, key, oldProps[key]);
                }
            });
        }
    }
    function createNode(vnode) {
        // base case of text and numbers
        if (!(vnode instanceof VElement)) {
            if (vnode === undefined || vnode === null || vnode === false) {
                return document.createTextNode("");
            }
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
            element.appendChild(createNode(child));
        });
        return element;
    }
    function diffAndPatch(parent, element, newVNode, oldVNode) {
        // remove
        if (newVNode === undefined) {
            if (oldVNode === undefined) {
                return;
            }
            if (oldVNode instanceof VElement) {
                unmount(oldVNode.componentIndex);
            }
            parent.removeChild(element);
            return;
        }
        // add
        if (oldVNode === undefined) {
            parent.appendChild(createNode(newVNode));
            return;
        }
        // swap
        if (typeof oldVNode != typeof newVNode) {
            if (oldVNode instanceof VElement) {
                unmount(oldVNode.componentIndex);
            }
            parent.replaceChild(createNode(newVNode), element);
            return;
        }
        else if (!(oldVNode instanceof VElement) ||
            !(newVNode instanceof VElement)) {
            if (oldVNode !== newVNode) {
                parent.replaceChild(createNode(newVNode), element);
            }
            return;
        }
        // update
        // compare vitual dom elements and render if props are different
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

    var react = { createElement, createRoot, useState, useEffect };

    exports.createElement = createElement;
    exports.createRoot = createRoot;
    exports.default = react;
    exports.useEffect = useEffect;
    exports.useState = useState;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
