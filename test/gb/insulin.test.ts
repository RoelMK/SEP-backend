import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { InsulinPropertyKeys } from '../../src/gb/objects/insulin';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked insulin get call', () => {
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
        const insulin = await client.insulin().getAllInsulinActivities();

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
        expect(insulin).toEqual(undefined);
    });

    test('POST a single activity', async () => {
        const model : InsulinModel = {
            timestamp : 12,
            insulinAmount: 34,
            insulinType: InsulinType.RAPID
        }
        const POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.insulin().insulinGameDescriptor,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: "",
            propertyInstances: expect.arrayContaining([{
                propertyTK: InsulinPropertyKeys.insulinAmount,
                value : 34
            },{
                propertyTK: InsulinPropertyKeys.insulinType,
                value: 'rapid'
            }]),
            players : [90]
        }
        
        client.insulin().postSingleInsulinActivity(model,90,undefined,undefined);

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
