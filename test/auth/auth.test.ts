import jwt from 'jsonwebtoken';
import { createJWT } from '../../src/utils/authUtils';

test('creating JWT', () => {
    const tokenSecret = 'test';
    process.env.TOKEN_SECRET = tokenSecret;
    process.env.TOKEN_EXPIRES_IN = '30d';
    process.env.TOKEN_ISSUER = 'https://tue.nl';
    let token = createJWT('id1', 'a1', 'r1');
    let decoded = jwt.verify(token, tokenSecret) as any;
    let expectedDecodedResult = {
        playerId: 'id1',
        accessToken: 'a1',
        refreshToken: 'r1'
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});
