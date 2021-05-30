import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { mockGameBusRequest } from './gbUtils';

jest.mock('axios');

// TODO: improve coverage

describe('with mocked activities get call', () => {
    // Request handler that simply returns empty data for every request
    const request = mockGameBusRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const client = new GameBusClient(new TokenHandler('testToken', 'refreshToken', '0'));

    test('GET activities on date', async () => {
        // Get activities from a date (as Date object)
        const activities = await client.activity().getActivitiesOnDate(0, new Date('2021-04-19'));

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&limit=30&page=1&sort=-date',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(activities).toEqual([]);
    });

    test('GET activities between dates', async () => {
        // Get activities between dates (as Date objects)
        const activities = await client
            .activity()
            .getAllAcitivitiesBetweenDate(0, new Date('2021-04-19'), new Date('2021-04-21'));

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&limit=30&page=1&sort=-date',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(activities).toEqual([]);
    });

    test('GET activities on Unix date', async () => {
        // Get activity from (13-digit) unix timestamp
        const unixTimestamp = new Date('2021-04-19').getTime();
        const activities = await client.activity().getActivitiesOnUnixDate(0, unixTimestamp);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&limit=30&page=1&sort=-date',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(activities).toEqual([]);
    });

    test('GET activities between Unix dates', async () => {
        // Get activities between (13-digit) unix timestamps
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const activities = await client
            .activity()
            .getAllActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&limit=30&page=1&sort=-date',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(activities).toEqual([]);
    });
});
