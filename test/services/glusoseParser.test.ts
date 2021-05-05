import { getUnixTime, parse } from 'date-fns';
import { glucoseModel } from '../../src/gb/models/glucoseModel';
import AbbottParser, { AbbottDataType } from '../../src/services/abbottParser';
import { DateFormat } from '../../src/services/dateParser';
import UnitConverter from '../../src/services/unitConverter';

test('import Abbott EU glucose', async () => {
    const abbottEUParser: AbbottParser = new AbbottParser('test/services/data/abbott_eu.csv');
    await abbottEUParser.process();
    let expectedResult: glucoseModel = {
        glucoseLevel: 6.4,
        timestamp: getUnixTime(parse('25/01/2020 14:53', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(abbottEUParser.getData(AbbottDataType.GLUCOSE)).toStrictEqual([expectedResult]);
});

test('import Abbott US glucose', async () => {
    const abbottUSParser: AbbottParser = new AbbottParser('test/services/data/abbott_us.csv');
    await abbottUSParser.process();
    let expectedResult: glucoseModel = {
        glucoseLevel: UnitConverter.convertMG_DLtoMMOL_L(82),
        timestamp: getUnixTime(parse('11-29-2018 11:24 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(abbottUSParser.getData(AbbottDataType.GLUCOSE)).toStrictEqual([expectedResult]);
});
