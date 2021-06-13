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

    // TODO: not sure how to test the '/jwt-test' endpoint
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
        const response = await request(server)
            .get('/data')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI'
            );
        expect(response.statusCode).toBe(400);
    });
});

/**
 * UTP: FILEP 1 & 2
 */
/** //TODO it just throws 401 errors, quite useless
describe('POST files', () => {
    //TODO just expect 401? or how to do this?
    test('POST Abbott file', async () => {
        const response = await request(server)
            .post('/upload?format=abbott')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/abbott_eu.csv');
        expect(response.statusCode).toBe(401);
    });

    test('POST FoodDiary file', async () => {
        const response = await request(server)
            .post('/upload?format=fooddiary')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/foodDiary_standard_missing_table.xlsx');
        expect(response.statusCode).toBe(401);
    });

    test('POST Eetmeter file', async () => {
        const response = await request(server)
            .post('/upload?format=eetmeter')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/eetmeter.xml');
        expect(response.statusCode).toBe(401);
    });

    test('POST unsupported format', async () => {
        const response = await request(server)
            .post('/upload?format=story')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/eetmeter.xml');
        expect(response.statusCode).toBe(401);
    });

    test('POST supported format, with unsupported file extension', async () => {
        const response = await request(server)
            .post('/upload?format=fooddiary')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/text.txt');
        expect(response.statusCode).toBe(401);
    });

    test('POST supported format, with supported file extension but wrong file content', async () => {
        const response = await request(server)
            .post('/upload?format=fooddiary')
            .set('Authentication', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI')
            .attach('file', 'test/services/data/eetmeter.xml');
        expect(response.statusCode).toBe(401);
    });
}); */

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

// TODO: add tests for OneDrive routes
// TODO: add tests for Auth routes
// TODO: add tests for endpoint routes
