import { GameBusClient } from '../../src/gb/gbClient';
import { mockGameBusRequest } from './gbUtils';

jest.mock('axios');

describe('with mocked activities get call', () => {
    // Test token we'll be using
    const mockToken = 'mockedTestToken';
    // Request handler that simply returns empty data for every request
    const request = mockGameBusRequest((req) => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const client = new GameBusClient(false, mockToken);

    test('GET activities on date', async () => {
        const activities = await client.activity().getActivitiesOnDate(0, new Date('2021-04-19'));

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&limit=30&sort=-date',
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    test('GET activities between dates', async () => {
        const activities = await client
            .activity()
            .getAllAcitivitiesBetweenDate(0, new Date('2021-04-19'), new Date('2021-04-21'));

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&limit=30&sort=-date',
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    // test('GET activities on Unix date', async () => {
    //     const activities = await client.activity().getActivitiesOnUnixDate(0, new Date('2021-04-19').getTime());

    //     expect(request).toHaveBeenCalledTimes(1);
    //     expect(request).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&limit=30&sort=-date',
    //             headers: expect.objectContaining({
    //                 Authorization: `Bearer ${mockToken}`
    //             })
    //         })
    //     );
    //     expect(activities).toEqual([]);
    // });
});
