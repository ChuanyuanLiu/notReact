export function genIDOnCallLocation(depth = 4) {
  const {filePath, lineNumber, columnNumber} = getCallLocation(depth)
  return `${filePath}:${lineNumber}:${columnNumber}`
}

export function getCallLocation(depth = 2) {
  try {
    throw new Error()
  } catch (error: any) {
    error as Error
    const stack = error.stack.split("\n")
    let callerLine = stack[depth] // Adjust this index as needed

    // Handle different stack trace formats
    let match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/)
    if (!match) {
      match = callerLine.match(/at\s+()(.*):(\d+):(\d+)/)
    }

    if (match) {
      const [, caller, filePath, lineNumber, columnNumber] = match
      return {caller, filePath, lineNumber, columnNumber}
    }

    return {error: "Unable to parse stack trace"}
  }
}
