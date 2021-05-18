import jwt from 'jsonwebtoken';
import { DBClient } from '../../src/db/dbClient';
import { createJWT, finishLoginAttempt, registerConnectCallback, startLoginAttempt } from '../../src/utils/authUtils';
const fs = require('fs');

beforeEach(() => {
    // Reset database
    process.env.DATABASE = 'auth.test.db';
    let dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();
});

afterAll(() => {
    try {
        fs.unlinkSync(process.env.DATABASE); // Remove db file
    } catch (error) {
    }
});

/**
 * Purpose: Check if JWTs are created properly.
 */
test('creating JWT', () => {
    let token = createJWT('id1', 'a1', 'r1');
    let decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as any;
    let expectedDecodedResult = {
        playerId: 'id1',
        accessToken: 'a1',
        refreshToken: 'r1'
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});

/**
 * Purpose: Check if a normal login attempt works as expected.
 */
test('full login attempt', async() => {
    const playerId: string = '444';
    const accessToken = 'a123423r';
    const refreshToken = 'qijj39r3r92';

    // Make login attempt
    let token = await startLoginAttempt(playerId, true);
    expect(token).toBeDefined();
    expect(token?.expires).toBeGreaterThan(new Date().getTime());
    expect(token?.loginToken).toBeDefined();
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeTruthy();
    let generatedJwt = finishLoginAttempt(token?.loginToken as string);
    expect(generatedJwt).toBeDefined();

    // Verify login result
    let decoded = jwt.verify(generatedJwt as string, process.env.TOKEN_SECRET as string) as any;
    let expectedDecodedResult = {
        playerId: playerId,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});


/**
 * Purpose: Check if trying to start multiple login attempts is handled properly.
 */
test('start login attempt twice', async() => {
    const playerId = '445';

    // Make attempts
    expect(await startLoginAttempt(playerId, true)).toBeDefined();
    expect(await startLoginAttempt(playerId, true)).toBeUndefined();

    // Clean database
    let dbClient = new DBClient();
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy();
    dbClient.close();
});

/**
 * Purpose: Check if trying to finish a non-existing login session is handled properly.
 */
test('finish login while not started', () => {
    const loginToken = 'werwerrw445';

    // Make attempt
    expect(finishLoginAttempt(loginToken)).toBeUndefined();
});

/**
 * Purpose: Check if an unnecessary callback is handled properly.
 */
test('callback while no open login', async() => {
    const playerId = "34we";
    const accessToken = "a234423";
    const refreshToken = "r32443";

    // Make attempt
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeFalsy();
});

/**
 * Purpose: Check if a login attempt cannot be hijacked.
 */
test('start login again after callback', async() => {
    const playerId = '447';
    const accessToken = "a2344";
    const refreshToken = "r667";

    // Start login
    let token = await startLoginAttempt(playerId, true);
    expect(token).toBeDefined();

    // Make callback
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeTruthy();

    // Try to start login again
    expect(await startLoginAttempt(playerId, true)).toBeUndefined();

    // Finish login
    expect(finishLoginAttempt(token?.loginToken as string)).toBeDefined();
});