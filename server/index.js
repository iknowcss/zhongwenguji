const serverless = require('serverless-http');
const express = require('express');
const corsMiddleware = require('./src/corsMiddleware');
const getCharacterSampleHandler = require('./src/getCharacterSample');
const getBinSamplesHandler = require('./src/getBinSamples').handler;
const submitTestHandler = require('./src/submitTest');
const skritterTokenHandler = require('./src/skritterTokenHandler');
const skritterAddCharactersHandler = require('./src/skritterAddCharacters');

const app = express();

app.use(corsMiddleware());
app.get('/getCharacterSample', getCharacterSampleHandler());
app.get('/getBinSamples', getBinSamplesHandler);
app.post('/submitTest', submitTestHandler());
app.get('/skritter/oauth/token', skritterTokenHandler());
app.post('/skritter/characters', skritterAddCharactersHandler());

module.exports.handler = serverless(app);
