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
type componentType = (React?: string) => VElement;
declare function createElement<T extends propType>(type: string | ((props: T) => componentType), props: T, ...children: (componentType | string | number | (string | number | componentType)[])[]): (React?: string) => VElement;
declare function createRoot(element: HTMLElement): {
    render: (builder: componentType) => void;
};
declare function useState<T>(initial: T): [T, (newVal: T | ((oldVal: T) => T)) => void];
declare const _default: {
    createElement: typeof createElement;
    createRoot: typeof createRoot;
    useState: typeof useState;
};

export { createElement, createRoot, _default as default, useState };
