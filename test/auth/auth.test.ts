import jwt from 'jsonwebtoken';
import { DBClient } from '../../src/db/dbClient';
import {
    createJWT,
    finishLoginAttempt,
    refreshJWT,
    registerConnectCallback,
    startLoginAttempt
} from '../../src/utils/authUtils';
import fs from 'fs';

beforeEach(() => {
    // Reset database
    process.env.DATABASE = 'auth.test.db';
    const dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();
});

afterAll(() => {
    try {
        fs.unlinkSync(process.env.DATABASE!); // Remove db file
    } catch (error) {
        return;
    }
});

/**
 * Purpose: Check if JWTs are created properly.
 * UTP: AUTH - 1
 */
test('creating JWT', () => {
    const token = createJWT('id1', 'a1', 'r1');
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as any;
    const expectedDecodedResult = {
        playerId: 'id1',
        accessToken: 'a1',
        refreshToken: 'r1'
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});

/**
 * Purpose: Check if a normal login attempt works as expected.
 * UTP: AUTH - 2, 3, 4
 */
test('full login attempt', async () => {
    const playerId = '444';
    const accessToken = 'a123423r';
    const refreshToken = 'qijj39r3r92';

    // Make login attempt
    const token = await startLoginAttempt(playerId, true);
    expect(token).toBeDefined();
    expect(token?.expires).toBeGreaterThan(new Date().getTime());
    expect(token?.loginToken).toBeDefined();
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeTruthy();
    const generatedJwt = finishLoginAttempt(token?.loginToken as string);
    expect(generatedJwt).toBeDefined();

    // Verify login result
    const decoded = jwt.verify(generatedJwt as string, process.env.TOKEN_SECRET as string) as any;
    const expectedDecodedResult = {
        playerId: playerId,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    // Simply check that the expectedDecodedResult fields are present when verifying the (decoded) token
    expect(decoded).toEqual(expect.objectContaining(expectedDecodedResult));
});

/**
 * Purpose: Check if trying to start multiple login attempts is handled properly.
 * UTP: AUTH - 2
 */
test('start login attempt twice', async () => {
    const playerId = '445';

    // Make attempts
    expect(await startLoginAttempt(playerId, true)).toBeDefined();
    expect(await startLoginAttempt(playerId, true)).toBeUndefined();

    // Clean database
    const dbClient = new DBClient();
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy();
    dbClient.close();
});

/**
 * Purpose: Check if trying to finish a non-existing login session is handled properly.
 * UTP: AUTH - 3
 */
test('finish login while not started', () => {
    const loginToken = 'werwerrw445';

    // Make attempt
    expect(finishLoginAttempt(loginToken)).toBeUndefined();
});

/**
 * Purpose: Check if an unnecessary callback is handled properly.
 * UTP: AUTH - 4
 */
test('callback while no open login', async () => {
    const playerId = '34we';
    const accessToken = 'a234423';
    const refreshToken = 'r32443';

    // Make attempt
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeFalsy();
});

/**
 * Purpose: Check if a login attempt cannot be hijacked.
 * UTP: AUTH - 5
 */
test('start login again after callback', async () => {
    const playerId = '447';
    const accessToken = 'a2344';
    const refreshToken = 'r667';

    // Start login
    const token = await startLoginAttempt(playerId, true);
    expect(token).toBeDefined();

    // Make callback
    expect(registerConnectCallback(playerId, accessToken, refreshToken)).toBeTruthy();

    // Try to start login again
    expect(await startLoginAttempt(playerId, true)).toBeUndefined();

    // Finish login
    expect(finishLoginAttempt(token?.loginToken as string)).toBeDefined();
});

/**
 * UTP: TODO
 */
test('Refreshing JWT', async () => {
    const playerId = '1';
    const refreshToken = '2';
    expect(refreshJWT(playerId, refreshToken)).toBeDefined();
});

/**
 * UTP: TODO
 * Now we give undefined as input but this could also come from GameBus
 */
test('startLoginAttempt with undefined email address', async () => {
    expect(await startLoginAttempt('', true)).toBeUndefined();
});
