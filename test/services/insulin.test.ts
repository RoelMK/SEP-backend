import { InsulinModel, InsulinType } from '../../src/gb/models/insulinModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { parseAbbott, parseFoodDiary } from './parseUtils';

test('import Abbott EU insulin', async () => {
    const expectedResult: InsulinModel = {
        insulinAmount: 9,
        insulinType: InsulinType.RAPID,
        timestamp: parseDate('01/03/2021 14:36', DateFormat.ABBOTT_EU, new Date(), true) as number
    };
    expect(
        await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.INSULIN)
    ).toStrictEqual([expectedResult]);
});

test('import Abbott US insulin', async () => {
    const expectedResult: InsulinModel = {
        insulinAmount: 14,
        insulinType: InsulinType.RAPID,
        timestamp: parseDate(
            '11-29-2018 11:34 AM',
            DateFormat.ABBOTT_US,
            new Date(),
            true
        ) as number
    };
    expect(
        await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.INSULIN)
    ).toStrictEqual([expectedResult]);
});

// check first row of standard (non missing) food diary test file
test('import standardized food diary insulin values full', async () => {
    const expectedResult: InsulinModel = {
        insulinAmount: 7,
        insulinType: InsulinType.RAPID,
        timestamp: parseDate('09/05/21 20:43', DateFormat.FOOD_DIARY, new Date(), true) as number
    };
    expect(
        (
            (await parseFoodDiary(
                'test/services/data/foodDiary_standard.xlsx',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[0]
    ).toStrictEqual(expectedResult);
});

// check third row of standard, missing food diary test file
test('import standardized food diary insulin values with missing values', async () => {
    const expectedResult: InsulinModel = {
        insulinAmount: 4,
        insulinType: InsulinType.RAPID,
        timestamp: parseDate('08/05/21 12:01', DateFormat.FOOD_DIARY, new Date(), true) as number
    };
    expect(
        (
            (await parseFoodDiary(
                'test/services/data/foodDiary_standard_missing.xlsx',
                OutputDataType.INSULIN
            )) as InsulinModel[]
        )[1]
    ).toStrictEqual(expectedResult);
});
