export declare function useState<T>(initial: T): [T, (newVal: T | ((oldVal: T) => T)) => void];
type cleanupFnType = () => void;
export declare function unmount(componentIndex: string): void;
export declare function useEffect(fn: () => void | cleanupFnType, deps?: any[]): void;
export {};
