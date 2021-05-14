import AbbottParser from './dataParsers/abbottParser';
import { DataSource, OutputDataType } from './dataParsers/dataParser';
import FoodDiaryParser from './dataParsers/foodDiaryParser';
import OneDriveExcelParser from './fileParsers/oneDriveExcelParser';

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
    var testPath = 'test/services/data/foodDiary_standard_missing.xlsx'
    var wrongTestPath = 'test/services/data/abbott_eu.csv';

    try{
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(true, wrongTestPath);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    }catch(e){
        console.log(e.message);
    }
}

async function testOneDrive() {
    var testPath = 'smthonaonedrive.xlsx'
    console.log(await new OneDriveExcelParser().parse(testPath, DataSource.FOOD_DIARY, 'token'))
    /** TODO
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(true, testPath, 'token');
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD)); */
}


//testAbbott();
//testExcel();
testOneDrive();
