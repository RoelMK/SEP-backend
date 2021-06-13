import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseGameDescriptorNames } from '../../src/gb/objects/keys';
import {
    DataEndpoint,
    DataType,
    EndpointData,
    parseDataTypes,
    parseExerciseTypes
} from '../../src/services/dataEndpoint';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('with mocked requests get call', () => {
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

    test('union single data timestamp', () => {
        const data: EndpointData = {
            exercise: [
                {
                    timestamp: 1,
                    name: 'ex1',
                    type: 'ex?',
                    heartrate: 1
                }
            ],
            food: [
                {
                    timestamp: 1,
                    carbohydrates: 21
                }
            ],
            glucose: [
                {
                    timestamp: 1,
                    glucoseLevel: 12
                }
            ],
            mood: [
                {
                    timestamp: 1,
                    arousal: 1,
                    valence: 2
                }
            ],
            insulin: [
                {
                    timestamp: 1,
                    insulinType: 2,
                    insulinAmount: 12
                }
            ]
        };
        const union = DataEndpoint.unionData(data);
        expect(union).toStrictEqual([
            {
                timestamp: 1,
                // exercise
                name: 'ex1', // sensible name of activity (regex of type)
                type: 'ex?', // activity type
                duration: null, // in seconds
                steps: null, // in amount
                distance: null, // in meters
                caloriesBurnt: null, // in kcal //TODO changed name
                groupSize: null, // in amount (0 - inf)
                penalty: null, // in amount (0 - 100), only relevant for air hockey
                score: null, // in amount, only relevant for air hockey
                maxSpeed: null, // in m/s, only relevant for (detail) activities
                avgSpeed: null, // in m/s, only relevant for (detail) activities
                maxHeartrate: null, // in bpm, only relevant for (detail) activities
                avgHeartrate: null, // in bpm, only relevant for (detail) activities
                minHeartrate: null, // in bpm, only relevant for (detail) activities
                heartrate: 1, // in bpm, currently unused but can be used at a later date
                // food
                carbohydrates: 21,
                calories: null,
                meal_type: null, // indicates breakfast, lunch, snack etc.
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                fibers: null,
                salt: null,
                water: null,
                sugars: null,
                description: null,
                // glucose
                glucoseLevel: 12,
                // insulin
                insulinAmount: 12,
                insulinType: 2,
                // mood
                arousal: 1,
                valence: 2
            }
        ]);
    });

    test('union multiple data timestamps', () => {
        const data: EndpointData = {
            exercise: [
                {
                    timestamp: 1,
                    name: 'ex1',
                    type: 'ex?',
                    heartrate: 1
                }
            ],
            food: [
                {
                    timestamp: 1,
                    carbohydrates: 21
                }
            ],
            glucose: [
                {
                    timestamp: 1,
                    glucoseLevel: 12
                }
            ],
            mood: [
                {
                    timestamp: 2,
                    arousal: 1,
                    valence: 2
                }
            ],
            insulin: [
                {
                    timestamp: 2,
                    insulinType: 2,
                    insulinAmount: 12
                }
            ]
        };
        const union = DataEndpoint.unionData(data);
        expect(union).toStrictEqual([
            {
                timestamp: 1,
                // exercise
                name: 'ex1', // sensible name of activity (regex of type)
                type: 'ex?', // activity type
                duration: null, // in seconds
                steps: null, // in amount
                distance: null, // in meters
                caloriesBurnt: null, // in kcal //TODO changed name
                groupSize: null, // in amount (0 - inf)
                penalty: null, // in amount (0 - 100), only relevant for air hockey
                score: null, // in amount, only relevant for air hockey
                maxSpeed: null, // in m/s, only relevant for (detail) activities
                avgSpeed: null, // in m/s, only relevant for (detail) activities
                maxHeartrate: null, // in bpm, only relevant for (detail) activities
                avgHeartrate: null, // in bpm, only relevant for (detail) activities
                minHeartrate: null, // in bpm, only relevant for (detail) activities
                heartrate: 1, // in bpm, currently unused but can be used at a later date
                // food
                carbohydrates: 21,
                calories: null,
                meal_type: null, // indicates breakfast, lunch, snack etc.
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                fibers: null,
                salt: null,
                water: null,
                sugars: null,
                description: null,
                // glucose
                glucoseLevel: 12,
                // insulin
                insulinAmount: null,
                insulinType: null,
                // mood
                arousal: null,
                valence: null
            },
            {
                timestamp: 2,
                // exercise
                name: null, // sensible name of activity (regex of type)
                type: null, // activity type
                duration: null, // in seconds
                steps: null, // in amount
                distance: null, // in meters
                caloriesBurnt: null, // in kcal //TODO changed name
                groupSize: null, // in amount (0 - inf)
                penalty: null, // in amount (0 - 100), only relevant for air hockey
                score: null, // in amount, only relevant for air hockey
                maxSpeed: null, // in m/s, only relevant for (detail) activities
                avgSpeed: null, // in m/s, only relevant for (detail) activities
                maxHeartrate: null, // in bpm, only relevant for (detail) activities
                avgHeartrate: null, // in bpm, only relevant for (detail) activities
                minHeartrate: null, // in bpm, only relevant for (detail) activities
                heartrate: null, // in bpm, currently unused but can be used at a later date
                // food
                carbohydrates: null,
                calories: null,
                meal_type: null, // indicates breakfast, lunch, snack etc.
                glycemic_index: null,
                fat: null,
                saturatedFat: null,
                proteins: null,
                fibers: null,
                salt: null,
                water: null,
                sugars: null,
                description: null,
                // glucose
                glucoseLevel: null,
                // insulin
                insulinAmount: 12,
                insulinType: 2,
                // mood
                arousal: 1,
                valence: 2
            }
        ]);
    });

    test('empty request', async () => {
        const endpoint = new DataEndpoint(client, 0, [], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({});
    });

    test('request glucose', async () => {
        const endpoint = new DataEndpoint(client, 0, ['glucose'], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ glucose: [] });
    });

    test('request insulin', async () => {
        const endpoint = new DataEndpoint(client, 0, ['insulin'], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ insulin: [] });
    });

    test('request mood', async () => {
        const endpoint = new DataEndpoint(client, 0, ['mood'], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ mood: [] });
    });

    test('request food', async () => {
        const endpoint = new DataEndpoint(client, 0, ['food'], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ food: [] });
    });

    test('request exercise without parameters', async () => {
        const endpoint = new DataEndpoint(client, 0, ['exercise'], {});
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ exercise: [] });
    });

    test('request exercise with parameters', async () => {
        const endpoint = new DataEndpoint(client, 0, ['exercise'], { exerciseTypes: [] });
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ exercise: [] });
    });

    test('request all data types', async () => {
        const endpoint = new DataEndpoint(
            client,
            0,
            ['food', 'mood', 'glucose', 'insulin', 'exercise'],
            {}
        );
        const data = await endpoint.retrieveData({ startDate: new Date(), endDate: new Date() });
        expect(data).toStrictEqual({ food: [], mood: [], glucose: [], insulin: [], exercise: [] });
    });

    test('parsing of empty exercise type list', () => {
        const exTypes = parseExerciseTypes('');
        expect(exTypes).toStrictEqual([]);
    });

    test('parsing of single exercise in type list', () => {
        const exTypes = parseExerciseTypes('WALK');
        expect(exTypes).toStrictEqual([ExerciseGameDescriptorNames.WALK]);
    });

    test('parsing of multiple exercise types in list', () => {
        const exTypes = parseExerciseTypes('WALK,RUN,MOUNTAINBIKE');
        expect(exTypes).toStrictEqual([
            ExerciseGameDescriptorNames.WALK,
            ExerciseGameDescriptorNames.RUN,
            ExerciseGameDescriptorNames.MOUNTAINBIKE
        ]);
    });

    test('parsing of multiple exercise types in list with duplicates', () => {
        const exTypes = parseExerciseTypes('WALK,WALK,RUN,MOUNTAINBIKE,RUN');
        expect(exTypes).toStrictEqual([
            ExerciseGameDescriptorNames.WALK,
            ExerciseGameDescriptorNames.RUN,
            ExerciseGameDescriptorNames.MOUNTAINBIKE
        ]);
    });

    test('parsing of multiple exercise types in list with non-existent', () => {
        const exTypes = parseExerciseTypes('WALK,wefojwefjowef,RUN,MOUNTAINBIKE,BLABLA');
        expect(exTypes).toStrictEqual([
            ExerciseGameDescriptorNames.WALK,
            ExerciseGameDescriptorNames.RUN,
            ExerciseGameDescriptorNames.MOUNTAINBIKE
        ]);
    });

    test('parsing of multiple exercise types in list with whitespace and irregular capitalization', () => {
        const exTypes = parseExerciseTypes('wAlk, run, MOUNTAINBIKE');
        expect(exTypes).toStrictEqual([
            ExerciseGameDescriptorNames.WALK,
            ExerciseGameDescriptorNames.RUN,
            ExerciseGameDescriptorNames.MOUNTAINBIKE
        ]);
    });

    test('parsing of empty data type list', () => {
        const dataTypes = parseDataTypes([]);
        expect(dataTypes).toStrictEqual([]);
    });

    test('parsing of single data in type list', () => {
        const dataTypes = parseDataTypes(['GLUCOSE']);
        expect(dataTypes).toStrictEqual([DataType.GLUCOSE]);
    });

    test('parsing of multiple data types in list', () => {
        const dataTypes = parseDataTypes(['GLUCOSE', 'FOOD']);
        expect(dataTypes).toStrictEqual([DataType.GLUCOSE, DataType.FOOD]);
    });

    test('parsing of multiple data types in list with duplicates', () => {
        const dataTypes = parseDataTypes(['GLUCOSE', 'FOOD', 'FOOD']);
        expect(dataTypes).toStrictEqual([DataType.GLUCOSE, DataType.FOOD]);
    });

    test('parsing of multiple data types in list with non-existent', () => {
        const dataTypes = parseDataTypes(['wefni0werfji0qwef', 'GLUCOSE', 'FOOD', 'jhj8i9f']);
        expect(dataTypes).toStrictEqual([DataType.GLUCOSE, DataType.FOOD]);
    });

    test('parsing of multiple data types in list with whitespace and irregular capitalization', () => {
        const dataTypes = parseDataTypes(['gluCose', 'FOOD']);
        expect(dataTypes).toStrictEqual([DataType.GLUCOSE, DataType.FOOD]);
    });
});
