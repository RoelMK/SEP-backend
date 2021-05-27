import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { mockGameBusRequest } from './gbUtils';
import { Circle } from '../../src/gb/objects/circle';

jest.mock('axios');

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

    test('GET circle ids for a player', async () => {
        // Get activities from a date (as Date object)
        const circles = await client.circle().getAllCircles(0);
        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/players/0/circles',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(circles).toEqual([]);
    });


    test('GET circle ids for a player', async () => {
        // Get activities from a date (as Date object)
        const circles = await client.circle().getCircleById(0);
        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/circles/0',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                })
            })
        );
        expect(circles).toEqual([]);
    });
});

test('array of player IDs in a circle', async () => {
    const expectedResult: number[] = [] ;
    const handler = new TokenHandler('testToken', 'refreshToken', '0')
    const gamebus = new GameBusClient(handler, true);
    const circ = new Circle(gamebus, true);
    expect(
     await circ.getPlayersForAGivenCircle(100800) as number[]
    ).toEqual(expectedResult);
});

test('circles where the player is a Leader and the circle names have Diabetter in it', async () => {
    const expectedResult: number[] = [] ;
    const handler = new TokenHandler('testToken', 'refreshToken', '0')
    const gamebus = new GameBusClient(handler, true);
    const circ = new Circle(gamebus, true);
    expect(
     await circ.getAllCirclesLeaderDiabetter(0)
    ).toEqual(expectedResult);
});
