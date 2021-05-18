require('jest-fetch-mock').enableMocks();
process.env.TOKEN_SECRET = 'test';
process.env.TOKEN_EXPIRES_IN = '30d';
process.env.TOKEN_ISSUER = 'https://tue.nl';
