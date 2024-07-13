type VNode = VElement | string | number;
declare class VElement {
    tag: string;
    props: {
        [key: string]: any;
    };
    children: VNode[];
    constructor(tag: string, props: {
        [key: string]: any;
    }, children: VNode[]);
}
declare function createElement(type: string | (() => () => VElement), props?: {
    [key: string]: any;
} | null, ...children: ((() => VElement) | string | number)[]): () => VElement;
declare function createRoot(element: HTMLElement): {
    render: (builder: () => VElement) => void;
};
declare function useState<T>(initial: T): any[];
declare const _default: {
    createElement: typeof createElement;
    createRoot: typeof createRoot;
    useState: typeof useState;
};

export { createElement, createRoot, _default as default, useState };
