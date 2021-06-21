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
    expect(dbClient.getRequestedSupervisors(childEmail)).toEqual([
        {
            supervisor_email: 'supervisor@gmail.com'
        }
    ]);
    dbClient.close();
});

test('Confirm supervisor', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.confirmSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    dbClient.close();
});

test('Get a list of supervisors which role is approved', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.confirmSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    expect(dbClient.getApprovedSupervisors(childEmail)).toEqual([
        {
            supervisor_email: 'supervisor@gmail.com'
        }
    ]);
    dbClient.close();
});

test('Check if user is a supervisor', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.confirmSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    expect(dbClient.checkRole(supervisorEmail)).toBeTruthy();
    dbClient.close();
});

test('Get a list of normal users requested supervisor role from a supervisor', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.confirmSupervisor(supervisorEmail, childEmail)).toBeTruthy();
    expect(dbClient.getChildren(supervisorEmail)).toEqual([
        {
            player_email: 'child@gmail.com'
        }
    ]);
    dbClient.close();
});

test('Retract supervisor permission', () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    const dbClient = new DBClient();
    expect(dbClient.retractPermission(childEmail, supervisorEmail)).toBeTruthy();
    dbClient.close();
});

test('Register a file parse event and retrieve it', () => {
    const playerId = '443';
    const fileName = 'foodDiary.xlsx';
    const timeStamp = 1000000000000;

    let dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId, fileName, timeStamp)).toBeTruthy();
    dbClient.close();
    dbClient = new DBClient();
    expect(dbClient.getLastUpdate(playerId, fileName)).toStrictEqual(timeStamp);
    dbClient.close();
});

test('Register and update a file parse event and retrieve it', () => {
    const playerId = '443';
    const fileName = 'foodDiary.xlsx';
    const timeStamp = 1000000000000;

    let dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId, fileName, timeStamp)).toBeTruthy();
    dbClient.close();

    dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId, fileName, timeStamp + 100000)).toBeTruthy();
    dbClient.close();

    dbClient = new DBClient();
    expect(dbClient.getLastUpdate(playerId, fileName)).toStrictEqual(timeStamp + 100000);
    dbClient.close();
});

test('Register and update multiple file parse events and retrieve it', () => {
    const playerId1 = '443';
    const playerId2 = '444';
    const fooddiary = 'foodDiary.xlsx';
    const abbott = 'abbott.csv';
    const timeStamp_player1 = 1000000000000;
    const timeStamp_player2 = 1100000000000;

    let dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId1, fooddiary, timeStamp_player1)).toBeTruthy();
    expect(dbClient.registerFileParse(playerId1, abbott, timeStamp_player1)).toBeTruthy();
    dbClient.close();

    dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId2, fooddiary, timeStamp_player2)).toBeTruthy();
    expect(dbClient.registerFileParse(playerId2, abbott, timeStamp_player2)).toBeTruthy();
    dbClient.close();

    dbClient = new DBClient();
    expect(dbClient.registerFileParse(playerId1, abbott, timeStamp_player1 + 100000)).toBeTruthy();
    expect(
        dbClient.registerFileParse(playerId2, fooddiary, timeStamp_player2 + 100000)
    ).toBeTruthy();
    dbClient.close();

    dbClient = new DBClient();
    expect(dbClient.getLastUpdate(playerId1, fooddiary)).toStrictEqual(timeStamp_player1);
    expect(dbClient.getLastUpdate(playerId1, abbott)).toStrictEqual(timeStamp_player1 + 100000);
    expect(dbClient.getLastUpdate(playerId2, fooddiary)).toStrictEqual(timeStamp_player2 + 100000);
    expect(dbClient.getLastUpdate(playerId2, abbott)).toStrictEqual(timeStamp_player2);

    dbClient.close();
});

test('Retrieve non existing parse event', () => {
    const playerId = '-1';
    const fileName = 'nonsense.xlsx';
    const dbClient = new DBClient();
    expect(dbClient.getLastUpdate(playerId, fileName)).toStrictEqual(0);
    dbClient.close();
});

test('Execute methods while database does not exist', () => {
    try {
        fs.unlinkSync(process.env.DATABASE!); // Remove db file
    } catch (error) {
        return;
    }
    const dbClient = new DBClient(true); // with logging to see errors
    expect(dbClient.cleanFileParseEvents()).toBeUndefined();
    expect(dbClient.registerFileParse('1', 'file.xlsx', 1000000000000)).toBeFalsy();
    expect(dbClient.getLastUpdate('1', 'file.xlsx')).toStrictEqual(0);
    expect(dbClient.cleanLoginAttempts()).toBeFalsy();
    expect(dbClient.getLoginAttemptByLoginToken('token')).toBeUndefined();
    expect(dbClient.getLoginAttemptByPlayerId('id')).toBeUndefined();
    expect(dbClient.registerCallback('id', 't1', 't2')).toBeFalsy();
    expect(dbClient.registerLoginAttempt('id', 't1', new Date())).toBeFalsy();
    expect(dbClient.removeFinishedLoginAttempt('id')).toBeFalsy();
});
