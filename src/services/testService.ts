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
    
    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser("Documents/DeepFolder/diary.xlsx",     
    'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAdXNQbUC8VaqUFyfuQr7XzwQWO5LRgsah47F7TddyOYXlUq/S0T/EntukYFjn56MtJIuH0DHFCpuIg+JmjhOjwJPsHIXoRKKmG+KYsnTaTw8oPW8AuccfEOvqFXNJF5qPqDcK1NpB6iY56eid33ofFBg4MnAMQ7CrmUU8TIPH72eVOI5ahgtf3XYIPYQdaezYTg6b7OvgD3TC8fmwDnWHUqr9+W7gwtmfwUMsNtWu0aVOofwUHBhrjclImW5oASINDpEuqdBoIShBgkkzhjq9Ti9CEB6bWPWtgIPxTM40AhWRDyxlDPCYmIx+vz85Gs1olj9CagaaoSosFl0nDykEJADZgAACAexfBs+liNBQAKxABxvdzQ6N37PNejLAfw9fbHBBVh5z19kLKWST0Gm7tEdJtTq1IgmQEO7hObcrbULA9FEFd3qdzXkoeDQgPgoj1GZ/SG+6pNwCnB/qGV/gPMp1CRQ5/CL8J0Dbn3UR3UxA+RQ4FakIrz8HSVNjKWcO08fGtNtehE4nBAIJr6yoOijNdS8/6fW5K6gmotDWxKF1GfA2XykxHwRpB+mYtp0wBPjo+Z/y/RnC3YMBgHJ5f2XavGzOoKbAw9p/Zylo2g3CEWxH2ujsbJaDKR6FhsREABWNFtavwy+bmzYjV8Ybe7PD4huuRw0Nh24MVRVIWBi/zlOo0oe4NSs8/fjgrlXIbTyKUFvpxGOZX4IeWgsIvonxIR5FX3xVzS31vkSWqoRIdTAC8KMBhKq/q9Ls0ojPQ/GMuTQ+026AgRF3i6w0maZF+DzRBe9RUopiSek+8L4Qu5p4G8udPOEJwG/XgyI2OQRB4tei2MTL4tYhZQ40kTp6wKrupwj+FTywCpcaB1J/CiuD984XsZOD9PYoVsgultU+gu+q/MC25wZ1ZaLaY7cQ2V/3wZc4fU0c7zjFU4q9UNAcDi1HrELT6D8N4+rghZZdNcHmUvCfJ2NxmlGfT1Q9zml1YIBN7wlXUwGn+H2SjYR5iSmIbIHqL9Lbz4S2YVOTmcUtEf5Z0R+cBmYPskOavEAAYQzZ5JM99CcpWfAItqlDHtV3+pqM7vKHraODAOz1YI48Y0Ghop+B+PMOeNxY7pgFEYx4b3ZLGwhLhKHAg==');
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD)); 
}


//testAbbott();
testExcel();
//testOneDrive();
