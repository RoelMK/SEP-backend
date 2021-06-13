import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData
} from '../../src/gb/models/gamebusModel';
import { MoodModel } from '../../src/gb/models/moodModel';
import { Mood, MoodPropertyKeys } from '../../src/gb/objects/mood';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('with mocked moods get call', () => {
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
     * UTP: GB - 23
     */
    test('GET mood activities', async () => {
        const moods = await client.mood().getAllMoodActivities(0);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_MOOD`
            })
        );
        expect(moods).toEqual([]);
    });

    /**
     * UTP: GB - 24
     */
    test('GET mood activities between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const moods = await client
            .mood()
            .getMoodActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_MOOD&start=19-04-2021&end=21-04-2021&sort=-date`
            })
        );
        expect(moods).toEqual([]);
    });

    /**
     * UTP: GB - 25
     */
    test('GET mood activities on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const moods = await client.mood().getMoodActivitiesOnUnixDate(0, unixTimestamp);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=LOG_MOOD&start=19-04-2021&end=20-04-2021&sort=-date`
            })
        );
        expect(moods).toEqual([]);
    });
});

describe('with mocked mood post call', () => {
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
     * UTP: GB - 38
     */
    test('POST a single activity', async () => {
        const model: MoodModel = {
            timestamp: 12,
            valence: 34,
            arousal: 56
        };
        const POSTData: ActivityPOSTData = {
            gameDescriptorTK: client.mood().moodGameDescriptor,
            dataProviderName: client.activity().dataProviderName,
            date: 12,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    propertyTK: MoodPropertyKeys.valence,
                    value: 34
                },
                {
                    propertyTK: MoodPropertyKeys.arousal,
                    value: 56
                }
            ]),
            players: [90]
        };

        client.mood().postSingleMoodActivity(model, 90, undefined, undefined);

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
     * UTP: GB - 39
     */
    test('POST multiple activities', async () => {
        const model1: MoodModel = {
            timestamp: 1,
            arousal: 2,
            valence: 3
        };
        const model2: MoodModel = {
            timestamp: 11,
            arousal: 12,
            valence: 13
        };
        const POSTData1: IDActivityPOSTData = {
            gameDescriptor: client.mood().moodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 1,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 1186,
                    value: 2
                },
                {
                    property: 1187,
                    value: 3
                }
            ]),
            players: [0]
        };
        const POSTData2: IDActivityPOSTData = {
            gameDescriptor: client.mood().moodGameDescriptorID,
            dataProvider: client.activity().dataProviderID,
            date: 11,
            image: '',
            propertyInstances: expect.arrayContaining([
                {
                    property: 1186,
                    value: 12
                },
                {
                    property: 1187,
                    value: 13
                }
            ]),
            players: [0]
        };

        client.mood().postMultipleMoodActivities([model1, model2], 0, undefined, undefined);

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

describe('with mocked mood put call', () => {
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
     * UTP: GB - 40
     */
    test('PUT a single mood model', async () => {
        const mood: MoodModel = {
            timestamp: 1,
            valence: 2,
            arousal: 2,
            activityId: 1
        };

        const response = await client.mood().putSingleMoodActivity(mood, 0);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/activities/1?dryrun=false`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(response).toEqual([]);
    });

    /**
     * UTP: GB - 41
     */
    test('PUT a single mood model without ID', async () => {
        const mood: MoodModel = {
            timestamp: 1,
            valence: 2,
            arousal: 2
        };

        expect(async () => {
            await client.mood().putSingleMoodActivity(mood, 0);
        }).rejects.toThrow('Activity ID must be present in order to replace activity');
    });
});

describe('convert response to models', () => {
    /**
     * UTP: GB - 30
     */
    test('convert mood response to model', () => {
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
                id: 1062,
                translationKey: 'LOG_MOOD',
                image: '',
                type: 'COGNITIVE',
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
                        id: 1187,
                        translationKey: 'MOOD_VALENCE',
                        baseUnit: '[1,3]',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                },
                {
                    id: 0,
                    value: '2',
                    property: {
                        id: 1186,
                        translationKey: 'MOOD_AROUSAL',
                        baseUnit: '[1,3]',
                        inputType: 'INT',
                        aggregationStrategy: 'AVERAGE',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: MoodModel = {
            timestamp: 1622652468000,
            arousal: 2,
            valence: 2,
            activityId: 0
        };
        expect(Mood.convertResponseToMoodModels([response])).toStrictEqual([expectedResult]);
    });
});
