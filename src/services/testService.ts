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
        const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser(wrongTestPath);
        await foodDiaryParser.process();
        console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
        console.log(foodDiaryParser.getData(OutputDataType.FOOD));
    }catch(e){
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
    
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser("Documents/DeepFolder/diary.xlsx", testToken)    
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD)); 
}

export const testToken = 'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAfTQZNmxguz4Hh2fXr13qgmk2EBdUyEYE11rLfHYElNCI4pIiyypukYXIao23k5NdhUp0w2CezKTz6Xxplec0K5HXmPu2QiD+g7ZeqfswDO2lDUILSNvYih0OEh1M3prlHOc3XkJd45j1azgIBJPOUExQTq0LI0Df6Rb2wm+zs5Dr5xe1zJBXF2yfNiKhj2iylwDTwSRPDP6L77yRWF9JqYMpPx5xir1F5b4SAbphntCz0nudfc08VQk2T340ysY3lI4CznpFcsyvprlrF6S08n887qZP35rgXmMh7OcYdC7ZP43O7aVNDXGIGD0fwLrlm/QrlHHV7KZubRqrI1qxDEDZgAACGkIO0/FdGpdQAJC98Utw1KHZsBoPESbIxXj40MlN8SZ9B32cdqTFGfgHpNnACvmS2l9X+KpP3mrZfltrm2ojvAC38Tugac9nSknAZSBu6BAB+z2B4Yh+lOa+b2TBewifc2FGuXIhftU941qQK1A3jAx6XAk/icfqmanlmL537K2NyHQl+pkIy5JZpga+YKoSUCsYcVRtz2uTP1mb/N4GuBnjWGZoVVB4l/RRkqu85mLlrq0xXBGiqncr63QsVtWOGLe49GET3ViOveVC3WPd3E8Gh+A3flvKSVRc5qZNh4xM+JnpMkmhhC5PKXmtrv3jb92oZMjfum4+24wkhVng68fINfSOXD2ioo2epFQVlHbkP95ctybgIrCh/VaCwAwlprVpy9gfvP4cFQfstGyhgGZ4+c550uF2ewAXwaIbGoeo8XE4t+j23oE5yBagfw2t0Zn3HTTsVTXxXDaLTQQb8FDLpIWu6pXqLEvlFVdbFoHX8RsHcLrVFAudsoZ9WvCnhKDz4+0nGF/HRh8D63poBKc9KpQHi6LPRCStHHt1D6MC0yCzYG8ae0zgCAvxsL/Y/1UdCfQWDNUmqMRyS5NRD0GL3Hjd7nsuMAHKXKluxSM23S/cJHnthNRK/gB0Bv6TBl9FVuc9FFIIqfUlPrQ4jqN6KYyW/Nq9msjGvhmJDvMoRhEvJlDPty/okUVG5eWQ2f+Oz3uBG8klGh8pAViy3/Bm6iNfUxwxF2Y5KDc/aebqr+aTLu94CEzuMoWIy1hnHkcMLutq5IRl1OHAg==';

//testAbbott();
//testExcel();
testOneDrive();
