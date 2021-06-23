import { DBClient } from '../../src/db/dbClient';
import fs from 'fs';
import {
    logToken,
    request,
    getSupervisors,
    getToken,
    getApproved,
    getChildren,
    checkSupervisor,
    retractPermission
} from '../../src/utils/supervisorUtils';

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
 * Purpose: Check full supervisor functionality.
 * UTP: AUTH - 6
 */
test('check full supervisor functionality', async () => {
    const childEmail = 'child@gmail.com';
    const supervisorEmail = 'supervisor@gmail.com';

    expect(await logToken(childEmail, '1')).toBeTruthy();
    expect(await logToken(supervisorEmail, '2')).toBeTruthy();
    expect(await request(supervisorEmail, childEmail)).toBeTruthy();
    expect(await getSupervisors(childEmail)).toEqual([
        {
            supervisor_email: 'supervisor@gmail.com'
        }
    ]);
    expect(await request(supervisorEmail, childEmail, true)).toBeTruthy();
    expect(await getToken(childEmail, supervisorEmail)).toEqual({
        confirmed: 1,
        player_email: 'child@gmail.com',
        player_token: '1',
        supervisor_email: 'supervisor@gmail.com'
    });
    expect(await getApproved(childEmail)).toEqual([
        {
            supervisor_email: 'supervisor@gmail.com'
        }
    ]);
    expect(await getChildren(supervisorEmail)).toEqual([
        {
            player_email: 'child@gmail.com'
        }
    ]);
    expect(await checkSupervisor(supervisorEmail)).toBeTruthy();
    expect(await retractPermission(childEmail, supervisorEmail)).toBeTruthy();
    expect(await checkSupervisor(supervisorEmail)).toBeFalsy();
});
