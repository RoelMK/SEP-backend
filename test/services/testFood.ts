import foodModel from '../../src/gb/models/foodModel';
import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import { parse, getUnixTime } from 'date-fns';
import assert from 'assert';
import { DateFormat } from '../../src/services/dateParser';

export function runFoodTests(abbottEUParser: AbbottParser, abbottUSParser: AbbottParser): void {
    testAbbottEUFoodImport(abbottEUParser);
    testAbbottUSFoodImport(abbottUSParser);
}

function testAbbottEUFoodImport(abbottEUParser: AbbottParser) {
    let expectedResult: foodModel = {
        calories: 404,
        description: '',
        timestamp: getUnixTime(parse('15/01/2021 13:13', DateFormat.ABBOTT_EU, new Date()))
    };
    assert.deepStrictEqual(
        abbottEUParser.getData(AbbottDataType.FOOD),
        [expectedResult],
        'Abbott EU Food does not match expected result'
    );
}

function testAbbottUSFoodImport(abbottUSParser: AbbottParser) {
    let expectedResult: foodModel = {
        calories: 480,
        description: '',
        timestamp: getUnixTime(parse('11-29-2018 11:29 AM', DateFormat.ABBOTT_US, new Date()))
    };
    assert.deepStrictEqual(
        abbottUSParser.getData(AbbottDataType.FOOD),
        [expectedResult],
        'Abbott US Food does not match expected result'
    );
}
