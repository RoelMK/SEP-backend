import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ChallengePOSTData } from '../../src/gb/models/gamebusModel';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');
const endpoint: string = process.env.ENDPOINT!;

describe('with mocked challenge post call', () => {
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

    test('POST a challenge', async () => {
        const challenge: ChallengePOSTData = {
            name: 'challenge name test',
            description: null,
            image: null,
            websiteURL: 'https://www.google.com/',
            minCircleSize: 1,
            maxCircleSize: 1,
            availableDate: '2021-06-06T00:00:00.000+02:00',
            startDate: '2021-06-07T13:00:00.000+02:00',
            endDate: '2021-07-05T23:59:59.999+02:00',
            rewardDescription: null,
            rewardInfo: null,
            target: 0,
            contenders: 1,
            withNudging: false,
            rules: [
                {
                    id: null,
                    name: 'rule 1',
                    image: null,
                    imageRequired: false,
                    gameDescriptors: [1, 2, 3, 4, 5],
                    maxTimesFired: 1,
                    minDaysBetweenFire: 0,
                    conditions: [
                        {
                            property: 1,
                            operator: 'STRICTLY_GREATER',
                            value: '1'
                        }
                    ],
                    points: []
                }
            ],
            circles: [0]
        };

        const response = await client.challenge().postChallenge(challenge);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/challenges?dryrun=false`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(response).toEqual([]);
    });

    test('POST request join circles to a challenge', async () => {
        const response = await client.challenge().postCircleMembership(0, 1, 0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/challenges/0/participants?circles=0,1`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(response).toEqual([]);
    });
});
