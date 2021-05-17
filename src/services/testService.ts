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
    }
}

async function testOneDrive() {
    //var testPath = 'smthonaonedrive.xlsx'
    //console.log(await new OneDriveExcelParser().parse(testPath, DataSource.FOOD_DIARY, 'token'))
    


    const foodDiaryParser: FoodDiaryParser = new FoodDiaryParser("Documents/DeepFolder/diary.xlsx", 'EwBwA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAAaNMms8eNmD8qOZL01UBJxVTKEGS1p4Mhv1qPcUPx7WjllxxNyUPtHjgOK24PdIuSg7Q1XXwTx1BfZnEMaT+J9CMKVGRCgBImO5AMe5VFg+c1Y9Mk7n07T9XR/k1+ZFPAx541F1hM2uAO4IyVXU33MjxCZVf1kxip/O5RFaLnqJJTJd6A8gj0RLd3RO0rI2nIy8YQTMYvBTa9XT+1E9tKhbo2d7MUl+rUwxVU5HqXqFauZQNIyT5QVHl1pp8yWOeeBg5Y/rJs2BFIV6IhVbNN67hfCKeTzO5RZyaguDKlyBJRG9jaun4+T99DkQTUCO57/smgTzUdIdEyKiSyJ0IXy0DZgAACK7ZtiSeUf1rQALqmdmes0gO1vMtR174rWxKaTHcUEeDeSwROpuLAw5ByT3yFQZaBnpgB46/e8S2hIE2gKk4q+aJFjfqB0pNztL4j+ynp9DB7VQxrenHqaej885PPVKkfA3LLWxNISrFz4rylRRLK6qrwn2sEdOakwsC2ui3oH7+IVILcyt7fEthxPkxypAoyzg+CAGAb4HHg1x9vaHZ11dFkLDH9O4L1gbpyq8WsiijB/oKYrZ4U7eIofGTTMoGH2oxVMHY71ADuIRpJuuDZl3Jaly+jItVMVpwUcRdkC2GyxuDu2u69Pb7ywFuP5LAZMOxaq3VrfMzX/TZUGc92ToDDk6i67v7n47KE2h5kJkdv0874+V86MSdLkpR2hjii/0pVjPIR5LImHAehceXDV8EzOUNf3jdGMonuMq7zYM6u1UvfvmifJvUKBJXAmtz9mxb/iI0gQ2jb+5F2vGrPQ3gui2WUUUt9Aex/i2zWNp6La259CL5vTefXRd55DGtqdta8iBu9M255XeZDq5YFgsLlDTGPS1gwp7YHknTxOyCHQMsmkINLVFR172xrZ6sb8bUdr0FL2bQfPH/waVmE96UVao3bgDRZm+qpdpVERizUp2MbU4GrzzUlUEGXHhn+dTZsoaYgeMxpHa2lPYXAMVHEaKt3AOajrM1lggNI2UcBPuV/LWxkEGufZTvMp+2OE5Phgdb+Okwvcgr6ABCPDpZwKumi7DgeyF/i6ydf/XJnkGq62nc+I8yaDb5eV9szjqhYGFvOrpHNXKHAg==');
    await foodDiaryParser.process();
    console.log(foodDiaryParser.getData(OutputDataType.INSULIN));
    console.log(foodDiaryParser.getData(OutputDataType.FOOD)); 
}


//testAbbott();
//testExcel();
testOneDrive();
