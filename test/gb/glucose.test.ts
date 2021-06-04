import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { GlucosePropertyKeys } from '../../src/gb/objects/glucose';
import { ActivityGETData } from '../../src/gb/models/gamebusModel';
import { Glucose } from '../../src/gb/objects/glucose';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');



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

    test('POST a single activity', async () => {
        const model : GlucoseModel = {
            timestamp : 12,
            glucoseLevel: 34,
        }
        const POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.glucose().glucoseTranslationKey,
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

    test('GET glucose activities', async () => {
        const glucose = await client.glucose().getGlucoseActivities(0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?gds=BLOOD_GLUCOSE_MSMT'
            })
        );
        expect(glucose).toEqual([]);
    });

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
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&sort=-date&gds=BLOOD_GLUCOSE_MSMT'
            })
        );
        expect(glucose).toEqual([]);
    });
});

describe('convert response to models', () => {
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
                image: 'https://api3.gamebus.eu/v2/uploads/public/MTU1NjI3OTk2MTMxMmd1V3dOTWV6.jpg',
                type: 'PHYSICAL',
                isAggregate: false
            },
            dataProvider: {
                id: 1,
                name: 'GameBus',
                image: 'https://api3.gamebus.eu/v2/uploads/public/brand/dp/GameBus.png',
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
            glucoseLevel: 6.2
        };
        expect(Glucose.convertResponseToGlucoseModels([response])).toStrictEqual([expectedResult]);
    });

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
                image: 'https://api3.gamebus.eu/v2/uploads/public/MTU1NjI3OTk2MTMxMmd1V3dOTWV6.jpg',
                type: 'PHYSICAL',
                isAggregate: false
            },
            dataProvider: {
                id: 1,
                name: 'GameBus',
                image: 'https://api3.gamebus.eu/v2/uploads/public/brand/dp/GameBus.png',
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
            glucoseLevel: convertMG_DLtoMMOL_L(110)
        };
        expect(Glucose.convertResponseToGlucoseModels([response])).toStrictEqual([expectedResult]);
    });
});
