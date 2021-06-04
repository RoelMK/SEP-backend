import request from 'supertest';
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

describe('GET files', () => {

    //TODO remove these / redescribe, the gets are just for testing
    test('GET Abbott file', async () => {
        const response = await request(server).get('/upload/abbott');
        expect(response.statusCode).toBe(200);
        // TODO: more?
    });

    test('GET FoodDiary file', async () => {
        const response = await request(server).get('/upload/fooddiary');
        expect(response.statusCode).toBe(200);
    });

    test('GET Eetmeter file', async () => {
        const response = await request(server).get('/upload/eetmeter');
        expect(response.statusCode).toBe(200);
    });
});

describe('POST files', () => {
    // TODO: not sure how to post an entire file
    test('POST Abbott file', async () => {
        // const response = await request(server).post('/upload/abbott');
        // expect(response.statusCode).toBe(201);
    });

    test('POST FoodDiary file', async () => {
        // const response = await request(server).post('/upload/fooddiary');
        // expect(response.statusCode).toBe(201);
    });
});

describe('mood endpoint', () => {
    test('POST mood data', async () => {
        const moodData: MoodModel = {
            timestamp: 0,
            moodDescription: 'happy',
            moodValue: 1
        };
        // TODO: route not working
        const response = await request(server).post('/mood').send(moodData);
        expect(response.statusCode).toBe(404);
    });
});

// TODO: add tests for OneDrive routes
// TODO: add tests for Auth routes
// TODO: add tests for endpoint routes
