import { getUnixTime, parse } from 'date-fns';
import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { DateFormat, getDateFormat } from '../../src/services/utils/dates';
import { parseAbbott, parseFoodDiary } from './parseUtils';

test('import Abbott EU insulin', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 9,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('01/03/2021 14:36', DateFormat.ABBOTT_EU, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.INSULIN)).toStrictEqual([
        expectedResult
    ]);
});

test('import Abbott US insulin', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 14,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('11-29-2018 11:34 AM', DateFormat.ABBOTT_US, new Date()))
    };
    expect(await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.INSULIN)).toStrictEqual([
        expectedResult
    ]);
});

// check first row of standard (non missing) food diary test file
test('import standardized food diary insulin values full', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 7,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('09/05/21 20:43', DateFormat.FOOD_DIARY, new Date()))
    };
    expect((await parseFoodDiary('test/services/data/foodDiary_standard.xlsx', OutputDataType.INSULIN) as InsulinModel[])[0]).toStrictEqual(expectedResult);
});

// check third row of standard, missing food diary test file
test('import standardized food diary insulin values with missing values', async () => {
    let expectedResult: InsulinModel = {
        insulinAmount: 4,
        insulinType: InsulinType.RAPID,
        timestamp: getUnixTime(parse('08/05/21 12:01', DateFormat.FOOD_DIARY, new Date()))
    };
    expect((await parseFoodDiary('test/services/data/foodDiary_standard_missing.xlsx', OutputDataType.INSULIN) as InsulinModel[])[1]).toStrictEqual(expectedResult);
});
