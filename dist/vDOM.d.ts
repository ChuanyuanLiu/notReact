type VNode = VElement | string | number;
export declare function getHookIndex(): number;
export declare function setHookIndex(i: number): void;
export declare function getComponentIndex(): string;
export declare function setComponentIndex(i: string): void;
declare class VElement {
    tag: string;
    props: propType;
    children: VNode[];
    constructor(tag: string, props: propType, children: VNode[]);
}
type propType = {
    [key: string]: any;
    key?: string;
} | null;
type componentType = (React?: string) => VElement;
export declare function createElement<T extends propType>(type: string | ((props: T) => componentType), props: T, ...children: (componentType | string | number | (string | number | componentType)[])[]): (React?: string) => VElement;
export declare function rerender(): void;
export declare function createRoot(element: HTMLElement): {
    render: (builder: componentType) => void;
};
export {};
