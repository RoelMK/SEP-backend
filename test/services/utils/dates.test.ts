import { parse, getUnixTime, format } from 'date-fns';
import {
    DateFormat,
    fromUnixMsTime,
    getDateFormat,
    parseDate,
    parseExcelDate,
    parseExcelTime
} from '../../../src/services/utils/dates';

describe('getting date format from string', () => {
    test('Getting date format from normal string', () => {
        const dateStringEU = '25/01/2020 14:53';
        const dateStringUS = '11-29-2018 11:24 AM';

        expect(getDateFormat(dateStringEU)).toBe(DateFormat.ABBOTT_EU);
        expect(getDateFormat(dateStringUS)).toBe(DateFormat.ABBOTT_US);
    });

    test('Getting unknown date format from string', () => {
        const dateStringUnknown = '01-01-2021 12:01';

        expect(getDateFormat(dateStringUnknown)).toBe(DateFormat.NONE);
    });
});

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

test('Parsing excel date format (days from 1900) to readable food diary format', () => {
    const daysSince1900 = 39448;
    const correspondingDate = '01/01/08';
    expect(parseExcelDate(daysSince1900)).toStrictEqual(
        format(parse(correspondingDate, 'dd/MM/yy', new Date()), 'dd/MM/yy')
    );
});

test('Parsing excel date format (days from 1900) to readable food diary format', () => {
    const daysSince1900 = 44325;
    const correspondingDate = '09/05/21';
    expect(parseExcelDate(daysSince1900)).toStrictEqual(
        format(parse(correspondingDate, 'dd/MM/yy', new Date()), 'dd/MM/yy')
    );
});

test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.5;
    const correspondingTime = '12:00';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.863194444;
    const correspondingTime = '20:43';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

test('Parsing excel time format of 00:00 to readable food diary format', () => {
    const dayFraction = 0.0;
    const correspondingTime = '00:00';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

test('Parsing excel time format (fraction of a day) to readable food diary format', () => {
    const dayFraction = 0.417361111;
    const correspondingTime = '10:01';
    expect(parseExcelTime(dayFraction)).toStrictEqual(correspondingTime);
});

test('test robustness of excel time parser', async () => {
    const dayFraction = -0.417361111;
    expect(() => {
        parseExcelTime(dayFraction);
    }).toThrow('Invalid day fraction!');
});

test('test robustness of excel date parser', async () => {
    const daysSince1900 = -44325;
    expect(() => {
        parseExcelDate(daysSince1900);
    }).toThrow('Invalid amount of days since 1900!');
});
