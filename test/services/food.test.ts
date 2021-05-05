import FoodModel from '../../src/gb/models/FoodModel';
import AbbottParser, { AbbottDataType } from '../../src/services/AbbottParser';
import { parse, getUnixTime } from 'date-fns';
import { DateFormat } from '../../src/services/utils/dates';

test('import Abbott EU food', async () => {
    const abbottEUParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
    await abbottEUParser.process();
    let expectedResult: FoodModel = {
        calories: 404,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(abbottEUParser.getData(AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});

test('import Abbott US food', async () => {
    const abbottUSParser: AbbottParser = new AbbottParser('test/services/data/abbott_us.csv');
    await abbottUSParser.process();
    let expectedResult: FoodModel = {
        calories: 480,
        description: '',
        timestamp: getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(abbottUSParser.getData(AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});
