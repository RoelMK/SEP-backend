import { GlucoseModel } from '../../src/gb/models/glucoseModel';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { NightScoutEntryModel } from '../../src/services/dataParsers/nightscoutParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { parseAbbott, parseNightScout } from './parseUtils';

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

test('import mocked Nightscout response with glucose', async () => {
    const testNSGlucose: NightScoutEntryModel = {
        _id: '60b39a3a6e65983173dc66f4',
        type: 'sgv',
        date: 1622383144021,
        sgv: 79,
        noise: 0,
        filtered: 0,
        unfiltered: 0,
        rssi: 0,
        utcOffset: 0,
        sysTime: '2021-05-30T13:59:22.001Z'
      }

    const expectedResult: GlucoseModel[] = [{
        timestamp: 1622383144021,
        glucoseLevel: convertMG_DLtoMMOL_L(79)
    }]
    expect(
       await parseNightScout([testNSGlucose], [], OutputDataType.GLUCOSE)
    ).toStrictEqual(expectedResult);
});
