import assert from 'assert';
import { getUnixTime, parse } from 'date-fns';
import { glucoseModel } from '../../src/gb/models/glucoseModel';
import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import { DateFormat } from '../../src/services/dateParser';
import UnitConverter from '../../src/services/unitConverter';

export function runGlucoseTests(abbottEUParser: AbbottParser, abbottUSParser: AbbottParser): void {
    testAbbottEUGlucoseImport(abbottEUParser);
    testAbbottUSGlucoseImport(abbottUSParser);
}

function testAbbottEUGlucoseImport(abbottEUParser: AbbottParser) {
    // TODO: does not match, expected: 6.4, actual: 6
    let expectedResult: glucoseModel = {
        glucoseLevel: 6.4,
        timestamp: getUnixTime(parse('25/01/2020 14:53', DateFormat.ABBOTT_EU, new Date()))
    };
    assert.deepStrictEqual(
        abbottEUParser.getData(AbbottDataType.GLUCOSE),
        [expectedResult],
        'Abbott EU Glucose does not match expected result'
    );
}

function testAbbottUSGlucoseImport(abbottUSParser: AbbottParser) {
    let expectedResult: glucoseModel = {
        glucoseLevel: UnitConverter.convertMG_DLtoMMOL_L(82),
        timestamp: getUnixTime(parse('11-29-2018 11:24 AM', DateFormat.ABBOTT_US, new Date()))
    };
    assert.deepStrictEqual(
        abbottUSParser.getData(AbbottDataType.GLUCOSE),
        [expectedResult],
        'Abbott US Glucose does not match expected result'
    );
}
