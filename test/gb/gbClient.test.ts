import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient, RequestMethod } from '../../src/gb/gbClient';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('GameBusClient requests', () => {
    // Request handler that simply returns empty data for every request
    const request = mockRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    const client = new GameBusClient(new TokenHandler('testToken', 'refreshToken', '0'));
    const unauthorizedClient = new GameBusClient();
    const unauthorizedClientWithToken = new GameBusClient(new TokenHandler('', '', ''));

    /**
     * UTP: GBC - 1
     */
    test('full response', async () => {
        const response = await client.request(
            '',
            RequestMethod.GET,
            undefined,
            undefined,
            undefined,
            false,
            true
        );
        // Full response means data is given separately
        expect(response).toStrictEqual({
            data: []
        });
    });

    /**
     * UTP: GBC - 2
     */
    test('PUT request', async () => {
        const response = await client.put(
            'players/0/activities',
            undefined,
            undefined,
            undefined,
            false,
            false
        );

        expect(response).toStrictEqual([]);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities`
            })
        );
    });

    /**
     * UTP: GBC - 3
     */
    test('POST request', async () => {
        const response = await client.post(
            'players/0/activities',
            undefined,
            undefined,
            undefined,
            false,
            false
        );

        expect(response).toStrictEqual([]);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities`
            })
        );
    });

    /**
     * UTP: GBC - 4
     */
    test('GET request', async () => {
        const response = await client.get(
            'players/0/activities',
            undefined,
            undefined,
            false,
            false
        );

        expect(response).toStrictEqual([]);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities`
            })
        );
    });

    /**
     * UTP: GBC - 5
     */
    test('Unauthorized request without TokenHandler', async () => {
        expect(async () => {
            await unauthorizedClient.request(
                '',
                RequestMethod.GET,
                undefined,
                undefined,
                undefined,
                true
            );
        }).rejects.toThrow(
            'You must be authorized to access this path: https://api3.gamebus.eu/v2/'
        );
    });

    /**
     * UTP: GBC - 6
     */
    test('Unauthorized request with empty TokenHandler', async () => {
        expect(async () => {
            await unauthorizedClientWithToken.request(
                '',
                RequestMethod.GET,
                undefined,
                undefined,
                undefined,
                true
            );
        }).rejects.toThrow(
            'You must be authorized to access this path: https://api3.gamebus.eu/v2/'
        );
    });
});

describe('GameBusClient helper functions', () => {
    const client = new GameBusClient();

    /**
     * UTP: GBC - 7
     */
    test('unauthorized header creation', () => {
        expect(() => {
            client.createHeader(true);
        }).toThrow('You must be authenticated to use this function');
    });

    /**
     * UTP: GBC - 8
     */
    test('URL without query', () => {
        expect(client.createURL('players')).toBe(`${endpoint}/players`);
    });

    /**
     * UTP: GBC - 9
     */
    test('URL with query', () => {
        expect(
            client.createURL('players', {
                query1: 'value1',
                query2: 'value2'
            })
        ).toBe(`${endpoint}/players?query1=value1&query2=value2`);
    });
});
