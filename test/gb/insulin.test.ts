import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ActivityPOSTData } from '../../src/gb/models/gamebusModel';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { InsulinPropertyKeys } from '../../src/gb/objects/insulin';
import { ActivityGETData } from '../../src/gb/models/gamebusModel';
import { Insulin } from '../../src/gb/objects/insulin';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked insuline get call', () => {
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
        const insulin = await client
            .insulin()
            .getInsulinActivityFromGd(0);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?gds=LOG_INSULIN'
            })
        );
        expect(insulin).toEqual([]);
    });

    test('GET activities from type between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const insulin = await client
            .insulin()
            .getInsulinActivityFromGdBetweenUnix(
                0,
                unixTimestampBefore,
                unixTimestampAfter
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&sort=-date&gds=LOG_INSULIN'
            })
        );
        expect(insulin).toEqual([]);
    });

    test('GET activities from type on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const insulin = await client
            .insulin()
            .getInsulinActivityFromGdOnUnixDate(
                0,
                unixTimestamp
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&sort=-date&gds=LOG_INSULIN'
            })
        );
        expect(insulin).toEqual([]);
    });

    test('POST a single activity', async () => {
        const model : InsulinModel = {
            timestamp : 12,
            insulinAmount: 34,
            insulinType: InsulinType.RAPID
        }
        const POSTData : ActivityPOSTData= {
            gameDescriptorTK: client.insulin().insulinTranslationKey,
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


describe('convert response to models', () => {
    test('convert single response to single model', () => {
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
                image: 'https://api3.gamebus.eu/v2/uploads/public/brand/dp/GameBus.png',
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
                        propertyPermissions: [
                            {
                                id: 1268,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 1369,
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
                    id: 69398,
                    value: '3',
                    property: {
                        id: 1144,
                        translationKey: 'INSULIN_DOSE',
                        baseUnit: 'IU',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                            {
                                id: 1269,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 1366,
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
                    id: 69399,
                    value: 'rapid',
                    property: {
                        id: 1185,
                        translationKey: 'INSULIN_SPEED',
                        baseUnit: '[rapid,long]',
                        inputType: 'STRING',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: [
                            {
                                id: 1367,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 1368,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: [
                                    {
                                        index: 0,
                                        translationKey: 'INSULIN_TYPE_RAPID',
                                        enumValue: 'rapid'
                                    },
                                    {
                                        index: 1,
                                        translationKey: 'INSULIN_TYPE_LONG',
                                        enumValue: 'long'
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            'personalPoints': [],
            'supports': [],
            'chats': []
        };
        const expectedResult: InsulinModel = {
            timestamp: 1622736981000,
            insulinAmount: 3,
            insulinType: 0
        };
        expect(Insulin.convertResponseToInsulinModels([response])).toStrictEqual([
            expectedResult
        ]);
    });
});