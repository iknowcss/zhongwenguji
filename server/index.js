const serverless = require('serverless-http');
const express = require('express');
const getCharacterSample = require('./src/getCharacterSample');
const submitTest = require('./src/submitTest');
const skritterCallbackHandler = require('./src/skritterCallbackHandler');
const skritterAddCharacters = require('./src/skritterAddCharacters');

const app = express();

const cors = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });
  next();
};

app.get('/getCharacterSample', cors, getCharacterSample());
app.post('/submitTest', cors, submitTest());
app.get('/skritter/oauth/callback', skritterCallbackHandler());
app.post('/skritter/characters', skritterAddCharacters());

module.exports.handler = serverless(app);
