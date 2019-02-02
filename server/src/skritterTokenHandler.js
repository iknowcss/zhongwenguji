const httpStatus = require('http-status');
const { fetchAuthByCode, fetchUserDetails } = require('./skritterService');
const { encryptObject } = require('./cryptoService');
const CODE_PARSE_REGEXP = /^Code ([a-z0-9]{1,128})$/i;

module.exports = () => async (req, res) => {
  const { headers: { authorization } } = req;

  if (!CODE_PARSE_REGEXP.test(authorization)) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: '"Authorization" header is malformed' });
    return;
  }

  const code = authorization.match(CODE_PARSE_REGEXP)[1];
  try {
    const auth = await fetchAuthByCode(code);
    const user = await fetchUserDetails(auth.userId, ['name']);
    res.json({ user, auth: encryptObject(auth) });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'Failed to authenticate' });
  }
};
