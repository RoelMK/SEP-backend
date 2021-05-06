import FoodModel from '../../src/gb/models/FoodModel';
import { parse, getUnixTime } from 'date-fns';
import { DateFormat } from '../../src/services/utils/dates';
import { parseAbbott } from './parseUtils';
import { AbbottDataType } from '../../src/services/AbbottParser';

test('import Abbott EU food', async () => {
    let expectedResult: FoodModel = {
        calories: 404,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});

test('import Abbott US food', async () => {
    let expectedResult: FoodModel = {
        calories: 480,
        description: '',
        timestamp: getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});