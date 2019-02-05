const { URL } = require('url');
const request = require('request');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const cloneDeep = require('lodash/cloneDeep');
const { decryptObject } = require('./cryptoService');

const SKRITTER_API_BASE_URL = 'https://legacy.skritter.com/api/v0/';
const VOCAB_LIST_NAME = 'HanziShan Missed Characters';

function buildAuthHeaders(session) {
  return {
    authorization: `${session.tokenType} ${session.accessToken}`
  };
}

function apiCall(what, { session, url, headers, validStatusCodes = [200, 201], ...options }) {
  return new Promise((resolve, reject) => {
    request({
      url: url.toString(),
      headers: { ...headers, ...buildAuthHeaders(session) },
      json: true,
      ...options
    }, (error, response, body) => {
      // Handle network error
      if (error) {
        console.warn(`Failed to call ${what}`, { error });
        return reject(new Error(`Failed to call ${what}`));
      }

      // Handle unsuccessful response
      if (validStatusCodes.indexOf(response.statusCode) < 0) {
        console.warn(`${what} response had unexpected status code`, {
          body,
          statusCode: response.statusCode
        });
        return reject(new Error(`Failed to call ${what}`));
      }

      // Done
      resolve(body);
    });
  });
}

async function findHanziShanVocabList(session) {
  const url = new URL('vocablists', SKRITTER_API_BASE_URL);
  url.searchParams.set('sort', 'custom');
  url.searchParams.set('fields', 'id,name,creator');

  const { VocabLists: vocabLists } = await apiCall('search Skritter vocab lists', { url, session });
  const matchingLists = vocabLists
    .filter(({ creator, name }) => creator === session.userId && name === VOCAB_LIST_NAME);

  switch (matchingLists.length) {
    case 0: return null;
    case 1: return matchingLists[0];
    default:
      console.warn('Found multiple matching vocab lists; returning the 1st', {
        userId: session.userId,
        name: VOCAB_LIST_NAME
      });
      return matchingLists[0];
  }
}

async function getHanziShanVocabList(session, vocabListId) {
  const url = new URL(`vocablists/${vocabListId}`, SKRITTER_API_BASE_URL);
  url.searchParams.set('fields', 'id,name,creator,sections');

  const { VocabList: vocabList } = await apiCall('get Skritter vocab list', { url, session });

  return vocabList;
}

async function createHanziShanVocablist(session) {
  const body = {
    name: VOCAB_LIST_NAME,
    lang: 'zh',
    description: 'Hanzi Shan missed character review list',
    creator: session.userId,
    tags: ['hanzishan'],
    sections: []
  };

  const url = new URL('vocablists', SKRITTER_API_BASE_URL);
  const { VocabList: vocabList } = await apiCall('create Skritter vocab list', {
    session,
    url,
    method: 'POST',
    body
  });

  return vocabList;
}


function createSection(index = 0, characters) {
  return {
    name: `Test ${index + 1}`,
    rows: []
  };
}

async function addHanzishanVocabListSection(session, existingVocabList, characters) {
  const url = new URL(`vocablists/${existingVocabList.id}`, SKRITTER_API_BASE_URL);
  const body = {
    studyingMode: 'adding',
    sections: cloneDeep(existingVocabList.sections)
  };
  body.sections.push(createSection(body.sections.length, characters));

  await apiCall('add section to Skritter vocab list', {
    session,
    url,
    method: 'PUT',
    body
  });
}

async function addCharactersToVocabList(session, characters) {
  let vocabList = await findHanziShanVocabList(session);
  if (!vocabList) {
    console.info('Create vocab list for user', { userId: session.userId });
    vocabList = await createHanziShanVocablist(session);
  } else {
    console.info('Vocab list already exists for user', { userId: session.userId, vocabListId: vocabList.id });
    vocabList = await getHanziShanVocabList(session, vocabList.id);
  }

  await addHanzishanVocabListSection(session, vocabList, characters);
}

module.exports = () => [
  bodyParser.json(),
  async (req, res) => {
    const xSession = req.headers['x-session'];
    if (!xSession) {
      return res.status(httpStatus.UNAUTHORIZED).json({error: 'X-Session header not set'});
    }
    let session;
    try {
      session = decryptObject(xSession);
      const { characters } = req.body;
      await addCharactersToVocabList(session, characters);
    } catch (error) {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.sendStatus(httpStatus.ACCEPTED);
  }
];
