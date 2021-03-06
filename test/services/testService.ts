/* eslint-disable @typescript-eslint/no-unused-vars */

import { DBClient } from '../../src/db/dbClient';
import { GameBusToken, TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { ChallengePOSTData } from '../../src/gb/models/gamebusModel';
import { MoodModel } from '../../src/gb/models/moodModel';
import { NightScoutClient } from '../../src/nightscout/nsClient';
import AbbottParser from '../../src/services/dataParsers/abbottParser';
import {
    NightScoutEntryModel,
    NightScoutTreatmentModel,
    OutputDataType
} from '../../src/services/dataParsers/dataParserTypes';
import FoodDiaryParser from '../../src/services/dataParsers/foodDiaryParser';
import NightscoutParser from '../../src/services/dataParsers/nightscoutParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';

const dummyUserInfo: GameBusToken = {
    playerId: 'testing',
    accessToken: '12345',
    refreshToken: '67890'
};

async function testAbbott() {
    //const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
    const abbottParser: AbbottParser = new AbbottParser(
        'test/services/data/abbott_eu.csv',
        dummyUserInfo
    );
    // const abbottParser: AbbottParser = new AbbottParser('test/services/data/foodDiary_standard_missing.xlsx');
    // Currently this step is required since reading the file is async
    await abbottParser.process();
    // Print data for debugging
    //console.log(abbottParser.getData(OutputDataType.FOOD));
    //console.log(abbottParser.getData(OutputDataType.GLUCOSE));
    console.log(abbottParser.getData(OutputDataType.INSULIN));
}

async function testExcel() {
    const testPath = 'test/services/data/foodDiary_standard_missing_table.xlsx';
    const wrongTestPath = 'test/services/data/abbott_eu.csv';

    try {
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(wrongTestPath, dummyUserInfo);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    } catch (e) {
        console.log(e.message);
    }
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(testPath, dummyUserInfo);
    await foodDiaryParser.process();

    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD));
}

async function testOneDrive() {
    //var testPath = 'smthonaonedrive.xlsx'
    //console.log(await new OneDriveExcelParser().parse(testPath, DataSource.FOOD_DIARY, 'token'))

    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(
        'foodDiary_AT.xlsx',
        dummyUserInfo,
        testToken
    );
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD));
}

async function testNightScout() {
    const testEntry: NightScoutEntryModel = {
        type: 'sgv',
        date: new Date().getTime(),
        sgv: 79,
        noise: 0,
        filtered: 0,
        unfiltered: 0,
        rssi: 0
    };

    const testTreatmentInsulin: NightScoutTreatmentModel = {
        eventType: 'Correction Bolus',
        created_at: '2021-06-14',
        insulin: 4,
        notes: 'insulin treatment',
        enteredBy: 'Frans'
    };

    const testTreatmentFood: NightScoutTreatmentModel = {
        eventType: 'Carb correction',
        created_at: '2021-06-14',
        carbs: 20,
        protein: 20,
        fat: 20,
        notes: 'food treatment',
        enteredBy: 'Jan'
    };

    const nsClient = new NightScoutClient(
        'https://nightscout-sep.herokuapp.com',
        'rink-27f591f2e4730a68'
    );

    //console.log(await nsClient.getEntries());
    //console.log(await nsClient.getTreatments());
    //console.log('Glucose in the unit: ' + (await nsClient.getGlucoseUnit()));

    const nsParser: NightscoutParser = new NightscoutParser(
        'https://nightscout-sep.herokuapp.com',
        dummyUserInfo,
        ''
    );
    await nsParser.process();
    console.log(nsParser.getData(OutputDataType.FOOD));
    console.log(nsParser.getData(OutputDataType.INSULIN));
    console.log(nsParser.getData(OutputDataType.GLUCOSE));
}

async function testGb() {
    const client = new GameBusClient(new TokenHandler('', '', ''));
    const challenge: ChallengePOSTData = {
        name: 'challenge name 11',
        description: null,
        image: null,
        websiteURL: 'https://www.google.com/',
        minCircleSize: 1,
        maxCircleSize: 1,
        availableDate: '2021-06-06T00:00:00.000+02:00',
        startDate: '2021-06-07T13:00:00.000+02:00',
        endDate: '2021-07-05T23:59:59.999+02:00',
        rewardDescription: null,
        rewardInfo: null,
        target: 0,
        contenders: 1,
        withNudging: false,
        rules: [
            {
                id: null,
                name: 'rule 1',
                image: null,
                imageRequired: false,
                gameDescriptors: [1, 2, 3, 4, 5],
                maxTimesFired: 1,
                minDaysBetweenFire: 0,
                conditions: [
                    {
                        property: 1,
                        operator: 'STRICTLY_GREATER',
                        value: '1'
                    }
                ],
                points: []
            }
        ],
        circles: [0]
    };
    const response = await client.challenge().postChallenge(challenge);
    console.log(response);
}
async function testParseNewest() {
    const client = new DBClient();
    client.initialize();
    client.cleanFileParseEvents();
    client.close();

    // first run, so updated
    console.log('Should be filled');
    let fdParser = new FoodDiaryParser(
        'test/services/data/foodDiary_standard_missing_table.xlsx',
        dummyUserInfo
    );
    fdParser.parseOnlyNewest(true);
    await fdParser.process();
    console.log(fdParser.getData(OutputDataType.FOOD));

    // second run with same file, no data should show up
    console.log('Should be empty');
    fdParser = new FoodDiaryParser(
        'test/services/data/foodDiary_standard_missing_table.xlsx',
        dummyUserInfo
    );
    fdParser.parseOnlyNewest(true);
    await fdParser.process();
    console.log(fdParser.getData(OutputDataType.FOOD));
}

function cleanParses() {
    const dbClient = new DBClient();
    dbClient.cleanFileParseEvents();
    dbClient.close();
}

function addMoods(pId: string, gbAccessToken: string) {
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

function addNightScout(check: boolean) {
    if (!check) {
        console.log('turn on');
        return;
    }
    const entries: NightScoutEntryModel[] = [
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:00',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 79,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:05',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 81,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:10',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 85,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:15',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 86,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:20',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 84,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:25',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 83,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:30',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 81,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:35',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 78,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:40',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 76,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        },
        {
            type: 'sgv',
            date: parseDate(
                '14-06-2021 13:45',
                DateFormat.ENDPOINT_DATETIME,
                new Date(),
                true
            ) as number,
            sgv: 73,
            noise: 0,
            filtered: 0,
            unfiltered: 0,
            rssi: 0
        }
    ];

    const insulin: NightScoutTreatmentModel[] = [
        {
            eventType: 'Correction Bolus',
            created_at: '2021-06-14T12:01:00',
            insulin: 4,
            notes: 'before lunch',
            enteredBy: 'Frans'
        },
        {
            eventType: 'Correction Bolus',
            created_at: '2021-06-14T13:15:00',
            insulin: 2,
            notes: 'correction',
            enteredBy: 'Frans'
        }
    ];

    const nsClient = new NightScoutClient(
        'https://nightscout-sep.herokuapp.com',
        'rink-27f591f2e4730a68'
    );

    entries.forEach((entry) => {
        nsClient.postEntry(entry);
    });
    insulin.forEach((insulin) => {
        nsClient.postTreatment(insulin);
    });
}

export const testToken = '';
//testAbbott();
//testExcel();
//testOneDrive();
//testNightScout();
//addNightScout(false); // set to true to add, prevents accidental double adding
//testParseNewest();
const pId = '';
const accessToken = '';
//addMoods(pId, accessToken);
