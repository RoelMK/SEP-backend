import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData, IDActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { MoodModel } from '../../src/gb/models/moodModel';
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

    test('POST a multiple activities', async () => {
        const model1 : MoodModel = {
            timestamp: 1,
            arousal: 2,
            valence: 3
        }
        const model2 : MoodModel = {
            timestamp: 11,
            arousal: 12,
            valence: 13
        }
        const POSTData1 : IDActivityPOSTData= {
            gameDescriptor: client.mood().moodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 1,
            image: "",
            propertyInstances: expect.arrayContaining([{
                property: 1186,
                value : 2
            },{
                property: 1187,
                value : 3
            }]),
            players : [0]
        }
        const POSTData2 : IDActivityPOSTData= {
            gameDescriptor: client.mood().moodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 11,
            image: "",
            propertyInstances: expect.arrayContaining([{
                property: 1186,
                value : 12
            },{
                property: 1187,
                value : 13
            }]),
            players : [0]
        }
        
        client.mood().postMultipleMoodActivities([model1,model2],0,undefined,undefined);
  
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api3.gamebus.eu/v2/me/activities?dryrun=false&bulk=true',
                headers: expect.objectContaining({
                    Authorization: 'Bearer testToken'
                }),
                data: [POSTData1,POSTData2]
            })
        );
    });
});
