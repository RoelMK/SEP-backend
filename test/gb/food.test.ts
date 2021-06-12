import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { FoodModel, MEAL_TYPE } from '../../src/gb/models/foodModel';
import { ActivityPOSTData, IDActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { FoodPropertyKeys } from '../../src/gb/objects/food';
import { mockRequest } from '../testUtils/requestUtils';
import { Keys } from '../../src/gb/objects/keys';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

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
                        id: 0,
                        user: { id: 0, firstName: 'First', lastName: 'Last', image: null }
                    },
                    player: {
                        id: 0,
                        user: { id: 0, firstName: 'First', lastName: 'Last', image: null }
                    },
                    gameDescriptor: {
                        id: 58,
                        translationKey: 'Nutrition_Diary',
                        image: '',
                        type: 'PHYSICAL',
                        isAggregate: false
                    },
                    dataProvider: {
                        id: 18,
                        name: 'Daily_run',
                        image: '',
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
                                propertyPermissions: []
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
                                propertyPermissions: []
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
                                propertyPermissions: []
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
                        id: 0,
                        user: { id: 0, firstName: 'First', lastName: 'Last', image: null }
                    },
                    player: {
                        id: 0,
                        user: { id: 0, firstName: 'First', lastName: 'Last', image: null }
                    },
                    gameDescriptor: {
                        id: 58,
                        translationKey: 'Nutrition_Diary',
                        image: '',
                        type: 'PHYSICAL',
                        isAggregate: false
                    },
                    dataProvider: {
                        id: 18,
                        name: 'Daily_run',
                        image: '',
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
                                propertyPermissions: []
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
                                propertyPermissions: []
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
                                propertyPermissions: []
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
    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '524'));

    test('GET all food activities', async () => {
        const food = await client.food().getAllFoodActivities(0);
        const result: FoodModel[] = [
            {
                timestamp: 1622832265000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27130,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            },
            {
                timestamp: 1622832285000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27131,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            }
        ];

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=Nutrition_Diary`
            })
        );
        expect(food).toEqual(result);
    });

    test('GET food activities between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const exercises = await client
            .food()
            .getFoodActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);
        const result: FoodModel[] = [
            {
                timestamp: 1622832265000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27130,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            },
            {
                timestamp: 1622832285000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27131,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            }
        ];
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=Nutrition_Diary&start=19-04-2021&end=21-04-2021&sort=-date`
            })
        );
        expect(exercises).toEqual(result);
    });

    test('GET food activities on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const food = await client.food().getFoodActivitiesOnUnixDate(0, unixTimestamp);
        const result: FoodModel[] = [
            {
                timestamp: 1622832265000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27130,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            },
            {
                timestamp: 1622832285000,
                carbohydrates: 400,
                fibers: 34,
                description: 'desc',
                activityId: 27131,
                calories: null,
                meal_type: null,
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                salt: null,
                water: null,
                sugars: null
            }
        ];
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=Nutrition_Diary&start=19-04-2021&end=20-04-2021&sort=-date`
            })
        );
        expect(food).toEqual(result);
    });

    test('POST a single activity', async () => {
        const model: FoodModel = {
            timestamp: 12,
            carbohydrates: 34,
            fibers: 56,
            meal_type: MEAL_TYPE.BREAKFAST
        };
        const POSTData: ActivityPOSTData = {
            gameDescriptorTK: Keys.foodTranslationKey,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    propertyTK: FoodPropertyKeys.carbohydrates,
                    value: 34
                },
                {
                    propertyTK: FoodPropertyKeys.meal_type,
                    value: 'Breakfast'
                },
                {
                    propertyTK: FoodPropertyKeys.fibers,
                    value: 56
                }
            ]),
            players: [0]
        };

        client.food().postSingleFoodActivity(model, 0, undefined, undefined);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/me/activities?dryrun=false`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                data: POSTData
            })
        );
    });

    test('POST a multiple activities', async () => {
        const model1: FoodModel = {
            timestamp: 1,
            carbohydrates: 2,
            calories: 3,
            meal_type: MEAL_TYPE.BREAKFAST, // indicates breakfast, lunch, snack etc.
            glycemic_index: 4,
            fat: 5,
            saturatedFat: 6,
            proteins: 7,
            fibers: 8,
            salt: 9,
            water: 10,
            sugars: 11,
            description: 'desc1'
        };
        const model2: FoodModel = {
            timestamp: 11,
            carbohydrates: 12,
            calories: 13,
            meal_type: MEAL_TYPE.LUNCH, // indicates breakfast, lunch, snack etc.
            glycemic_index: 14,
            fat: 15,
            saturatedFat: 16,
            proteins: 17,
            fibers: 18,
            salt: 19,
            water: 110,
            sugars: 111,
            description: 'desc2'
        };
        const POSTData1: IDActivityPOSTData = {
            gameDescriptor: Keys.foodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 1,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 12,
                    value: 'desc1'
                },
                {
                    property: 77,
                    value: 3
                },
                {
                    property: 79,
                    value: 8
                },
                {
                    property: 1176,
                    value: 2
                },
                {
                    property: 1177,
                    value: 'Breakfast'
                },
                {
                    property: 1178,
                    value: 4
                },
                {
                    property: 1179,
                    value: 5
                },
                {
                    property: 1180,
                    value: 6
                },
                {
                    property: 1181,
                    value: 7
                },
                {
                    property: 1182,
                    value: 9
                },
                {
                    property: 1183,
                    value: 10
                },
                {
                    property: 1184,
                    value: 11
                }
            ]),
            players: [0]
        };
        const POSTData2: IDActivityPOSTData = {
            gameDescriptor: Keys.foodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 11,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 12,
                    value: 'desc2'
                },
                {
                    property: 77,
                    value: 13
                },
                {
                    property: 79,
                    value: 18
                },
                {
                    property: 1176,
                    value: 12
                },
                {
                    property: 1177,
                    value: 'Lunch'
                },
                {
                    property: 1178,
                    value: 14
                },
                {
                    property: 1179,
                    value: 15
                },
                {
                    property: 1180,
                    value: 16
                },
                {
                    property: 1181,
                    value: 17
                },
                {
                    property: 1182,
                    value: 19
                },
                {
                    property: 1183,
                    value: 110
                },
                {
                    property: 1184,
                    value: 111
                }
            ]),
            players: [0]
        };

        client.food().postMultipleFoodActivities([model1, model2], 0, undefined, undefined);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/me/activities?dryrun=false&bulk=true`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                data: [POSTData1, POSTData2]
            })
        );
    });
});
