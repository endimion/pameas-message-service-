const fs = require("fs");

const base64ImageFromFilePath = async (filePath) => {
  return `<img src="data:image/png;base64,${encodeURIComponent(
    await base64Encode(filePath)
  )}"/>`;
};

function base64Encode(filePath) {
  let fb = fs.readFileSync(filePath);
  let fileData = fb.toString("latin1");
  b = Buffer.from(fileData, "latin1");
  return b.toString("base64");
}
exports.base64ImageFromFilePath = base64ImageFromFilePath;
