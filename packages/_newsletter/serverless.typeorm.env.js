/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { config } = require('dotenv');
const { existsSync } = require('fs');
const { resolve } = require('path');
const { SSM, Config, SharedIniFileCredentials } = require('aws-sdk');

/**
 * AWS SMS Parameter Store
 * Parameter names.
 */
const paramNames = [
  'connection',
  'host',
  'port',
  'username',
  'password',
  'database',
];

function awsSsmParamName(stage, name) {
  return `/beast/newsletter/${stage}/database/${name}`;
}

async function slsParams(stage, provider) {
  const { region, profile } = provider;
  const ssm = new SSM(new Config({
    region,
    credentials: new SharedIniFileCredentials({
      profile,
    }),
  }));
  try {
    const [
      connection,
      host,
      port,
      username,
      password,
      database,
    ] = await Promise.all(paramNames.map(name => {
      const Name = awsSsmParamName(stage, name);
      return ssm.getParameter({
        Name,
        WithDecryption: true,
      }).promise();
    }));
    return {
      TYPEORM_CONNECTION: connection.Parameter.Value,
      TYPEORM_HOST: host.Parameter.Value,
      TYPEORM_PORT: port.Parameter.Value,
      TYPEORM_USERNAME: username.Parameter.Value,
      TYPEORM_PASSWORD: password.Parameter.Value,
      TYPEORM_DATABASE: database.Parameter.Value,
    };
  } catch (error) {
    console.error('error: ', error);
    throw new Error(`Something went wrong while fetching parameters from AWS SSM with stage [${stage}]: [${error.message}]`);
  }
}

async function localParams() {
  // .env
  // packages
  //  ↑
  //  api
  //    ↑
  const envPath = resolve(__dirname, '..', '..', '.env');
  if (existsSync(envPath)) {
    config({ path: envPath });
  } else {
    throw new Error(`Path [${envPath}] is invalid, .env file not found.`);
  }
  return {
    TYPEORM_CONNECTION: process.env.DB_CONNECTION,
    TYPEORM_HOST: process.env.DB_HOST,
    TYPEORM_PORT: process.env.DB_PORT,
    TYPEORM_USERNAME: process.env.DB_USERNAME,
    TYPEORM_PASSWORD: process.env.DB_PASSWORD,
    TYPEORM_DATABASE: process.env.DB_DATABASE,
  };
}

// serverless.env.js
module.exports.params = async args => {
  const stage = args.processedInput.options.stage;
  const { provider } = args.service;
  // Async code that fetches the rate config...
  switch (stage) {
    case 'prod':
    case 'dev':
    case 'sandbox': {
      const params = await localParams();
      console.info(`Stage: [${stage}] params: `, params);
      return await slsParams(stage, provider);
    }
    case 'local': {
      const params = await localParams();
      console.info(`Stage: [${stage}] params: `, params);
      return params;
    }
    default:
      throw new Error(`Stage: [${stage}] is invalid.`);
  }
};
