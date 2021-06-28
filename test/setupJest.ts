// eslint-disable-next-line @typescript-eslint/no-var-requires
require('jest-fetch-mock').enableMocks();
jest.setTimeout(60000);
process.env.TOKEN_SECRET = 'test';
process.env.TOKEN_EXPIRES_IN = '30d';
process.env.TOKEN_ISSUER = 'https://tue.nl';
// These are just for testing purposes
process.env.AZURE_CLIENT_SECRET = 'aaa';
process.env.AZURE_CLIENT_ID = 'bbb';
// Defined here so they can be easily changed
process.env.ENDPOINT = 'https://api3.gamebus.eu/v2';
