import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { FoodModel, MEAL_TYPE } from '../../src/gb/models/foodModel';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { FoodPropertyKeys } from '../../src/gb/objects/food';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked food get call', () => {
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
        const food = await client.food().getAllFoodActivities();

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
        expect(food).toEqual(undefined);
    });

    test('POST a single activity', async () => {
        const model : FoodModel = {
            timestamp : 12,
            carbohydrates : 34,
            fibers: 56,
            meal_type: MEAL_TYPE.BREAKFAST
        }
        const POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.food().foodGameDescriptor,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: "",
            propertyInstances: expect.arrayContaining([{
                propertyTK: FoodPropertyKeys.carbohydrates,
                value : 34
            },{
                propertyTK: FoodPropertyKeys.meal_type,
                value: 'Breakfast'
            },{
                propertyTK: FoodPropertyKeys.fibers,
                value: 56
            }]),
            players : [90]
        }
        
        client.food().postSingleFoodActivity(model,90,undefined,undefined);

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
