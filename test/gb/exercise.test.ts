import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseGameDescriptorNames } from '../../src/gb/objects/exercise';
import { mockGameBusRequest } from './gbUtils';

jest.mock('axios');

describe('with mocked exercises get call', () => {
    // Request handler that simply returns empty data for every request
    const request = mockGameBusRequest(() => {
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
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGd(0, [ExerciseGameDescriptorNames.WALK]);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET activities from type between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGdBetweenUnix(
                0,
                [ExerciseGameDescriptorNames.WALK],
                unixTimestampBefore,
                unixTimestampAfter
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&limit=30&page=1&sort=-date&gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET activities from type on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGdOnUnixDate(
                0,
                [ExerciseGameDescriptorNames.WALK],
                unixTimestamp
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&limit=30&page=1&sort=-date&gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
    });
});
