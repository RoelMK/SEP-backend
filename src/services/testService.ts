import AbbottParser, { AbbottDataType } from './abbottParser';
import FoodDiaryParser from './foodDiaryParser';

async function testAbbott() {
    const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_eu.csv');
    // Currently this step is required since reading the file is async
    await abbottParser.process();
    // Print data for debugging
    //console.log(abbottParser.getData(AbbottDataType.FOOD));
    //console.log(abbottParser.getData(AbbottDataType.GLUCOSE));
    console.log(abbottParser.getData(AbbottDataType.INSULIN));
}

async function testExcel() {
    var testPath = 'src/services/food/foodDiary_standard.xlsx'
    console.log(await new FoodDiaryParser(testPath).process())
}

//testAbbott();
testExcel();
