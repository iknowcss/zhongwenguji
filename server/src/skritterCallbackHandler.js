const { URL } = require('url');
const request = require('request');

const SKRITTER_TOKEN_URL = 'https://legacy.skritter.com/api/v0/oauth2/token';
const REDIRECT_URL = 'https://n822oyux32.execute-api.ap-southeast-2.amazonaws.com/staging/oauth/skritter/callback';

function isSuccessResponse(response) {
  return response && response.statusCode === 200;
}

function sendGenericErrorResponse(res) {
  res
    .status(500)
    .send({
      error: 'Unexpected error fetching OAuth2 token from Skritter'
    });
}

module.exports = () => {
  const {
    SKRITTER_OAUTH_CLIENT_NAME,
    SKRITTER_OAUTH_CLIENT_SECRET
  } = process.env;

  console.info('SKRITTER_OAUTH_CLIENT_NAME.length', SKRITTER_OAUTH_CLIENT_NAME.length);
  console.info('SKRITTER_OAUTH_CLIENT_SECRET.length', SKRITTER_OAUTH_CLIENT_SECRET.length);

  return (req, res) => {
    const { code, state } = req.query;

    const url = new URL(SKRITTER_TOKEN_URL);
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('client_id', SKRITTER_OAUTH_CLIENT_NAME);
    url.searchParams.set('client_secret', SKRITTER_OAUTH_CLIENT_SECRET);
    url.searchParams.set('redirect_uri', REDIRECT_URL);
    url.searchParams.set('code', code);

    request(url.toString(), (error, response, body) => {
      // Handle network error
      if (error) {
        console.warn('Failed to fetch Skritter OAuth2 token', { error });
        return sendGenericErrorResponse(res);
      }

      // Handle unsuccessful response
      if (!isSuccessResponse(response)) {
        console.warn('Skritter OAuth2 response had unexpected status code', {
          body,
          statusCode: response.statusCode
        });
        return sendGenericErrorResponse(res);
      }

      // Safe-parse response JSON
      let oauthData;
      try {
        oauthData = JSON.parse(body)
      } catch (parseError) {
        console.warn('Failed to parse Skritter OAuth2 response', {
          body,
          error: parseError.stack
        });
        return sendGenericErrorResponse(res);
      }

      // Just write the access token for now
      res.send(oauthData);
    });
  };
};
