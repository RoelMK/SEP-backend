import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { MoodModel } from '../../src/gb/models/moodModel';
import { DateFormat, parseDate } from '../../src/services/utils/dates';

export function addMoods(gbAccessToken: string, pId: string) {
    const moods: MoodModel[] = [
        {
            timestamp: parseDate(
                '15-06-2021 08:14',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '15-06-2021 14:11',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 3,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '15-06-2021 18:24',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 3
        },
        {
            timestamp: parseDate(
                '15-06-2021 20:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '16-06-2021 11:10',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 2
        },
        {
            timestamp: parseDate(
                '16-06-2021 15:23',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '16-06-2021 19:23',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 3,
            arousal: 3
        },
        {
            timestamp: parseDate(
                '17-06-2021 10:23',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '17-06-2021 13:23',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '17-06-2021 21:23',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 3,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '18-06-2021 07:45',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 1
        },
        {
            timestamp: parseDate(
                '18-06-2021 14:47',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 2
        },
        {
            timestamp: parseDate(
                '18-06-2021 18:12',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 2
        },
        {
            timestamp: parseDate(
                '19-06-2021 11:21',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 1,
            arousal: 3
        },
        {
            timestamp: parseDate(
                '19-06-2021 15:34',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            valence: 2,
            arousal: 3
        }
    ];

    const gbClient: GameBusClient = new GameBusClient(new TokenHandler(gbAccessToken, '', pId));
    gbClient.mood().postMultipleMoodActivities(moods, parseInt(pId));
}
