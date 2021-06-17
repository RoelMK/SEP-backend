import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ExerciseModel } from '../../src/gb/models/exerciseModel';
import { ExerciseGameDescriptorNames } from '../../src/gb/objects/keys';
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
            heartrate: 110
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
            heartrate: 75
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
                '17-06-2021 21:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            name: 'Soccer',
            type: ExerciseGameDescriptorNames.SOCCER,
            duration: 5400,
            calories: 800,
            heartrate: 110
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
        }
    ];

    // post all activities
    exercises.forEach(async (exercise) => {
        console.log(exercise);
        await gbClient.exercise().postSingleExerciseActivity(exercises[0], parseInt(pId));
    });
}
