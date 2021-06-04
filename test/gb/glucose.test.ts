import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { GlucosePropertyKeys } from '../../src/gb/objects/glucose';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked glucose get call', () => {
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
        const glucose = await client.glucose().getAllGlucoseActivities();

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
        expect(glucose).toEqual(undefined);
    });

    test('POST a single activity', async () => {
        let model : GlucoseModel = {
            timestamp : 12,
            glucoseLevel: 34,
        }
        let POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.glucose().glucoseGameDescriptor,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: "",
            propertyInstances: expect.arrayContaining([{
                propertyTK: GlucosePropertyKeys.glucoseLevel,
                value: 34
            }]),
            players : [90]
        }
        
        client.glucose().postSingleGlucoseActivity(model,90,undefined,undefined);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/me/activities?dryrun=false',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                }),
                data: POSTData
            })
        );
    });
});
