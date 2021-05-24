// eslint-disable-next-line @typescript-eslint/no-var-requires
require('jest-fetch-mock').enableMocks();
process.env.TOKEN_SECRET = 'test';
process.env.TOKEN_EXPIRES_IN = '30d';
process.env.TOKEN_ISSUER = 'https://tue.nl';
// These are just for testing purposes
process.env.AZURE_CLIENT_SECRET = 'aaa';
process.env.AZURE_CLIENT_ID = 'bbb';
