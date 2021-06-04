import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked food get call', () => {
    // Request handler that simply returns empty data for every request
    const request = mockRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const client = new GameBusClient(new TokenHandler('testToken', 'refreshToken', '0'));

    test('GET activities on date', async () => {
        // Get exercises from a date (as Date object)
        // TODO: implement this
        const food = await client.food().getAllFoodActivities();

        // Check that URL matches expected URL and mockToken is used in authorization
        // expect(request).toHaveBeenCalledTimes(1);
        // TODO: add URL
        // expect(request).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         headers: expect.objectContaining({
        //             Authorization: `Bearer ${mockToken}`
        //         })
        //     })
        // );
        //expect(exercises).toEqual([]);
        expect(food).toEqual(undefined);
    });
});
