import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { BMIModel } from '../../src/gb/models/bmiModels';
import { ActivityGETData, ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { BMI, BMIPropertyKeys } from '../../src/gb/objects/bmi';
import { Keys } from '../../src/gb/objects/keys';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('with mocked BMI POST call', () => {
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

    test('POST single activity', async () => {
        const model: BMIModel = {
            timestamp: 1,
            weight: 100,
            length: 10,
            age: 100
        };
        const POSTData: ActivityPOSTData = {
            gameDescriptorTK: Keys.bmiTranslationKey,
            dataProviderName: client.activity().dataProviderName,
            date: 1,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    propertyTK: BMIPropertyKeys.weight,
                    value: 100
                },
                {
                    propertyTK: BMIPropertyKeys.length,
                    value: 10
                },
                {
                    propertyTK: BMIPropertyKeys.age,
                    value: 100
                }
            ]),
            players: [0]
        };

        client.bmi().postSingleBMIActivity(model, 0);

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
});

describe('with mocked BMI get call', () => {
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

    test('GET BMI activities', async () => {
        const bmi = await client.bmi().getBMIActivities(0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=BODY_MASS_INDEX&sort=-date`
            })
        );
        expect(bmi).toEqual([]);
    });

    test('GET latest BMI activity', async () => {
        const bmi = await client.bmi().getLatestBMIActivity(0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=BODY_MASS_INDEX&sort=-date`
            })
        );
        expect(bmi).toEqual({});
    });
});

describe('convert response to models', () => {
    test('convert single response to single model', () => {
        const response: ActivityGETData = {
            id: 0,
            date: 1622652468000,
            isManual: true,
            group: null,
            image: null,
            creator: {
                id: 0,
                user: {
                    id: 0,
                    firstName: 'First',
                    lastName: 'Last',
                    image: null
                }
            },
            player: {
                id: 0,
                user: {
                    id: 0,
                    firstName: 'First',
                    lastName: 'Last',
                    image: null
                }
            },
            gameDescriptor: {
                id: 1078,
                translationKey: 'BODY_MASS_INDEX',
                image: '',
                type: 'SOCIAL',
                isAggregate: false
            },
            dataProvider: {
                id: 1,
                name: 'GameBus',
                image: '',
                isConnected: false
            },
            propertyInstances: [
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 69,
                        translationKey: 'WEIGHT',
                        baseUnit: 'kGrams',
                        inputType: 'WEIGHT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 70,
                        translationKey: 'LENGTH',
                        baseUnit: 'centimeters',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 1188,
                        translationKey: 'AGE',
                        baseUnit: 'years',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: 'm',
                    property: {
                        id: 1189,
                        translationKey: 'GENDER',
                        baseUnit: '[m,f,o]',
                        inputType: 'STRING',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 1190,
                        translationKey: 'WAIST_CIRCUMFERENCE',
                        baseUnit: 'cm',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 1191,
                        translationKey: 'BODY_MASS_INDEX',
                        baseUnit: 'kg/m2',
                        inputType: 'DOUBLE',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: BMIModel = {
            timestamp: 1622652468000,
            activityId: 0,
            weight: 2,
            length: 2,
            age: 2,
            gender: 'm',
            waistCircumference: 2,
            bmi: 2
        };
        expect(BMI.convertResponseToBMIModels([response])).toStrictEqual([expectedResult]);
    });
});
