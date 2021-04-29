import AbbottParser, { AbbottDataType } from './abbottParser';

async function testAbbott() {
    const abbottParser: AbbottParser = new AbbottParser('src/services/glucose/glucose_data_abbott_us.csv');
    // Currently this step is required since reading the file is async
    await abbottParser.process();
    // Print data for debugging
    console.log(abbottParser.getData(AbbottDataType.FOOD));
    console.log(abbottParser.getData(AbbottDataType.GLUCOSE));
}

testAbbott();
