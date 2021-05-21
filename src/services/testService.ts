/* eslint-disable @typescript-eslint/no-unused-vars */
import AbbottParser from './dataParsers/abbottParser';
import { OutputDataType } from './dataParsers/dataParser';
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

export const testToken = 'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAZMpzclSGcxFbttcJHqxck74wYsTuOunXq2TqIiDC+hl7KMqayvjY22Qtpv+oE9p7KGxiipWuoemqlqNmTD6l9RKHUIlqvWdtvGT3qOC/xayLt3yM8yc52izl6HFg+jBvE2tr5RaDGsIFjtZanCYfww9MtqkeTJFG+ddZ+ZdASlkSgcCkHd1hCtsbQXEp9Tpj3Hwopflj0234FMwGq7C8/zFaUmRb6puOzuUnrcUwYJzjC8ROr1JBBHqaQ3/lBtpn9brUsEWaO73WXlPmdYI0ZiGqVx8+NUqZswK3k5VuKwg8vkYfN1zXUvmK6TfHsp7a/jjh+t0fpNw5J8AA0jcnGIDZgAACE0CNDkEgSaOQALL5e7J5NynK0TrCTauAfaP5W+9y+iU9Tcg79Wc0gvBGPFbIRJK9KwjMj/MDgxxPIn5MyqqkQwLTjQPsRo/ri7d/N3lmiVtXqQGLk78DfYao6cqm8l/V4NMz2BksAdBbuQJiWDFYlh9YQnrLRI9/QQjmRNlPWXYdnxgECtUyBXPsPXpQfjr+7mbZZdO0WpHXeiADbrKj9EMXuULRzr1P5S1FGQa42cDMvaF6kCud0RQkT3g4MC17EvlJRO3Jr/FEIcwcDrqg7e/JsHMbscuzUE0OWRpQnXuhkDVDgb3oMyiNykthjmdvdG9bLzubpm2W5hdBmgKe18O9YBQnRV74qg67DhhuI8xk8YKQf7lgr1+WqzhIkwh/+InDSSYfweXi9/kT+Ld+1p0EcJ2o5goeLA7JqmNF3F/13cewtqu+LDWCoTmfNLLJdAO1rg2hHgcL9QxB1cj24L8ChT0v4nvbcLIF9+i4wrIcLwt38PEGgamKm55U94+ZU/ZZnHB1ScBQPqeNly5RJaQ+nUHN9UtoQ1hRQTMJi0U5RiMlQLCku6i7ULv3OzPioI/oeQkZKwHhjY0n6HlaeyvkTzRpbmFTh6ZuVb5mQ73/ZD7We/n/PeEhqtc37Pm3TK3U9E1V5QdYKg+yNCbp+SXI/AXxtJAslYdA+vTuMiDtl9BL9vILkkp3wHl42y1M2un5CLMTHHrS6fXfEDmvzyACYP59JWqRz/BgTBdI11yJ6bocu957fs2l9yvcqMYS3znmgNvGewOs2qHAg==';
//testAbbott();
testExcel();
//testOneDrive();
