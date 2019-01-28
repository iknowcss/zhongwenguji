const aesjs = require('aes-js');

let aesInstance;
function getAesInstance() {
  if (!aesInstance) {
    const { STATE_ENCRYPTION_KEY, STATE_ENCRYPTION_IV } = process.env;
    const key = aesjs.utils.hex.toBytes(STATE_ENCRYPTION_KEY);
    const iv = aesjs.utils.hex.toBytes(STATE_ENCRYPTION_IV);
    aesInstance = new aesjs.ModeOfOperation.cbc(key, iv);
  }
  return aesInstance;
}

function encryptObject(obj) {
  const unpaddedTextBytes = aesjs.utils.utf8.toBytes(JSON.stringify(obj));
  const uptbl = unpaddedTextBytes.length;
  const paddedTextBytes = new Uint8Array(16 * Math.ceil(uptbl / 16));
  for (let i = 0; i < uptbl; i++) {
    paddedTextBytes[i] = unpaddedTextBytes[i];
  }
  const encryptedBytes = getAesInstance().encrypt(paddedTextBytes);
  return Buffer.from(encryptedBytes).toString('base64');
}

function decryptObject(base64Str) {
  const cyphertext = new Uint8Array(Buffer.from(base64Str, 'base64'));
  const decryptedBytes = getAesInstance().decrypt(cyphertext);
  const paddedTextBytes = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return JSON.parse(paddedTextBytes.substring(0, paddedTextBytes.lastIndexOf('}') + 1));
}

module.exports = {
  encryptObject,
  decryptObject
};