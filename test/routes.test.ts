import request from 'supertest';
import { InsulinModel } from '../src/gb/models/insulinModel';
import { MoodModel } from '../src/gb/models/moodModel';
import { server } from '../src/server';

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

    // TODO: not sure how to test the '/jwt-test' endpoint

    test('/clean', async () => {
        const response = await request(server).get('/clean');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET data', () => {
    test('no authorization header given', async () => {
        const response = await request(server).get('/data');
        expect(response.statusCode).toBe(401);
    });

    test('no query parameters given', async () => {
        const response = await request(server)
            .get('/data')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI'
            );
        expect(response.statusCode).toBe(400);
    });

    test('only start date given', async () => {
        const response = await request(server)
            .get('/data?startDate=8-6-2021&dataTypes=GLUCOSE')
            .set(
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjUyNyIsImFjY2Vzc1Rva2VuIjoiMjIyMiIsInJlZnJlc2hUb2tlbiI6IjMzMzMiLCJpYXQiOjE2MjEzNDU2ODksImV4cCI6MTYyMzkzNzY4OSwiaXNzIjoiaHR0cHM6Ly90dWUubmwifQ.guv6n1M21Y6dQnt5-Re2vAoRnboyuxLim2t1dYqF8mI'
            );
        expect(response.statusCode).toBe(401);
    });
});

describe('GET files', () => {
    test('GET Abbott file', async () => {
        const response = await request(server).get('/upload-abbott');
        expect(response.statusCode).toBe(200);
        // TODO: more?
    });

    test('GET FoodDiary file', async () => {
        const response = await request(server).get('/upload-fooddiary');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST files', () => {
    // TODO: not sure how to post an entire file
    test('POST Abbott file', async () => {
        // const response = await request(server).post('/upload-abbott');
        // expect(response.statusCode).toBe(201);
    });

    test('POST FoodDiary file', async () => {
        // const response = await request(server).post('/upload-fooddiary');
        // expect(response.statusCode).toBe(201);
    });
});

describe('mood endpoint', () => {
    test('POST mood data', async () => {
        const moodData: MoodModel = {
            timestamp: 0,
            arousal: 1,
            valence: 1
        };
        // TODO: route not working
        const response = await request(server).post('/mood').send(moodData);
        expect(response.statusCode).toBe(404);
    });
});

describe('insulin endpoint', () => {
    test('PUT insulin data', async () => {
        const insulin: InsulinModel = {
            timestamp: 0,
            insulinAmount: 1,
            insulinType: 0,
            activityId: 1
        };
        // TODO: no idea how to test without authentication
        const response = await request(server).post('/insulin').send(insulin);
        expect(response.statusCode).toBe(404);
    });
});

// TODO: add tests for OneDrive routes
// TODO: add tests for Auth routes
// TODO: add tests for endpoint routes
