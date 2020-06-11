const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./src/corsMiddleware');
const getBinSamplesHandler = require('./src/sample/getBinSamplesHandler');
const submitTestHandler = require('./src/analyze/submitTestHandler');

const app = express();

app.use(corsMiddleware());
app.get('/getBinSamples', getBinSamplesHandler);
app.post('/submitTest', bodyParser.json(), submitTestHandler);

module.exports.handler = serverless(app);
