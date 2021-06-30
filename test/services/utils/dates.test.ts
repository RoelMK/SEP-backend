import { parse, getUnixTime, format } from 'date-fns';
import {
    convertExcelDateTimes,
    DateFormat,
    fromUnixMsTime,
    getDateFormat,
    parseDate,
    parseExcelDate,
    parseExcelTime,
    validUnixTimestamp
} from '../../../src/services/utils/dates';

/**
 * UTP: DATE - 1
 */
describe('getting date format from string', () => {
    test('Getting date format from normal string', () => {
        const dateStringEU = '25/01/2020 14:53';
        const dateStringUS = '11-29-2018 11:24 AM';
        const dateStringEP = '29-11-2018';
        const dateStringWrong = '55-55-2018';

        expect(getDateFormat(dateStringEU)).toBe(DateFormat.ABBOTT_EU);
        expect(getDateFormat(dateStringUS)).toBe(DateFormat.ABBOTT_US);
        expect(getDateFormat(dateStringEP)).toBe(DateFormat.ENDPOINT_DATE);
        expect(getDateFormat(dateStringWrong)).toBe('');
    });
});

/**
 * UTP: DATE - 2
 */
describe('parsing date from string', () => {
    test('Parsing date string with date format to UNIX', () => {
        const dateStringEU = '25/01/2020 14:53';
        const dateStringUS = '11-29-2018 11:24 AM';

        expect(parseDate(dateStringEU, DateFormat.ABBOTT_EU, undefined, true)).toBe(
            getUnixTime(parse(dateStringEU, 'dd/MM/yyyy HH:mm', new Date())) * 1000
        );
        expect(parseDate(dateStringUS, DateFormat.ABBOTT_US, undefined, true)).toBe(
            getUnixTime(parse(dateStringUS, 'MM-dd-yyyy p', new Date())) * 1000
        );
    });

    test('Parsing date string with date format to Date', () => {
        const dateStringEU = '25/01/2020 14:53';
        const dateStringUS = '11-29-2018 11:24 AM';

        expect(parseDate(dateStringEU, DateFormat.ABBOTT_EU, undefined, false)).toStrictEqual(
            parse(dateStringEU, 'dd/MM/yyyy HH:mm', new Date())
        );
        expect(parseDate(dateStringUS, DateFormat.ABBOTT_US, undefined, false)).toStrictEqual(
            parse(dateStringUS, 'MM-dd-yyyy p', new Date())
        );
    });

    test('Parsing date string with unknown date format to UNIX', () => {
        const dateStringUnknown = '01-01-2021 12:01';

        expect(parseDate(dateStringUnknown, DateFormat.NONE, undefined, true)).toBe(NaN);
    });

    test('Parsing date string with unknown date format to Date', () => {
        const dateStringUnknown = '01-01-2021 12:01';

        expect(parseDate(dateStringUnknown, DateFormat.NONE, undefined, true)).toStrictEqual(NaN);
    });
});

/**
 * UTP: DATE - 3
 */
describe('converting from unix milliseconds to date', () => {
    test('Going from 13-digit unix timestamp to date', () => {
        const unixTimestamp = 1618876800000;
        expect(fromUnixMsTime(unixTimestamp)).toStrictEqual(new Date('2021-04-20'));
    });

    test('Going from 10-digit unix timestamp to date', () => {
        const unixTimestamp = 1618876800;
        expect(() => {
            fromUnixMsTime(unixTimestamp);
        }).toThrow('unixDate is not correctly formatted (should be 13 digits)');
    });
});

/**
 * UTP: DATE - 4
 */
test('Parsing excel date format (days from 1900) to readable food diary format', () => {
    const daysSince1900 = 39448;
    const correspondingDate = '01/01/08';
    expect(parseExcelDate(daysSince1900)).toStrictEqual(
        format(parse(correspondingDate, 'dd/MM/yy', new Date()), 'dd/MM/yy')
    );
});

/**
 * UTP: DATE - 5
 */
test('Parsing excel date format (days from 1900) to readable food diary format', () => {
    const daysSince1900 = 44325;
    const correspondingDate = '09/05/21';
    expect(parseExcelDate(daysSince1900)).toStrictEqual(
        format(parse(correspondingDate, 'dd/MM/yy', new Date()), 'dd/MM/yy')
    );
});

/**
 * UTP: DATE - 6
 */
test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.5;
    const correspondingTime = '12:00';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

/**
 * UTP: DATE - 7
 */
test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.863194444;
    const correspondingTime = '20:43';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

/**
 * UTP: DATE - 8
 */
test('Parsing excel time format (fraction of a day) to readable food diary format, 08:00', () => {
    const dayFraction = 0.333333333;
    const correspondingTime = '08:00';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

/**
 * UTP: DATE - 9
 */
test('Parsing excel time format of 00:00 to readable food diary format', () => {
    const dayFraction = 0.0;
    const correspondingTime = '00:00';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

/**
 * UTP: DATE - 10
 */
test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.417361111;
    const correspondingTime = '10:01';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

/**
 * UTP: DATE - 11
 */
test('test robustness of excel time parser', async () => {
    const dayFraction = -0.417361111;
    expect(() => {
        parseExcelTime(dayFraction);
    }).toThrow('Invalid day fraction!');
});

/**
 * UTP: DATE - 12
 */
test('test robustness of excel date parser', async () => {
    const daysSince1900 = -44325;
    expect(() => {
        parseExcelDate(daysSince1900);
    }).toThrow('Invalid amount of days since 1900!');
});

describe('Checking valid unix timestamps', () => {
    /**
     * UTP: DATE - 13
     */
    test('valid timestamp validity', () => {
        const timestamp = 1618876800000;
        expect(validUnixTimestamp(timestamp)).toBe(true);
    });

    /**
     * UTP: DATE - 14
     */
    test('invalid timestamp validity', () => {
        const timestamp = 1618876800;
        expect(() => {
            validUnixTimestamp(timestamp);
        }).toThrow('unixDate is not correctly formatted (should be 13 digits)');
    });
});

/**
 * UTP: 15
 */
test('Convert excel date and time', () => {
    const input = [{ date: '44325', time: '0.417361111' }];
    const expectedOutput = [{ date: '09/05/21', time: '10:01' }];
    expect(convertExcelDateTimes(input)).toStrictEqual(expectedOutput);
});

/**
 * UTP: 16
 */
test('Convert excel date and time robustness', () => {
    const input = [{ cheese: 'tasty' }];
    const expectedOutput = [{ cheese: 'tasty' }];
    expect(convertExcelDateTimes(input)).toStrictEqual(expectedOutput);
});
