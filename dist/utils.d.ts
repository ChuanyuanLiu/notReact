export declare function genIDOnCallLocation(depth?: number): string;
export declare function getCallLocation(depth?: number): {
    caller: any;
    filePath: any;
    lineNumber: any;
    columnNumber: any;
    error?: undefined;
} | {
    error: string;
    caller?: undefined;
    filePath?: undefined;
    lineNumber?: undefined;
    columnNumber?: undefined;
};
