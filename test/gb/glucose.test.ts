/* eslint-disable max-len */
import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import {
    ActivityPOSTData,
    IDActivityPOSTData,
    ActivityGETData
} from '../../src/gb/models/gamebusModel';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { GlucosePropertyKeys, Glucose } from '../../src/gb/objects/glucose';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { mockRequest } from '../testUtils/requestUtils';
import { Keys } from '../../src/gb/objects/keys';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('with mocked glucose POST call', () => {
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

    /**
     * UTP: GB - 34
     */
    test('POST a single activity', async () => {
        const model: GlucoseModel = {
            timestamp: 12,
            glucoseLevel: 34
        };
        const POSTData: ActivityPOSTData = {
            gameDescriptorTK: Keys.glucoseTranslationKey,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    propertyTK: GlucosePropertyKeys.glucoseLevel,
                    value: 34
                }
            ]),
            players: [0]
        };

        client.glucose().postSingleGlucoseActivity(model, 0, undefined, undefined);

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

    /**
     * UTP: GB - 35
     */
    test('POST multiple activities', async () => {
        const model1: GlucoseModel = {
            timestamp: 1,
            glucoseLevel: 2
        };
        const model2: GlucoseModel = {
            timestamp: 11,
            glucoseLevel: 12
        };
        const POSTData1: IDActivityPOSTData = {
            gameDescriptor: Keys.glucoseGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 1,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 88,
                    value: 2
                }
            ]),
            players: [0]
        };
        const POSTData2: IDActivityPOSTData = {
            gameDescriptor: Keys.glucoseGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 11,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 88,
                    value: 12
                }
            ]),
            players: [0]
        };

        client.glucose().postMultipleGlucoseActivities([model1, model2], 0, undefined, undefined);

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
    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '0'));

    /**
     * UTP: GB - 15
     */
    test('GET glucose activities', async () => {
        const glucose = await client.glucose().getGlucoseActivities(0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=BLOOD_GLUCOSE_MSMT`
            })
        );
        expect(glucose).toEqual([]);
    });

    /**
     * UTP: GB - 16
     */
    test('GET glucose activities between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const glucose = await client
            .glucose()
            .getGlucoseActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=BLOOD_GLUCOSE_MSMT&start=19-04-2021&end=21-04-2021&sort=-date`
            })
        );
        expect(glucose).toEqual([]);
    });
});

describe('convert response to models', () => {
    /**
     * UTP: GB - 29
     */
    test('convert single MMOL/L response to single model', () => {
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
                id: 61,
                translationKey: 'BLOOD_GLUCOSE_MSMT',
                image: '',
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
                    id: 0,
                    value: '6.2',
                    property: {
                        id: 598,
                        translationKey: 'eAG_MMOLL',
                        baseUnit: 'MMOLL',
                        inputType: 'Double',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: GlucoseModel = {
            timestamp: 1622652468000,
            glucoseLevel: 6.2,
            activityId: 0
        };
        expect(Glucose.convertResponseToGlucoseModels([response])).toStrictEqual([expectedResult]);
    });

    /**
     * UTP: GB - 29
     */
    test('convert single MG/DL response to single model', () => {
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
                id: 61,
                translationKey: 'BLOOD_GLUCOSE_MSMT',
                image: '',
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
                    id: 0,
                    value: '110',
                    property: {
                        id: 89,
                        translationKey: 'eAG_MGDL',
                        baseUnit: 'MGDL',
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
        const expectedResult: GlucoseModel = {
            timestamp: 1622652468000,
            glucoseLevel: convertMG_DLtoMMOL_L(110),
            activityId: 0
        };
        expect(Glucose.convertResponseToGlucoseModels([response])).toStrictEqual([expectedResult]);
    });
});
