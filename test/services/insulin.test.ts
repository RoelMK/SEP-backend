import { getUnixTime, parse } from 'date-fns';
import { InsulinModel, InsulinType } from '../../src/gb/models/InsulinModel';
import { AbbottDataType } from '../../src/services/AbbottParser';
import { DateFormat } from '../../src/services/utils/dates';
import { parseAbbott } from './parseUtils';

test('import Abbott EU insulin', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 9,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('01/03/2021 14:36', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', AbbottDataType.INSULIN)).toStrictEqual([
        expectedResult
    ]);
});

test('import Abbott US insulin', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 14,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('11-29-2018 11:34 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', AbbottDataType.INSULIN)).toStrictEqual([
        expectedResult
    ]);
});
