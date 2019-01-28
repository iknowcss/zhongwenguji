const { URL } = require('url');
const { fetchAuthByCode, fetchUserDetails } = require('./skritterService');
const { encryptObject } = require('./cryptoService');

module.exports = () => {
  const { SKRITTER_OAUTH_REDIRECT_URL } = process.env;

  return async (req, res) => {
    const { code, state } = req.query;

    try {
      const auth = await fetchAuthByCode(code);
      const user = await fetchUserDetails(auth.userId, ['name']);
      const skritterContext = { user, auth: encryptObject(auth) };

      const redirectUrl = new URL(SKRITTER_OAUTH_REDIRECT_URL);
      redirectUrl.searchParams.set('skritterContext', Buffer.from(JSON.stringify(skritterContext)).toString('base64'));

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: 'Failed to authenticate' });
    }
  };
};
