const serverless = require('serverless-http');
const express = require('express');
const corsMiddleware = require('./src/corsMiddleware');
const getBinSamplesHandler = require('./src/sample/getBinSamplesHandler');
const submitTestHandler = require('./src/analyze/submitTest');

const app = express();

app.use(corsMiddleware());
app.get('/getBinSamples', getBinSamplesHandler);
app.post('/submitTest', submitTestHandler());

module.exports.handler = serverless(app);
