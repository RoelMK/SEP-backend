import request from 'supertest';
import { InsulinModel } from '../src/gb/models/insulinModel';
import { MoodModel } from '../src/gb/models/moodModel';
import { server } from '../src/server';

jest.mock('axios');

// Everything is currently in 1 file since server.close() can only happen once
afterAll((done) => {
    // Server must be closed so Jest can finish
    server.close();
    done();
});

// These tests are solely to get familiar with supertest, not for actual test coverage
describe('test routes from test.ts', () => {
    test('/', async () => {
        const response = await request(server).get('/');
        expect(response.text).toBe('Hello World!');
    });

    test('/test', async () => {
        const response = await request(server).get('/test');
        expect(response.text).toBe('Hi, this was a success!');
    });

    test('/clean', async () => {
        const response = await request(server).get('/clean');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET data', () => {
    /**
     * UTP: DEP - 1
     */
    test('no authorization header given', async () => {
        const response = await request(server).get('/data');
        expect(response.statusCode).toBe(401);
    });

    /**
     * UTP: DEP - 2
     */
    test('no query parameters given', async () => {
        const response = await request(server).get('/data').set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );
        expect(response.statusCode).toBe(400);
    });
});
describe('mood endpoint', () => {
    /**
     * UTP: MEP - 1
     */
    test('POST mood data', async () => {
        const moodData: MoodModel = {
            timestamp: 0,
            arousal: 1,
            valence: 1
        };
        const response = await request(server).post('/mood').send(moodData);
        expect(response.statusCode).toBe(401);
    });

    /**
     * UTP: MEP - 2
     */
    test('PUT mood data', async () => {
        const moodData: MoodModel = {
            timestamp: 0,
            arousal: 1,
            valence: 1,
            activityId: 1
        };
        const response = await request(server).post('/mood?modify=true').send(moodData);
        expect(response.statusCode).toBe(401);
    });
});

describe('insulin endpoint', () => {
    /**
     * UTP: IEP - 1
     */
    test('PUT insulin data', async () => {
        const insulin: InsulinModel = {
            timestamp: 0,
            insulinAmount: 1,
            insulinType: 0,
            activityId: 1
        };
        const response = await request(server).post('/insulin').send(insulin);
        expect(response.statusCode).toBe(401);
    });
});

/**
 * SUPERVISOR TEST CASES -------------------------------------------------------------------------------------------------------
 */
// test('logToken without token and email', async () => {
//     const response = await request(server).post('/supervisor/logToken').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('request without emails', async () => {
//     const response = await request(server).post('/supervisor/request').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('getting token without emails', async () => {
//     const response = await request(server).post('/supervisor/getToken').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('getting supervisors without normal user email', async () => {
//     const response = await request(server).post('/supervisor/getSupervisors').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('getting approved supervisors without normal user email', async () => {
//     const response = await request(server).post('/supervisor/getApproved').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('getting normal users without supervisor email', async () => {
//     const response = await request(server).post('/supervisor/getChildren').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('retracting permission emails', async () => {
//     const response = await request(server).post('/supervisor/retractPermission').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

// test('getting role without email', async () => {
//     const response = await request(server).post('/supervisor/role').set(
//         // This token has an expiry date of 20/11/2286, so this test will work until then
//         'Authorization',
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
//     );
//     expect(response.statusCode).toBe(400);
// });

/**
 * File upload tests ------------------------------------------------------------------------------------------
 */
/**
 * UTP: FILEP - 1
 */
test('POST no format', async () => {
    const response = await request(server)
        .post('/upload')
        .attach('file', 'test/services/data/eetmeter.xml')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );

    expect(response.statusCode).toBe(400);
});

/**
 * UTP: FILEP - 2
 */
test('POST unsupported format', async () => {
    const response = await request(server)
        .post('/upload')
        .field('format', 'story')
        .attach('file', 'test/services/data/eetmeter.xml')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );

    expect(response.statusCode).toBe(400);
});

/**
 * UTP: FILEP - 3
 */
test('POST supported format, with unsupported file extension', async () => {
    const response = await request(server)
        .post('/upload')
        .field('format', 'fooddiary')
        .attach('file', 'test/services/data/text.txt')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: FILEP - 4
 */
test('POST supported format abbott, with supported file extension but wrong file content', async () => {
    const response = await request(server)
        .post('/upload')
        .field('format', 'abbott')
        .attach('file', 'test/services/data/eetmeter.xml')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: FILEP - 5
 */
test('POST supported format fooddiary, with supported file extension but wrong file content', async () => {
    const response = await request(server)
        .post('/upload')
        .field('format', 'fooddiary')
        .attach('file', 'test/services/data/eetmeter.xml')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );
    expect(response.statusCode).toBe(400);
});

/**
 * Auth endpoint tests ------------------------------------------------------------------------------------------
 */

/**
 * UTP: TODO
 */
test('No email specified', async () => {
    const response = await request(server).get('/login').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: TODO
 */
test('No login token specified', async () => {
    const response = await request(server).get('/login').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: TODO
 */
test('Register callback with unspecified user information', async () => {
    const response = await request(server).post('/gamebus/callback').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: TODO
 */
test('Register callback without login attempt', async () => {
    const response = await request(server)
        .post('/gamebus/callback?player_id=1&access_token=123&refresh_token=456')
        .field('player_id', '1')
        .field('access_token', '123')
        .field('refresh_token', '456')
        .set(
            // This token has an expiry date of 20/11/2286, so this test will work until then
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
        );
    // because GameBus is needed for proper login sequnce, we can only test if the
    // expected error is thrown
    expect(response.statusCode).toBe(403);
});

/**
 * Activity endpoint tests ------------------------------------------------------------------------------------------
 */

/**
 * UTP: TODO
 */
test('Deleting activity without ID', async () => {
    const response = await request(server).post('/activities/delete').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    // because GameBus is needed for proper login sequnce, we can only test if the
    // expected error is thrown
    expect(response.statusCode).toBe(400);
});

/**
 * Insulin endpoint tests ------------------------------------------------------------------------------------------
 */

/**
 * UTP: TODO
 */
test('Posting insulin without parameters', async () => {
    const response = await request(server).post('/insulin').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    // because GameBus is needed for proper login sequnce, we can only test if the
    // expected error is thrown
    expect(response.statusCode).toBe(400);
});

/**
 * UTP: TODO
 */
test('Putting insulin without parameters', async () => {
    const response = await request(server).post('/insulin').field('activityId', '1').set(
        // This token has an expiry date of 20/11/2286, so this test will work until then
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
    );
    // because GameBus is needed for proper login sequnce, we can only test if the
    // expected error is thrown
    expect(response.statusCode).toBe(400);
});
/**
 * Mood endpoint tests ------------------------------------------------------------------------------------------
 */
//TODO

/**
 * Nightscout endpoint tests ------------------------------------------------------------------------------------------
 */
//TODO

/**
 * OneDrive endpoint tests ------------------------------------------------------------------------------------------
 */
//TODO

/**
 * Profile endpoint tests ------------------------------------------------------------------------------------------
 */
//TODO
