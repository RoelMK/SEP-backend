import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import {
    ActivityPOSTData,
    IDActivityPOSTData,
    ActivityGETData
} from '../../src/gb/models/gamebusModel';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { InsulinPropertyKeys, Keys } from '../../src/gb/objects/GBObjectTypes';
import { Insulin } from '../../src/gb/objects/insulin';

import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

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
    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '0'));

    test('GET activities from type', async () => {
        const insulin = await client.insulin().getInsulinActivities(0);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_INSULIN`
            })
        );
        expect(insulin).toEqual([]);
    });

    test('GET activities from type between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const insulin = await client
            .insulin()
            .getInsulinActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_INSULIN&end=21-04-2021&start=19-04-2021&sort=-date`
            })
        );
        expect(insulin).toEqual([]);
    });

    test('GET activities from type on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const insulin = await client.insulin().getInsulinActivitiesOnUnixDate(0, unixTimestamp);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_INSULIN&end=20-04-2021&start=19-04-2021&sort=-date`
            })
        );
        expect(insulin).toEqual([]);
    });
});

describe('with mocked insulin post call', () => {
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

    test('POST a single activity', async () => {
        const model: InsulinModel = {
            timestamp: 12,
            insulinAmount: 34,
            insulinType: InsulinType.RAPID
        };
        const POSTData: ActivityPOSTData = {
            gameDescriptorTK: Keys.insulinTranslationKey,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    propertyTK: InsulinPropertyKeys.insulinAmount,
                    value: 34
                },
                {
                    propertyTK: InsulinPropertyKeys.insulinType,
                    value: 'rapid'
                }
            ]),
            players: [0]
        };

        client.insulin().postSingleInsulinActivity(model, 0, undefined, undefined);

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
        const model1: InsulinModel = {
            timestamp: 1,
            insulinAmount: 2,
            insulinType: InsulinType.LONG
        };
        const model2: InsulinModel = {
            timestamp: 11,
            insulinAmount: 12,
            insulinType: InsulinType.RAPID
        };
        const POSTData1: IDActivityPOSTData = {
            gameDescriptor: Keys.insulinGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 1,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 1144,
                    value: 2
                },
                {
                    property: 1185,
                    value: 'long'
                }
            ]),
            players: [0]
        };
        const POSTData2: IDActivityPOSTData = {
            gameDescriptor: Keys.insulinGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 11,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 1144,
                    value: 12
                },
                {
                    property: 1185,
                    value: 'rapid'
                }
            ]),
            players: [0]
        };

        client.insulin().postMultipleInsulinActivities([model1, model2], 0, undefined, undefined);

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

describe('with mocked insulin put call', () => {
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

    test('PUT a single insulin model', async () => {
        const insulin: InsulinModel = {
            timestamp: 1,
            insulinAmount: 2,
            insulinType: InsulinType.RAPID,
            activityId: 1
        };

        const response = await client.insulin().putSingleInsulinActivity(insulin, 0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/activities/1?dryrun=false`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(response).toEqual({});
    });

    test('PUT a single insulin model without ID', async () => {
        const insulin: InsulinModel = {
            timestamp: 1,
            insulinAmount: 2,
            insulinType: InsulinType.RAPID
        };

        expect(async () => {
            await client.insulin().putSingleInsulinActivity(insulin, 0);
        }).rejects.toThrow('Activity ID must be present in order to replace activity');
    });
});

describe('convert response to models', () => {
    test('convert single response to single model with insulin type 0', () => {
        const response: ActivityGETData = {
            id: 0,
            date: 1622736981000,
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
                id: 1075,
                translationKey: 'LOG_INSULIN',
                image: null,
                type: 'PHYSICAL',
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
                    id: 69397,
                    value: '2',
                    property: {
                        id: 1143,
                        translationKey: 'INSULIN_TYPE',
                        baseUnit: 'String text',
                        inputType: 'STRING',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: []
                    }
                },
                {
                    id: 69398,
                    value: '3',
                    property: {
                        id: 1144,
                        translationKey: 'INSULIN_DOSE',
                        baseUnit: 'IU',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 69399,
                    value: 'rapid',
                    property: {
                        id: 1185,
                        translationKey: 'INSULIN_SPEED',
                        baseUnit: '[rapid,long]',
                        inputType: 'STRING',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: InsulinModel = {
            timestamp: 1622736981000,
            insulinAmount: 3,
            insulinType: 0,
            activityId: 0
        };
        expect(Insulin.convertResponseToInsulinModels([response])).toStrictEqual([expectedResult]);
    });

    test('convert single response to single model with insulin type 1', () => {
        const response: ActivityGETData = {
            id: 0,
            date: 1622736981000,
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
                id: 1075,
                translationKey: 'LOG_INSULIN',
                image: null,
                type: 'PHYSICAL',
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
                    id: 69397,
                    value: '2',
                    property: {
                        id: 1143,
                        translationKey: 'INSULIN_TYPE',
                        baseUnit: 'String text',
                        inputType: 'STRING',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: []
                    }
                },
                {
                    id: 69398,
                    value: '3',
                    property: {
                        id: 1144,
                        translationKey: 'INSULIN_DOSE',
                        baseUnit: 'IU',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 69399,
                    value: 'long',
                    property: {
                        id: 1185,
                        translationKey: 'INSULIN_SPEED',
                        baseUnit: '[rapid,long]',
                        inputType: 'STRING',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: InsulinModel = {
            timestamp: 1622736981000,
            insulinAmount: 3,
            insulinType: 1,
            activityId: 0
        };
        expect(Insulin.convertResponseToInsulinModels([response])).toStrictEqual([expectedResult]);
    });
});
