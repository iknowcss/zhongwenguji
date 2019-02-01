const serverless = require('serverless-http');
const express = require('express');
const getCharacterSampleHandler = require('./src/getCharacterSample');
const submitTestHandler = require('./src/submitTest');
const skritterTokenHandler = require('./src/skritterTokenHandler');
const skritterAddCharactersHandler = require('./src/skritterAddCharacters');

const app = express();

const cors = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  });
  next();
};

app.get('/getCharacterSample', cors, getCharacterSampleHandler());
app.post('/submitTest', cors, submitTestHandler());
app.get('/skritter/oauth/token', skritterTokenHandler());
app.post('/skritter/characters', skritterAddCharactersHandler());

module.exports.handler = serverless(app);
