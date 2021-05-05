import assert from 'assert';
import { getUnixTime, parse } from 'date-fns';
import { insulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import { DateFormat } from '../../src/services/dateParser';

export function runInsulinTests(abbottEUParser: AbbottParser, abbottUSParser: AbbottParser): void {
    testAbbottEUInsulinImport(abbottEUParser);
    testAbbottUSInsulinImport(abbottUSParser);
}

function testAbbottEUInsulinImport(abbottEUParser: AbbottParser) {
    let expectedResult: insulinModel = {
        insulinAmount: 9,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('01/03/2021 14:36', DateFormat.ABBOTT_EU, new Date()))
    };
    assert.deepStrictEqual(
        abbottEUParser.getData(AbbottDataType.INSULIN),
        [expectedResult],
        'Abbott EU Insulin data does not match expected result'
    );
}

function testAbbottUSInsulinImport(abbottUSParser: AbbottParser) {
    let expectedResult: insulinModel = {
        insulinAmount: 14,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('11-29-2018 11:34 AM', DateFormat.ABBOTT_US, new Date()))
    };
    assert.deepStrictEqual(
        abbottUSParser.getData(AbbottDataType.INSULIN),
        [expectedResult],
        'Abbott US Insulin data does not match expected result'
    );
}
