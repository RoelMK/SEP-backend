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

export const testToken = 'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAZfu78oeHo+bqDXGhUb30EdUgZ9MraiPGxxQtlyv6fNaLdu21EzSztAhQumN0J708RLAm0KHmG6SVYxwOkaDmBA3WHf4QgRJuBCegaDF0y1nP/DhuAujgF8Nhi7LgP9+zPzOyTqNemPnTKM51caroafbp+3WVx/mTHPi2hXJk+Aw1wdsU1pk14pXS8Q1gCEDiuqXbPxEqyMOjhZU4IVrUQlm2XzNK5q7S0tub5uBAmfMrX0BfsFx/GAvjBSxWhmKOmJCNY5AcPCdIa+ibk60jRui5DGyyhXMvJnLn3HvZSulDKU6OIsduuniKFjEcNkUUaggRU77k5Vzg5YdW0EB0mUDZgAACOVNAJ70bOqaQALfDOF64dTEc2vaLh5WgSIKRJL1fyTezuDHxfUBSqVWseQRBtpDsIM/Ioroc9ZllZIW/VUo8WUPbOYoH3547fwZ6io+KvoGqlVf+lnYICY5kDHUyeISHjaKNCs1bkjV1EI2YlOYErB85QDbNT8FDOgW0a9BPhd24fzxszGEwesYey30mt2MeubR0NBa6D8BeoJG52OFmd2lZhIeXa5fsP9iFw1jgQ4oDKfw0K981YhL6mlPFcW1bhnOKJvU+wZ6lHXiwxw1SD6y3VYWDAOiWx2rv1UDR8kijmoIYKMNMFLZKnyFXAA5w/8ol5AOXXljsBKquVshuYP9OcgBEYqdqi9Ror6zqsEUaI7N5MsCCN4shIma5pc6+aae4q4NvSdsTyJB2OU3VInF+dIgYiEbuVb7h3pSIeIngBa8eXRG0j6hh5djTh7X1WS2tzxvuLgql4XAlvcU/ZRwwkw7s+enCGOn6xbC6P/EiCplBpqKT9DUvgSka0T2VvEsuxDyXz+9dQtcVBnyDYhM0rRZrdgW9UNZpKU8Eut2bMBBcfm/9skSxt5L20i4NazZEdJ6GLEDg7Vt+1TprZWVFkaoI0RE9SxEOo2wX2seWvJevQDC3872ffm9Pz+O6bA8uz6T26AQ5gzz4L2wJmivPBTDg2QQFfHtD9T2FKYbvjDfVmx2/CdfK+Ak6vX5oPWlYRYweEX1ro0o8hyZHcCO5J15IPNflOtWwJRP21FMlSzCjDsvlLDAwRIANl+coopXW7EUAQ4HTW+HAg==';
//testAbbott();
//testExcel();
//testOneDrive();
