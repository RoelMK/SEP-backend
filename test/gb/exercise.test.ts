import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseModel } from '../../src/gb/models/exerciseModel';
import { ActivityGETData } from '../../src/gb/models/gamebusModel';
import { Exercise, ExerciseGameDescriptorNames } from '../../src/gb/objects/exercise';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked exercises get call', () => {
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
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGd(0, [ExerciseGameDescriptorNames.WALK]);

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET activities from type between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGdBetweenUnix(
                0,
                [ExerciseGameDescriptorNames.WALK],
                unixTimestampBefore,
                unixTimestampAfter
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=21-04-2021&sort=-date&gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET activities from type on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const exercises = await client
            .exercise()
            .getExerciseActivityFromGdOnUnixDate(
                0,
                [ExerciseGameDescriptorNames.WALK],
                unixTimestamp
            );
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: 'https://api3.gamebus.eu/v2/players/0/activities?start=19-04-2021&end=20-04-2021&sort=-date&gds=WALK'
            })
        );
        expect(exercises).toEqual([]);
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
                id: 1,
                translationKey: 'WALK',
                image: 'https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png',
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
                    id: 69383,
                    value: '20',
                    property: {
                        id: 1,
                        translationKey: 'STEPS',
                        baseUnit: 'count',
                        inputType: 'INT',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: [
                            {
                                id: 646,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 650,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 653,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 658,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 663,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 668,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 674,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 678,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 681,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 686,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 691,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 696,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 729,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 740,
                                index: 0,
                                lastUpdate: null,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 1258,
                                index: null,
                                lastUpdate: 1616660841000,
                                decisionNote: null,
                                state: 'TESTING_ONLY',
                                allowedValues: []
                            },
                            {
                                id: 1259,
                                index: null,
                                lastUpdate: 1616660854000,
                                decisionNote: null,
                                state: 'TESTING_ONLY',
                                allowedValues: []
                            },
                            {
                                id: 1264,
                                index: null,
                                lastUpdate: 1619419282000,
                                decisionNote: null,
                                state: 'PUBLIC_APPROVED',
                                allowedValues: []
                            },
                            {
                                id: 1303,
                                index: null,
                                lastUpdate: 1620823338000,
                                decisionNote: null,
                                state: 'PUBLIC_REQUESTED',
                                allowedValues: []
                            }
                        ]
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: ExerciseModel = {
            timestamp: 1622652468000,
            type: 'WALK',
            steps: 20
        };
        expect(Exercise.convertResponseToExerciseModels([response])).toStrictEqual([
            expectedResult
        ]);
    });
});
