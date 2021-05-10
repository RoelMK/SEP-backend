import jwt from 'jsonwebtoken';
import { createJWT } from '../../test/auth/authUtils';

test('creating JWT', () => {
    const tokenSecret = 'test';
    // TODO: change createJWT so it doesn't use environment variables and can be tested without them
    let token = createJWT('id1', 'a1', 'r1', 'test', '30d', 'https://tue.nl');
    let decoded = jwt.verify(token, tokenSecret) as any;
    let expectedDecodedResult = {
        userId: 'id1',
        accessToken: 'a1',
        refreshToken: 'r1'
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});
