import request from 'supertest';
import { server } from '../src/server';

jest.mock('axios');

// Everything is currently in 1 file since server.close() can only happen once
afterAll((done) => {
    // Server must be closed so Jest can finish
    server.close();
    done();
});
describe('POST files', () => {
    /**
     * UTP: TODO
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
     * UTP: TODO
     */
    test('POST unsupported format', async () => {
        const response = await request(server)
            .post('/upload?format=story')
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
     * UTP: TODO
     */
    test('POST supported format, with unsupported file extension', async () => {
        const response = await request(server)
            .post('/upload?format=fooddiary')
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
     * UTP: TODO
     */
    test('POST supported format, with supported file extension but wrong file content', async () => {
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
     * UTP: TODO
     */
    test('POST fooddiary', async () => {
        const response = await request(server)
            .post('/upload')
            .field('format', 'fooddiary')
            .attach('file', 'test/services/data/foodDiary_standard_missing_table.xlsx')
            .set(
                // This token has an expiry date of 20/11/2286, so this test will work until then
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
            );
        console.log(response.error);
        expect(response.statusCode).toBe(200);
    });

    test('POST abbott', async () => {
        const response = await request(server)
            .post('/upload')
            .field('format', 'abbott')
            .attach('file', 'test/services/data/abbott_EU.csv')
            .set(
                // This token has an expiry date of 20/11/2286, so this test will work until then
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
            );
        expect(response.statusCode).toBe(200);
    });
    test('POST eetmeter', async () => {
        const response = await request(server)
            .post('/upload')
            .field('format', 'eetmeter')
            .attach('file', 'test/services/data/eetmeter.xml')
            .set(
                // This token has an expiry date of 20/11/2286, so this test will work until then
                'Authorization',
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAiLCJhY2Nlc3NUb2tlbiI6IjIyMjIiLCJyZWZyZXNoVG9rZW4iOiIzMzMzIiwiaWF0IjoxNjIxMzQ1Njg5LCJleHAiOjk5OTk5OTk5OTksImlzcyI6Imh0dHBzOi8vdHVlLm5sIn0.K1-b9_gMWGhlBW4oJobu3zCKGVBQt56GQNwDnR2qe38'
            );
        console.log(response.error);
        expect(response.statusCode).toBe(200);
    });
});
