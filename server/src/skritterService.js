const { URL } = require('url');
const request = require('request');

const SKRITTER_API_BASE_URL = 'https://legacy.skritter.com/api/v0/';

function isSuccessResponse(response) {
  return response && response.statusCode === 200;
}

function fetchAuthByCode(code) {
  const {
    SKRITTER_OAUTH_CLIENT_NAME,
    SKRITTER_OAUTH_CLIENT_SECRET,
    SKRITTER_OAUTH_CALLBACK_URL,
  } = process.env;

  if (!SKRITTER_OAUTH_CLIENT_NAME) {
    console.warn('SKRITTER_OAUTH_CLIENT_NAME is not set');
  }

  if (!SKRITTER_OAUTH_CLIENT_SECRET) {
    console.warn('SKRITTER_OAUTH_CLIENT_SECRET is not set');
  }

  if (!SKRITTER_OAUTH_CALLBACK_URL) {
    console.warn('SKRITTER_OAUTH_CALLBACK_URL is not set');
  }

  const url = new URL('oauth2/token', SKRITTER_API_BASE_URL);
  url.searchParams.set('grant_type', 'authorization_code');
  url.searchParams.set('client_id', SKRITTER_OAUTH_CLIENT_NAME);
  url.searchParams.set('redirect_uri', SKRITTER_OAUTH_CALLBACK_URL);
  url.searchParams.set('code', code);

  const authString = Buffer
    .from(`${SKRITTER_OAUTH_CLIENT_NAME}:${SKRITTER_OAUTH_CLIENT_SECRET}`)
    .toString('base64');

  return new Promise((resolve, reject) => {
    request({
      url: url.toString(),
      headers: { 'Authorization': `Basic ${authString}` }
    }, (error, response, body) => {
      // Handle network error
      if (error) {
        console.warn('Failed to fetch Skritter OAuth2 token', { error });
        return reject(new Error('Failed to fetch Skritter OAuth2 token'));
      }

      // Handle unsuccessful response
      if (!isSuccessResponse(response)) {
        console.warn('Skritter OAuth2 response had unexpected status code', {
          body,
          statusCode: response.statusCode
        });
        return reject(new Error('Failed to fetch Skritter OAuth2 token'));
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
        return reject(new Error('Failed to fetch Skritter OAuth2 token'));
      }

      // Just write the access token for now
      resolve({
        userId: oauthData.user_id,
        accessToken: oauthData.access_token,
        tokenType: oauthData.token_type
      });
    });
  });
}

function fetchUserDetails(userId, fields) {
  const url = new URL(`users/${userId}`, SKRITTER_API_BASE_URL);
  if (Array.isArray(fields)) {
    url.searchParams.set('fields', fields.join(','));
  }

  return new Promise((resolve, reject) => {
    request(url.toString(), (error, response, body) => {
      // Handle network error
      if (error) {
        console.warn('Failed to fetch Skritter user details', { error });
        return reject(new Error('Failed to fetch Skritter user details'));
      }

      // Handle unsuccessful response
      if (!isSuccessResponse(response)) {
        console.warn('Skritter user details response had unexpected status code', {
          body,
          statusCode: response.statusCode
        });
        return reject(new Error('Failed to fetch Skritter user details'));
      }

      // Safe-parse response JSON
      let user;
      try {
        user = JSON.parse(body).User;
      } catch (parseError) {
        console.warn('Failed to parse Skritter user details response', {
          body,
          error: parseError.stack
        });
        return reject(new Error('Failed to fetch Skritter user details'));
      }

      // Return the user
      resolve(user);
    });
  });
}

module.exports = {
  fetchAuthByCode,
  fetchUserDetails
};
