import { GlucoseModel, GlucoseUnit } from '../../src/gb/models/glucoseModel';
import { AbbottData } from '../../src/services/dataParsers/abbottParser';
import { OutputDataType } from '../../src/services/dataParsers/dataParser';
import { GlucoseSource } from '../../src/services/glucose/glucoseParser';
import { DateFormat, parseDate } from '../../src/services/utils/dates';
import { convertMG_DLtoMMOL_L } from '../../src/services/utils/units';
import { parseAbbott, parseNightScout, postGlucoseData } from '../testUtils/parseUtils';
import { NightScoutEntryModel } from '../../src/services/dataParsers/nightscoutParser';
import GlucoseMapper from '../../src/services/glucose/glucoseMapper';

describe('Abbott glucose', () => {
    /**
     * UTP: GLU - 1
     */
    test('import Abbott EU glucose', async () => {
        const expectedResult: GlucoseModel[] = [
            {
                glucoseLevel: 6.4,
                timestamp: parseDate(
                    '25/01/2020 14:53',
                    DateFormat.ABBOTT_EU,
                    new Date(),
                    true
                ) as number
            },
            {
                glucoseLevel: 5.8,
                timestamp: parseDate(
                    '25/01/2020 14:58',
                    DateFormat.ABBOTT_EU,
                    undefined,
                    true
                ) as number
            },
            {
                glucoseLevel: 4,
                timestamp: parseDate(
                    '25/01/2020 15:03',
                    DateFormat.ABBOTT_EU,
                    undefined,
                    true
                ) as number
            }
        ];
        expect(
            await parseAbbott('test/services/data/abbott_eu.csv', OutputDataType.GLUCOSE)
        ).toStrictEqual(expectedResult);
    });

    /**
     * UTP: GLU - 2
     */
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
});

describe('POST glucose', () => {
    /**
     * UTP: GEX - 1
     */
    test('POSTing glucosemodels', async () => {
        const glucose: AbbottData[] = [
            {
                device: '',
                serial_number: '',
                device_timestamp: '01/01/2020 00:00',
                record_type: '0',
                historic_glucose_mg_dl: '',
                historic_glucose_mmol_l: '6',
                scan_glucose_mg_dl: '',
                scan_glucose_mmol_l: '',
                non_numeric_rapid_acting_insulin: '',
                rapid_acting_insulin__units_: '',
                non_numeric_food: '',
                carbohydrates__grams_: '',
                carbohydrates__servings_: '',
                non_numeric_long_acting_insulin: '',
                long_acting_insulin__units_: '',
                long_acting_insulin_value__units_: '',
                notes: '',
                strip_glucose_mg_dl: '',
                strip_glucose_mmol_l: '',
                ketone_mmol_l: '',
                meal_insulin__units_: '',
                correction_insulin__units_: '',
                user_change_insulin__units_: ''
            }
        ];
        const response = await postGlucoseData(glucose, GlucoseSource.ABBOTT, DateFormat.ABBOTT_EU);
        // TODO: change response once implemented
        expect(response).toBe(undefined);
    });
});

describe('Nightscout glucose', () => {
    /**
     * UTP: GLU - 3
     */
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
        };

        const expectedResult: GlucoseModel[] = [
            {
                timestamp: 1622383144021,
                glucoseLevel: convertMG_DLtoMMOL_L(79)
            }
        ];
        expect(await parseNightScout([testNSGlucose], [], OutputDataType.GLUCOSE)).toStrictEqual(
            expectedResult
        );
    });
});

describe('Glucose mapper', () => {
    /**
     * UTP: GLU - 4
     */
    test('unsupported glucose source', () => {
        new GlucoseMapper(); // test if class is error-free and can be created
        expect(() => {
            GlucoseMapper.mapGlucose(
                'nonsense' as unknown as GlucoseSource,
                DateFormat.FOOD_DIARY,
                GlucoseUnit.UNDEFINED
            );
        }).toThrow('Glucose source not implemented!');
    });
});
