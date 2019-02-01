const httpStatus = require('http-status');
const { decryptObject } = require('./cryptoService');

module.exports = () => (req, res) => {
  const xSession = req.headers['x-session'];
  if (!xSession) {
    return res.status(httpStatus.UNAUTHORIZED).json({error: 'X-Session header not set'});
  }
  let session;
  try {
    session = decryptObject(xSession);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.sendStatus(httpStatus.ACCEPTED);
};
