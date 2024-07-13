type VNode = VElement | string | number;
declare class VElement {
    tag: string;
    props: propType;
    children: VNode[];
    constructor(tag: string, props: propType, children: VNode[]);
}
type propType = {
    [key: string]: any;
} | null;
declare function createElement<T extends propType>(type: string | ((props: T) => (tempKey: string) => VElement), props: T, ...children: (((tempKey: string) => VElement) | string | number | (string | number | ((tempKey: string) => VElement))[])[]): (tempKey: string) => VElement;
declare function createRoot(element: HTMLElement): {
    render: (builder: (defaultKey: string) => VElement) => void;
};
declare function useState<T>(initial: T): [T, (newVal: T | ((oldVal: T) => T)) => void];
declare const _default: {
    createElement: typeof createElement;
    createRoot: typeof createRoot;
    useState: typeof useState;
};

export { createElement, createRoot, _default as default, useState };
