import FoodModel from '../../src/gb/models/foodModel';
import { parse, getUnixTime } from 'date-fns';
import { DateFormat } from '../../src/services/utils/dates';
import { parseAbbott, parseEetmeter } from './parseUtils';
import { AbbottDataType } from '../../src/services/abbottParser';

test('import Abbott EU food', async () => {
    let expectedResult: FoodModel = {
        calories: 404,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date())) * 1000
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});

test('import Abbott US food', async () => {
    let expectedResult: FoodModel = {
        calories: 480,
        description: '',
        timestamp: getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date())) * 1000
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', AbbottDataType.FOOD)).toStrictEqual([expectedResult]);
});

test('import single Eetmeter entry', async () => {
    let expectedResult = [{
        timestamp: 1622876400000,
        calories: 27.92,
        carbohydrates: 6.98,
        fat: 4.72,
        saturatedFat: 0.52,
        salt: 1.31,
        sugars: 0.98,
        water: 46.5,
        description: 'Vegetarische balletjes'
    }]
    
      var result = await parseEetmeter('test/services/data/eetmeter.xml')
    expect(result).toStrictEqual(expectedResult);
});

test('import many Eetmeter entries', async () => {
    let expectedResult = [{
        timestamp: 1622876400000,
        calories: 27.92,
        carbohydrates: 6.98,
        fat: 4.72,
        saturatedFat: 0.52,
        salt: 1.31,
        sugars: 0.98,
        water: 46.5,
        description: 'Vegetarische balletjes'
      },
      {
        timestamp: 1622876400000,
        calories: 46,
        carbohydrates: 11.5,
        fat: 1.75,
        saturatedFat: 0.25,
        salt: 1.42,
        sugars: 2,
        water: 228,
        description: 'Vegetable soup'
      }];
    
      var result = await parseEetmeter('test/services/data/eetmeterMany.xml')
    expect(result).toStrictEqual(expectedResult);
});