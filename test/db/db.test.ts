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

test('log child token', () => {
    const childEmail = 'child@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.logToken(childEmail, '123')).toBeTruthy();
    dbClient.close();
});

test('request supervisor', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.requestSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    dbClient.close();
});

test('Get a list of requested supervisors for a normal user', () => {
    const childEmail = 'child@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.getRequestedSupervisors(childEmail)).toEqual({
        supervisor_email: 'supervisor@gmail.com'
    });
    dbClient.close();
});

test('Get a list of normal users requested supervisor role from a supervisor', () => {
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.getRequestedChildren(supervisorEmail)).toEqual({
        player_email: 'child@gmail.com'
    });
    dbClient.close();
});

test('Confirm supervisor', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.confirmSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    dbClient.close();
});

test('Get child token', () => {
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.getChildTokens(supervisorEmail)).toEqual({
        player_token: '123'
    });
    dbClient.close();
});

test('Retract supervisor permission', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.retractPermission(childEmail, supervisorEmail)).toBeTruthy();
    expect(dbClient.getChildTokens(supervisorEmail)).toEqual(undefined);
    dbClient.close();
});
