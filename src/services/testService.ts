import AbbottParser from './dataParsers/abbottParser';
import { OutputDataType } from './dataParsers/dataParser';
import FoodDiaryParser from './dataParsers/foodDiaryParser';

async function testAbbott() {
    //const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
    const abbottParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
    // Currently this step is required since reading the file is async
    await abbottParser.process();
    // Print data for debugging
    //console.log(abbottParser.getData(OutputDataType.FOOD));
    //console.log(abbottParser.getData(OutputDataType.GLUCOSE));
    console.log(abbottParser.getData(OutputDataType.INSULIN));
}

async function testExcel() {
    var testPath = 'test/services/data/foodDiary_standard_missing.xlsx'
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(true, testPath);
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD));
}

testAbbott();
testExcel();
