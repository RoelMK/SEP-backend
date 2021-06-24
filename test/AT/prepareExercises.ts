import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseModel } from '../../src/gb/models/exerciseModel';
import { ExerciseGameDescriptorNames } from '../../src/gb/objects/GBObjectTypes';
import { DateFormat, parseDate } from '../../src/services/utils/dates';

export function addExercises(gbAccessToken: string, pId: string) {
    const gbClient: GameBusClient = new GameBusClient(new TokenHandler(gbAccessToken, '', pId));
    const exercises: ExerciseModel[] = [
        {
            timestamp: parseDate(
                '15-06-2021 19:14',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Run',
            type: ExerciseGameDescriptorNames.RUN,
            duration: 3000,
            calories: 450,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '15-06-2021 17:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Ice hockey',
            type: ExerciseGameDescriptorNames.ICE_HOCKEY,
            duration: 3600,
            calories: 380,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '16-06-2021 15:20',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Walk',
            type: ExerciseGameDescriptorNames.WALK,
            duration: 1200,
            calories: 95,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '16-06-2021 18:30',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Horseriding',
            type: ExerciseGameDescriptorNames.HORSE_RIDING,
            duration: 2800,
            calories: 147,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '17-06-2021 15:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Lacrosse',
            type: ExerciseGameDescriptorNames.LACROSSE,
            duration: 2500,
            calories: 400,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '17-06-2021 21:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Basketball',
            type: ExerciseGameDescriptorNames.BASKETBALL,
            duration: 5400,
            calories: 800,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '18-06-2021 10:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Walk',
            type: ExerciseGameDescriptorNames.WALK,
            duration: 1200,
            calories: 56,
            heartrate: null
        },
        {
            timestamp: parseDate(
                '18-06-2021 14:30',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'AT',
            type: ExerciseGameDescriptorNames.MARTIAL_ARTS,
            duration: 3600,
            calories: 200,
            heartrate: null
        }
    ];

    // post all activities
    exercises.forEach(async (exercise) => {
        await gbClient.exercise().postSingleExerciseActivity(exercise, parseInt(pId));
    });
}
