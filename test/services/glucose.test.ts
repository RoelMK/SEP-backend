import { parse } from 'date-fns';
import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { AbbottDataType } from '../../src/services/abbottParser';
import { DateFormat } from '../../src/services/utils/dates';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { parseAbbott } from './parseUtils';

test('import Abbott EU glucose', async () => {
    let expectedResult: GlucoseModel = {
        glucoseLevel: 6.4,
        timestamp: parse('25/01/2020 14:53', DateFormat.ABBOTT_EU, new Date()).getTime()
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', AbbottDataType.GLUCOSE)).toStrictEqual([
        expectedResult
    ]);
});

test('import Abbott US glucose', async () => {
    let expectedResult: GlucoseModel = {
        glucoseLevel: convertMG_DLtoMMOL_L(82),
        timestamp: parse('11-29-2018 11:24 AM', DateFormat.ABBOTT_US, new Date()).getTime()
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', AbbottDataType.GLUCOSE)).toStrictEqual([
        expectedResult
    ]);
});
