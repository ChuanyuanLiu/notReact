"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = createElement;
exports.createRoot = createRoot;
exports.useState = useState;
// the power of react, calculate diff and update only the necessary parts of the DOM
var utils_1 = require("./utils");
var VElement = /** @class */ (function () {
    function VElement(tag, props, children) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }
    return VElement;
}());
function createElement(type, props) {
    if (props === void 0) { props = null; }
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    // get the id for the component
    var id = "";
    if (typeof type === "function") {
        id = (0, utils_1.genIDOnCallLocation)(4);
    }
    return function () {
        if (typeof type === "function") {
            componentIndex = id;
            hookIndex = 0;
            return type()();
        }
        var element = new VElement(type, props !== null && props !== void 0 ? props : {}, []);
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (typeof child === "function") {
                element.children.push(child());
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
        var eventName = key.toLowerCase().substring(2);
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
    Object.entries(newProps).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (oldProps[key] !== value) {
            editProp("remove", element, key, oldProps[key]);
            editProp("add", element, key, value);
        }
    });
    // remove props
    Object.keys(oldProps).forEach(function (key) {
        if (newProps[key] == undefined) {
            editProp("remove", element, key, oldProps[key]);
        }
    });
}
function createNode(vnode) {
    // base case of text and numbers
    if (!(vnode instanceof VElement)) {
        return document.createTextNode(vnode.toString());
    }
    // create element
    var tag = vnode.tag, props = vnode.props, children = vnode.children;
    var element = document.createElement(tag);
    if (props) {
        Object.entries(props).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            editProp("add", element, key, value);
        });
    }
    // render children
    children.forEach(function (child) {
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
    var maxLength = Math.max(oldVNode.children.length, newVNode.children.length);
    var childNodes = __spreadArray([], element.childNodes, true);
    for (var i = 0; i < maxLength; i++) {
        diffAndPatch(element, childNodes[i], newVNode.children[i], oldVNode.children[i]);
    }
}
function rerender() {
    var newRoot = rootBuilder();
    diffAndPatch(rootElement, rootElement.childNodes[0], newRoot, oldRoot);
    oldRoot = newRoot;
}
// Only support a single instance of root
function createRoot(element) {
    rootElement = element;
    return {
        render: function (builder) {
            rootBuilder = builder;
            var newRoot = rootBuilder();
            diffAndPatch(element, element.childNodes[0], newRoot, oldRoot);
            oldRoot = newRoot;
        },
    };
}
////////////////////////////////////////////////////////////////////////////
////////////////////// Hooks
var vals = new Map();
var componentIndex = "";
var hookIndex = 0;
function useState(initial) {
    if (vals.get(componentIndex) == undefined) {
        vals.set(componentIndex, []);
    }
    var hooks = vals.get(componentIndex);
    var currentHookIndex = hookIndex;
    hookIndex += 1;
    if (hooks[currentHookIndex] === undefined) {
        hooks[currentHookIndex] = initial;
    }
    return [
        hooks[currentHookIndex],
        function (newVal) {
            hooks[currentHookIndex] = newVal;
            rerender();
        },
    ];
}
var oldRoot;
var rootBuilder;
var rootElement;
exports.default = { createElement: createElement, createRoot: createRoot, useState: useState };
