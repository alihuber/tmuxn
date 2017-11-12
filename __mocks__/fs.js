const fs = jest.genMockFromModule('fs');

function existsSync(directoryPath) {
  return true;
}

function writeFileSync(target, source, encoding, callback) {
  return true;
}

function readFileSync(file, encoding) {
  return "$$name$$";
}

fs.existsSync    = existsSync;
fs.writeFileSync = writeFileSync;
fs.readFileSync  = readFileSync;
module.exports   = fs;
