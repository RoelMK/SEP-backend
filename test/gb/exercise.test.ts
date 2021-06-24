/* eslint-disable max-len */
import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseModel } from '../../src/gb/models/exerciseModel';
import { ActivityGETData } from '../../src/gb/models/gamebusModel';
import { Exercise } from '../../src/gb/objects/exercise';
import { ExerciseGameDescriptorNames } from '../../src/gb/objects/GBObjectTypes';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

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

    test('GET all exercise activities', async () => {
        const exercises = await client.exercise().getAllExerciseActivities(0);

        expect(request).toHaveBeenCalledTimes(1);
        // URL is quite long but nothing I can do about that
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29`
            })
        );
        expect(exercises).toEqual([]);
    });

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
                url: `${endpoint}/players/0/activities?gds=WALK`
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
                url: `${endpoint}/players/0/activities?gds=WALK&end=21-04-2021&start=19-04-2021&sort=-date`
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET all exercise activities between dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const exercises = await client
            .exercise()
            .getAllExerciseActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29&end=21-04-2021&start=19-04-2021&sort=-date`
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
                url: `${endpoint}/players/0/activities?gds=WALK&end=20-04-2021&start=19-04-2021&sort=-date`
            })
        );
        expect(exercises).toEqual([]);
    });

    test('GET all exercise activities on date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const exercises = await client
            .exercise()
            .getAllExerciseActivitiesOnUnixDate(0, unixTimestamp);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                }),
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29&end=20-04-2021&start=19-04-2021&sort=-date`
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
                    id: 69383,
                    value: '20',
                    property: {
                        id: 1,
                        translationKey: 'STEPS',
                        baseUnit: 'count',
                        inputType: 'INT',
                        aggregationStrategy: 'SUM',
                        propertyPermissions: []
                    }
                }
            ],
            personalPoints: [],
            supports: [],
            chats: []
        };
        const expectedResult: ExerciseModel = {
            timestamp: 1622652468000,
            name: 'Walk',
            type: 'WALK',
            steps: 20,
            activityId: 0,
            duration: null,
            distance: null,
            calories: null,
            groupSize: null,
            penalty: null,
            score: null,
            maxSpeed: null,
            avgSpeed: null,
            maxHeartrate: null,
            avgHeartrate: null,
            minHeartrate: null,
            heartrate: null
        };
        expect(Exercise.convertResponseToExerciseModels([response])).toStrictEqual([
            expectedResult
        ]);
    });
});
