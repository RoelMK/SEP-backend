import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { parseAbbott } from './parseUtils';

test('import Abbott EU glucose', async () => {
    const expectedResult: GlucoseModel = {
        glucoseLevel: 6.4,
        timestamp: parseDate('25/01/2020 14:53', DateFormat.ABBOTT_EU, new Date(), true) as number
    };
    expect(
        await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.GLUCOSE)
    ).toStrictEqual([expectedResult]);
});

test('import Abbott US glucose', async () => {
    const expectedResult: GlucoseModel = {
        glucoseLevel: convertMG_DLtoMMOL_L(82),
        timestamp: parseDate(
            '11-29-2018 11:24 AM',
            DateFormat.ABBOTT_US,
            new Date(),
            true
        ) as number
    };
    expect(
        await parseAbbott('test/services/data/abbott_us.csv', OutputDataType.GLUCOSE)
    ).toStrictEqual([expectedResult]);
});
