/* eslint-disable @typescript-eslint/no-unused-vars */
import { TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';
import { ChallengeReference } from '../gb/models/gamebusModel';
import { InsulinModel, InsulinType } from '../gb/models/insulinModel';
import { MoodModel } from '../gb/models/moodModel';
import { NightScoutClient } from '../nightscout/nsClient';
import AbbottParser from './dataParsers/abbottParser';
import { OutputDataType } from './dataParsers/dataParser';
import FoodDiaryParser from './dataParsers/foodDiaryParser';
import NightscoutParser, {
    NightScoutEntryModel,
    NightScoutTreatmentModel
} from './dataParsers/nightscoutParser';

async function testAbbott() {
    //const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
    const abbottParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
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
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(wrongTestPath);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    } catch (e) {
        console.log(e.message);
    }
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(testPath);
    await foodDiaryParser.process();

    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD));
}

async function testOneDrive() {
    //var testPath = 'smthonaonedrive.xlsx'
    //console.log(await new OneDriveExcelParser().parse(testPath, DataSource.FOOD_DIARY, 'token'))

    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(
        'Documents/DeepFolder/diary.xlsx',
        testToken
    );
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD));
}

async function testNightScout() {
    const testEntry: NightScoutEntryModel = {
        type: 'sgv',
        date: 1622383144021,
        sgv: 79,
        noise: 0,
        filtered: 0,
        unfiltered: 0,
        rssi: 0
    };

    const testTreatmentInsulin: NightScoutTreatmentModel = {
        eventType: 'Correction Bolus',
        created_at: '2021-05-29',
        insulin: 4,
        notes: 'BlablaTest',
        enteredBy: 'Frans'
    };

    const testTreatmentFood: NightScoutTreatmentModel = {
        eventType: 'Carb correction',
        created_at: '2021-05-29',
        carbs: 20,
        protein: 20,
        fat: 20,
        notes: 'BlablaTestFood',
        enteredBy: 'Jan'
    };

    const nsClient = new NightScoutClient(
        'https://nightscout-sep.herokuapp.com',
        'rink-27f591f2e4730a68'
    );
    await nsClient.postEntry(testEntry);
    await nsClient.postTreatment(testTreatmentFood);

    console.log(await nsClient.getEntries());
    //console.log(await nsClient.getTreatments());
    console.log('Glucose in the unit: ' + (await nsClient.getGlucoseUnit()));

    const nsParser: NightscoutParser = new NightscoutParser(
        'https://nightscout-sep.herokuapp.com',
        '' // TODO why don't you need a token to get entry data??
    );
    await nsParser.process();
    console.log(nsParser.getData(OutputDataType.FOOD));
    console.log(nsParser.getData(OutputDataType.INSULIN));
    console.log(nsParser.getData(OutputDataType.GLUCOSE));
}

async function testGb() {
    const client = new GameBusClient(new TokenHandler('TOKEN_HERE', '', '526'));
    const challenge: any = {
        name: 'challenge name 4',
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
        circles: [100784]
    };
    const response = await client.challenge().postChallenge(challenge);
    console.log(response);
}

export const testToken = '';
//testAbbott();
//testOneDrive();
//testNightScout();
testGb();
