const crypto = require('crypto');

const generateProvablyFairHash = (serverSeed, clientSeed) => {
  return crypto.createHash('sha256').update(serverSeed + clientSeed).digest('hex');
};

module.exports = {
  generateProvablyFairHash
};
