/* eslint-disable @typescript-eslint/no-unused-vars */
import { DBClient } from '../db/dbClient';
import { GameBusToken } from '../gb/auth/tokenHandler';
import { NightScoutClient } from '../nightscout/nsClient';
import AbbottParser from './dataParsers/abbottParser';
import {OutputDataType } from './dataParsers/dataParser';
import FoodDiaryParser from './dataParsers/foodDiaryParser';
import NightscoutParser, {
    NightScoutEntryModel,
    NightScoutTreatmentModel
} from './dataParsers/nightscoutParser';
import ExcelParser from './fileParsers/excelParser';

const dummyUserInfo: GameBusToken = {
    playerId: '1',
    accessToken: '12345',
    refreshToken: '67890'
};

async function testAbbott() {
    //const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
    const abbottParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv', dummyUserInfo);
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
        'Documents/DeepFolder/diary.xlsx',
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
        dummyUserInfo,
        '' // TODO why don't you need a token to get entry data??
    );
    await nsParser.process();
    console.log(nsParser.getData(OutputDataType.FOOD));
    console.log(nsParser.getData(OutputDataType.INSULIN));
    console.log(nsParser.getData(OutputDataType.GLUCOSE));
}

async function testParseNewest() {
    const client = new DBClient();
    client.initialize();
    client.cleanFileParseEvents();
    client.close();

    // first run, so updated
    console.log('Should be filled');
    let fdParser = new FoodDiaryParser('test/services/data/foodDiary_standard_missing_table.xlsx', dummyUserInfo);
    fdParser.parseOnlyNewest(true);
    await fdParser.process();
    console.log(fdParser.getData(OutputDataType.FOOD));

    // second run with same file, no data should show up
    console.log('Should be empty');
    fdParser = new FoodDiaryParser('test/services/data/foodDiary_standard_missing_table.xlsx', dummyUserInfo);
    fdParser.parseOnlyNewest(true);
    await fdParser.process();
    console.log(fdParser.getData(OutputDataType.FOOD));
}

export const testToken = '';
//testAbbott();
//testExcel();
//testOneDrive();
//testNightScout();
testParseNewest();
