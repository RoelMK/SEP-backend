import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { MoodModel } from '../../src/gb/models/moodModel';
import { InsulinPropertyKeys } from '../../src/gb/objects/insulin';
import { MoodPropertyKeys } from '../../src/gb/objects/mood';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked mood get call', () => {
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

    test('POST a single activity', async () => {
        const model : MoodModel = {
            timestamp : 12,
            valence: 34,
            arousal: 56
        }
        const POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.mood().moodGameDescriptor,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: "",
            propertyInstances: expect.arrayContaining([{
                propertyTK: MoodPropertyKeys.valence,
                value : 34
            },{
                propertyTK: MoodPropertyKeys.arousal,
                value: 56
            }]),
            players : [90]
        }
        
        client.mood().postSingleMoodActivity(model,90,undefined,undefined);

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
