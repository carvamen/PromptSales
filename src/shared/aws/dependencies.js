// src/shared/dependencies.js
const SQSService = require('./aws/SQSService');
const SNSService = require('./aws/SNSService');
const LambdaService = require('./aws/LambdaService');

const dependencies = {
  sqsService: new SQSService(),
  snsService: new SNSService(),
  lambdaService: new LambdaService(),
  // ... otras dependencias
};

module.exports = dependencies;