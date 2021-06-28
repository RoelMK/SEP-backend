import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { Circle } from '../../src/gb/objects/circle';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked activities get call', () => {
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

    /**
     * UTP: CLCR - 3
     */
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

    /**
     * UTP: CLCR - 4
     */
    test('GET circle by id for a player', async () => {
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

/**
 * UTP: CLCR - 5
 */
test('circles where the player is a Leader and the circle names have Diabetter in it', async () => {
    const expectedResult: number[] = [];
    const handler = new TokenHandler('testToken', 'refreshToken', '0');
    const gamebus = new GameBusClient(handler);
    const circ = new Circle(gamebus, true);
    expect(await circ.getAllCirclesLeaderDiabetter(0)).toEqual(expectedResult);
});

/**
 * UTP: CLCR - 6
 */
test('array of player IDs in a circle', async () => {
    const expectedResult: number[] = [];
    const handler = new TokenHandler('testToken', 'refreshToken', '0');
    const gamebus = new GameBusClient(handler);
    const circ = new Circle(gamebus, true);
    expect((await circ.getPlayersForAGivenCircle(100800)) as number[]).toEqual(expectedResult);
});
