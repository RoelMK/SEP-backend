import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { GameBusUser } from '../../src/gb/models/gamebusModel';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('with mocked user get call', () => {
    const request = mockRequest(() => {
        // Normal response from /users/current
        return Promise.resolve({
            data: {
                id: 0,
                email: 'e@mail.com',
                firstName: 'Jane',
                lastName: 'Doe',
                image: null,
                registrationDate: 1623747025000,
                isActivated: true,
                language: 'en',
                player: {
                    id: 0
                },
                notifications: []
            }
        });
    });

    beforeEach(() => request.mockClear());

    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '0'));

    /**
     * UTP: GB - 46
     */
    test('GET current user', async () => {
        const user = await client.user().getCurrentUser();
        const expectedResult: GameBusUser = {
            id: 0,
            email: 'e@mail.com',
            firstName: 'Jane',
            lastName: 'Doe',
            image: null,
            registrationDate: 1623747025000,
            isActivated: true,
            language: 'en',
            player: {
                id: 0
            },
            notifications: []
        };

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/users/current`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(user).toStrictEqual(expectedResult);
    });

    /**
     * UTP: GB - 47
     */
    test('Disconnect data provider', async () => {
        const playerId = 1;
        const dataProviderID = 1;
        await client.user().disconnectDataProvider(playerId, dataProviderID);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/1/data-providers/1`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
    });

    /**
     * UTP: GB - 48
     */
    test('Connect data provider', async () => {
        const playerId = 1;
        const dataProviderID = 1;
        await client.user().connectDataProvider(playerId, dataProviderID);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/1/data-providers/1`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
    });
});
