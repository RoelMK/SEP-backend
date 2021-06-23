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
    /**
     * UTP: SERV - 1
     */
    test('/', async () => {
        const response = await request(server).get('/');
        expect(response.text).toBe('Hello World!');
    });

    /**
     * UTP: SERV - 2
     */
    test('/test', async () => {
        const response = await request(server).get('/test');
        expect(response.text).toBe('Hi, this was a success!');
    });

    /**
     * UTP: SERV - 3
     */
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
