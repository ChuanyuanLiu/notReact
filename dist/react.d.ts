type VNode = VElement | string | number | null | undefined | object | boolean;
declare class VElement {
    tag: string;
    props: propType;
    children: VNode[];
    componentIndex: string;
    constructor(tag: string, props: propType, children: VNode[], componentIndex: string);
}
type propType = {
    [key: string]: any;
    key?: string;
} | null;
type componentType = (defaultKey?: string) => VElement;
declare function createElement<T extends propType>(type: string | ((props: T) => componentType), props: T, ...children: (componentType | string | number | (string | number | componentType)[])[]): componentType;
declare function createRoot(element: HTMLElement): {
    render: (builder: componentType) => void;
};

declare function useState<T>(initial: T): [T, (newVal: T | ((oldVal: T) => T)) => void];
type cleanupFnType = () => void;
declare function useEffect(fn: () => void | cleanupFnType, deps?: any[]): void;

declare const _default: {
    createElement: typeof createElement;
    createRoot: typeof createRoot;
    useState: typeof useState;
    useEffect: typeof useEffect;
};

export { createElement, createRoot, _default as default, useEffect, useState };
