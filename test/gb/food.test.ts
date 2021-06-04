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
            data: [
                {
                  id: 27130,
                  date: 1622832265000,
                  isManual: false,
                  group: null,
                  image: null,
                  creator: {
                    id: 524,
                    user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
                  },
                  player: {
                    id: 524,
                    user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
                  },
                  gameDescriptor: {
                    id: 58,
                    translationKey: 'Nutrition_Diary',
                    image: 'https://api3.gamebus.eu/v2/uploads/public/MTU1NDIxODc0MjkwOUJ2ZWlXZFJv.jpeg',
                    type: 'PHYSICAL',
                    isAggregate: false
                  },
                  dataProvider: {
                    id: 18,
                    name: 'Daily_run',
                    image: 'https://api3.gamebus.eu/v2/uploads/public/MTYxOTI2MjY3ODQ3MVFQa0UwcHJt.jpg',
                    isConnected: false
                  },
                  propertyInstances: [
                    {
                      id: 69401,
                      value: '400',
                      property: {
                        id: 1176,
                        translationKey: 'FOOD_CARBOHYDRATES_GRAMS',
                        baseUnit: 'grams',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                          {
                            id: 1344,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1353,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    },
                    {
                      id: 69402,
                      value: '34',
                      property: {
                        id: 79,
                        translationKey: 'FIBERS_WEIGHT',
                        baseUnit: 'grams',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                          {
                            id: 577,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 586,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1360,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    },
                    {
                      id: 69403,
                      value: 'desc',
                      property: {
                        id: 12,
                        translationKey: 'DESCRIPTION',
                        baseUnit: 'String text',
                        inputType: 'STRING',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: [
                          {
                            id: 74,
                            index: 1,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 77,
                            index: 1,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 451,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 455,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 461,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 637,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 638,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1184,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1189,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1364,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    }
                  ],
                  personalPoints: [],
                  supports: [],
                  chats: []
                },
                {
                  id: 27131,
                  date: 1622832285000,
                  isManual: false,
                  group: null,
                  image: null,
                  creator: {
                    id: 524,
                    user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
                  },
                  player: {
                    id: 524,
                    user: { id: 516, firstName: 'kevin', lastName: 'dirksen', image: null }
                  },
                  gameDescriptor: {
                    id: 58,
                    translationKey: 'Nutrition_Diary',
                    image: 'https://api3.gamebus.eu/v2/uploads/public/MTU1NDIxODc0MjkwOUJ2ZWlXZFJv.jpeg',
                    type: 'PHYSICAL',
                    isAggregate: false
                  },
                  dataProvider: {
                    id: 18,
                    name: 'Daily_run',
                    image: 'https://api3.gamebus.eu/v2/uploads/public/MTYxOTI2MjY3ODQ3MVFQa0UwcHJt.jpg',
                    isConnected: false
                  },
                  propertyInstances: [
                    {
                      id: 69404,
                      value: '400',
                      property: {
                        id: 1176,
                        translationKey: 'FOOD_CARBOHYDRATES_GRAMS',
                        baseUnit: 'grams',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                          {
                            id: 1344,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1353,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    },
                    {
                      id: 69405,
                      value: '34',
                      property: {
                        id: 79,
                        translationKey: 'FIBERS_WEIGHT',
                        baseUnit: 'grams',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                          {
                            id: 577,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 586,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1360,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    },
                    {
                      id: 69406,
                      value: 'desc',
                      property: {
                        id: 12,
                        translationKey: 'DESCRIPTION',
                        baseUnit: 'String text',
                        inputType: 'STRING',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: [
                          {
                            id: 74,
                            index: 1,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 77,
                            index: 1,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 451,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 455,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 461,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 637,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 638,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1184,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1189,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          },
                          {
                            id: 1364,
                            index: 0,
                            lastUpdate: null,
                            decisionNote: null,
                            state: 'PUBLIC_APPROVED',
                            allowedValues: []
                          }
                        ]
                      }
                    }
                  ],
                  personalPoints: [],
                  supports: [],
                  chats: []
                }
              ]
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const client = new GameBusClient(new TokenHandler('testToken', 'refreshToken', '0'));

    test('GET activities on date', async () => {
        // Get exercises from a date (as Date object)
        // TODO: implement this
        const food = await client.food().getAllFoodActivities(524);
        const result : FoodModel[] = [{
            timestamp : 1622832265000,
            carbohydrates : 400,
            fibers: 34,
            description: "desc"
        },{
            timestamp : 1622832285000,
            carbohydrates : 400,
            fibers: 34,
            description: "desc"
        }]

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer testToken`
                })
            })
        );
        //expect(exercises).toEqual([]);
        expect(food).toEqual(result);
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
