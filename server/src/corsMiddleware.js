const cors = require('cors');

const { STAGE } = process.env;

function getWhitelist() {
  switch (STAGE) {
    case 'production':
      return /^https?:\/\/(www\.)?hanzishan\.com$/;
    case 'staging':
      return /^https?:\/\/staging\.hanzishan\.com$/;
    default:
      return /^http:\/\/localhost(:\d{1,5})?$/;
  }
}

module.exports = () => {
  const whitelist = getWhitelist();
  return cors({
    origin: function (origin, callback) {
      if (whitelist.test(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
};
