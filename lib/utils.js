"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genIDOnCallLocation = genIDOnCallLocation;
exports.getCallLocation = getCallLocation;
function genIDOnCallLocation(depth) {
    if (depth === void 0) { depth = 4; }
    var _a = getCallLocation(depth), filePath = _a.filePath, lineNumber = _a.lineNumber, columnNumber = _a.columnNumber;
    return "".concat(filePath, ":").concat(lineNumber, ":").concat(columnNumber);
}
function getCallLocation(depth) {
    if (depth === void 0) { depth = 2; }
    try {
        throw new Error();
    }
    catch (error) {
        error;
        var stack = error.stack.split("\n");
        var callerLine = stack[depth]; // Adjust this index as needed
        // Handle different stack trace formats
        var match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
        if (!match) {
            match = callerLine.match(/at\s+()(.*):(\d+):(\d+)/);
        }
        if (match) {
            var caller = match[1], filePath = match[2], lineNumber = match[3], columnNumber = match[4];
            return { caller: caller, filePath: filePath, lineNumber: lineNumber, columnNumber: columnNumber };
        }
        return { error: "Unable to parse stack trace" };
    }
}
