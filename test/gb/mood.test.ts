import { TokenHandler } from "../../src/gb/auth/tokenHandler";
import { GameBusClient } from "../../src/gb/gbClient";
import { MoodGameDescriptorNames } from "../../src/gb/objects/mood";
import { mockRequest } from "../testUtils/requestUtils";

jest.mock('axios');

describe('with mocked moods get call', () => {
    // Request handler that simply returns empty data for every request
    const request = mockRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '0'));

    test('GET activities from type', async () => {
        const moods = await client
            .mood()
            .getMoodActivityFromGd(0, [MoodGameDescriptorNames.logMood]);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?gds=LOG_MOOD'
            })
        );
        expect(moods).toEqual([]);
    });

    test('GET activities from type between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const moods = await client
            .mood()
            .getMoodFromGdBetweenUnix(
                0,
                [MoodGameDescriptorNames.logMood],
                unixTimestampBefore,
                unixTimestampAfter
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&sort=-date&gds=LOG_MOOD'
            })
        );
        expect(moods).toEqual([]);
    });

    test('GET activities from type on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const moods = await client
            .mood()
            .getMoodActivityFromGdOnUnixDate(
                0,
                [MoodGameDescriptorNames.logMood],
                unixTimestamp
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&sort=-date&gds=LOG_MOOD'
            })
        );
        expect(moods).toEqual([]);
    });
});