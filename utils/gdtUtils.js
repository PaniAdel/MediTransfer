module.exports = function gdtLine(segment, data) {
    const safeData = data || "";
    const length = Buffer.byteLength(safeData, "latin1")
      .toString()
      .padStart(3, "0");
    return `${segment}  ${length}${safeData}`;
  }
  