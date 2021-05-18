import { DBClient } from '../../src/db/dbClient';
import fs from 'fs';

beforeAll(() => {
    // Proper cleaning is required after each task
    process.env.DATABASE = 'db.test.db';
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

test('database initialization', () => {
    const dbClient = new DBClient();
    dbClient.initialize();
    dbClient.close();
});

test('database full login procedure', () => {
    const playerId = '1';
    const loginToken = 'a2';
    const expireTime = new Date(new Date().getTime() + 1 * 60000); // Valid for 1 min
    const accessToken = 'a1';
    const refreshToken = 'r1';

    const dbClient = new DBClient();

    expect(dbClient.registerLoginAttempt(playerId, loginToken, expireTime)).toBeTruthy();
    expect(dbClient.registerCallback(playerId, accessToken, refreshToken)).toBeTruthy();

    const expectedRowResults = {
        player_id: playerId,
        login_token: loginToken,
        access_token: accessToken,
        refresh_token: refreshToken
    };
    expect(dbClient.getLoginAttemptByLoginToken(loginToken)).toEqual(
        expect.objectContaining(expectedRowResults)
    );
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy();

    dbClient.close();
});

test('database clean non-expired', () => {
    const playerId = '1266';
    const loginToken = 'a23454';
    const expireTime = new Date(new Date().getTime() + 1 * 60000); // Valid for 1 min

    const dbClient = new DBClient();

    expect(dbClient.registerLoginAttempt(playerId, loginToken, expireTime)).toBeTruthy();
    expect(dbClient.cleanLoginAttempts()).toBeTruthy();
    expect(dbClient.getLoginAttemptByPlayerId(playerId)).toBeDefined();
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy();

    dbClient.close();
});

test('database clean expired', () => {
    const playerId = '12';
    const loginToken = 'a23';
    const expireTime = new Date(new Date().getTime() - 1); // Immediately invalid

    const dbClient = new DBClient();

    expect(dbClient.registerLoginAttempt(playerId, loginToken, expireTime)).toBeTruthy();
    expect(dbClient.cleanLoginAttempts()).toBeTruthy();
    expect(dbClient.getLoginAttemptByPlayerId(playerId)).toBeUndefined();
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy(); // Should still return true

    dbClient.close();
});

test('database callback non-existing', () => {
    const playerId = '123';
    const accessToken = 'a12';
    const refreshToken = 'r12';

    const dbClient = new DBClient();

    expect(dbClient.registerCallback(playerId, accessToken, refreshToken)).toBeFalsy();

    dbClient.close();
});

test('database get undefined', () => {
    const playerId = '1234';
    const loginToken = 'adwd3r';

    const dbClient = new DBClient();

    expect(dbClient.getLoginAttemptByPlayerId(playerId)).toBeUndefined();
    expect(dbClient.getLoginAttemptByLoginToken(loginToken)).toBeUndefined();

    dbClient.close();
});

test('database register double login attempt', () => {
    const playerId = '443';

    let dbClient = new DBClient();
    expect(dbClient.registerLoginAttempt(playerId, '12', new Date())).toBeTruthy();
    dbClient.close();
    dbClient = new DBClient();
    expect(dbClient.registerLoginAttempt(playerId, '123', new Date())).toBeFalsy();
    expect(dbClient.removeFinishedLoginAttempt(playerId)).toBeTruthy();
    dbClient.close();
});
