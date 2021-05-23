/* eslint-disable @typescript-eslint/no-unused-vars */
import { NightScoutClient } from '../nightscout/nsClient';
import AbbottParser from './dataParsers/abbottParser';
import { OutputDataType } from './dataParsers/dataParser';
import FoodDiaryParser from './dataParsers/foodDiaryParser';
import NightscoutParser, { NightScoutEntry } from './dataParsers/nightscoutParser';

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
    const testPath = 'test/services/data/foodDiary_standard_missing.xlsx';
    const wrongTestPath = 'test/services/data/abbott_eu.csv';

    try {
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(wrongTestPath);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    } catch (e) {
        console.log(e.message);
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(testPath);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    }
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
    const testEntry: NightScoutEntry = {
        type: 'sgv',
        date: 1621708895000,
        sgv: 100,
        noise: 0,
        filtered: 0,
        unfiltered: 0,
        rssi: 0
    };

    //const nsClient = new NightScoutClient("123456789012", "https://nightscout-sep.herokuapp.com", "rink-27f591f2e4730a68");
    //console.log(await nsClient.postEntry(testEntry))
    //console.log(await nsClient.getEntries())

    const nsParser: NightscoutParser = new NightscoutParser(
        '123456789012',
        'https://nightscout-sep.herokuapp.com',
        'rink-27f591f2e4730a68'
    );
    await nsParser.process()
    console.log(nsParser.getData(OutputDataType.GLUCOSE));
}

export const testToken = '';
//testAbbott();
//testExcel();
//testOneDrive();
testNightScout();
