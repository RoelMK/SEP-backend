import { parse, isValid, fromUnixTime, add, format } from 'date-fns';

/**
 * Function that will parse a string date to a Date object or Unix timestamp
 * @param dateString String to be parsed
 * @param dateFormat Format to be used for date (see below)
 * @param referenceDate (Optional) Reference date from when to parse, will use today if not provided
 * @param unix (Optional) Whether a unix timestamp should be returned, default is false
 * @returns Date or unix timestamp of given date string, NaN if dateString does not match DateFormat
 */
const parseDate = (
    dateString: string,
    dateFormat: DateFormat,
    referenceDate?: Date,
    unix?: boolean
): Date | number => {
    // Parse date using specified format
    const date = parse(
        dateString,
        dateFormat.toString(),
        referenceDate ? referenceDate : new Date()
    );
    // If unix isn't specified, return the date
    if (!unix) {
        return date;
    }
    // Otherwise, return the unix timestamp
    // To be consistent with GameBus' timestamps, we make sure we are using the extended 13-digit format
    // Date.getTime() returns the unix timestamp in milliseconds
    return date.getTime();
};

/**
 * Function that will try every possible DateFormat on the input string to get the correct format
 * @param dateString String for which the format is not known
 * @param referenceDate Optional reference date to make Date
 * @returns DateFormat of dateString (if found)
 */
const getDateFormat = (dateString: string, referenceDate?: Date): DateFormat => {
    // Try all the defined formats
    for (const format in DateFormat) {
        //console.log(`Parsing {${dateString}} as {${DateFormat[format as keyof typeof DateFormat]}}`);
        let valid: boolean;
        try {
            // Try to make a valid date using the format
            valid = isValid(
                parse(dateString, DateFormat[format], referenceDate ? referenceDate : new Date())
            );
            // If the date is valid, return the used format
            if (valid) {
                return DateFormat[format];
            }
        } catch {
            // If not, try the next format
            continue;
        }
    }
    // If no matching format was found, return the NONE format
    return DateFormat.NONE;
};

/**
 * Some excel libraries do not offer possibility to convert dates to string format
 * and instead return the number of days since the start of 1900. This function converts those numbers
 * to a readable dateformat
 * @param daysSince1900 the number of days since 1900, i.e. the way excel stores dates
 */
const parseExcelDate = (daysSince1900: number): string => {
    if (daysSince1900 < 0) throw Error('Invalid amount of days since 1900!');
    const start = parse('01/01/1900', 'dd/MM/yyyy', new Date());

    // duration as date-fns duration object
    // https://www.epochconverter.com/seconds-days-since-y0#:~:text=Days%20Since%201900%2D01%2D01,the%20number%20on%20this%20page.
    // the excel format has two extra days as specified by the article above
    const offset = {
        days: daysSince1900 - 2
    };
    return format(add(start, offset), 'dd/MM/yy');
};

/**
 * Some excel libraries do not offer possibility to convert times to string format
 * and instead return the fraction of a day, for example 0.5 for noon
 * This function converts the fraction to a readable dateformat (HH:mm)
 * @param daysSince1900 the fraction of the day, i.e. how excel stores time
 */
const parseExcelTime = (dayFraction: number): string => {
    if (dayFraction < 0 || dayFraction >= 1) throw Error(dayFraction + ': Invalid day fraction!');
    // to prevent math errors in the modulo
    if (dayFraction == 0) {
        return '00:00';
    }

    // calculate total amount of minutes into the day
    const totalMinutes: number = Math.round(dayFraction * 24 * 60);

    // from this, calculate amount of passed hours and minutes within the hour
    const hours: number = Math.floor(totalMinutes / 60);
    const minutes: number = totalMinutes % 60;

    // return the time in the HH:mm format
    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
};

/**
 * Converts raw excel date and time formats to more readable formats (dd/MM/yy and HH:mm respectively)
 * @param objects array of excel objects, assuming date property is called date and time property is called time
 * @returns array of objects with converted date and time properties
 */
const convertExcelDateTimes = (objects: Record<string, string>[]): Record<string, string>[] => {
    // only change date and time if they both exist
    if (objects[0].date === undefined && objects[0].time === undefined) {
        return objects;
    }
    objects.forEach(function (object) {
        if (object.date !== undefined && object.date !== '') {
            object.date = parseExcelDate(parseInt(object.date));
        }
        if (object.time !== undefined && object.time !== '') {
            object.time = parseExcelTime(parseFloat(object.time));
        }
    });
    return objects;
};

/**
 * Function that will get the date from the given unix timestamp (in milliseconds)
 * @param unixDate 13-digit (milliseconds) unix timestamp
 * @returns Date of timestamp
 */
const fromUnixMsTime = (unixDate: number): Date => {
    if (unixDate.toString().length != 13) {
        throw new Error('unixDate is not correctly formatted (should be 13 digits)');
    }
    const date: Date = fromUnixTime(Math.floor(unixDate / 1000));
    return date;
};

/**
 * Function that checks whether a given unix timestamp results in a valid date
 * @param unixDate 13-digit (milliseconds) unix timestamp
 * @returns Whether the timestamp corresponds to a valid date
 */
const validUnixTimestamp = (unixDate: number): boolean => {
    return isValid(fromUnixMsTime(unixDate));
};

/**
 * Different date formats used in different data sources (including NONE)
 */
enum DateFormat {
    ABBOTT_US = 'MM-dd-yyyy p',
    ABBOTT_EU = 'dd/MM/yyyy HH:mm',
    FOOD_DIARY = 'dd/MM/yy HH:mm',
    EETMETER = 'd/M/yyyy H:m',
    ENDPOINT_DATETIME = 'dd-MM-yyyy HH:mm',
    ENDPOINT_DATE = 'dd-MM-yyyy',

    NONE = ''
}

/**
 * Content of a date slice
 */
interface DateSlice {
    startDate: Date;
    endDate: Date;
}

export {
    parseDate,
    getDateFormat,
    fromUnixMsTime,
    parseExcelDate,
    parseExcelTime,
    convertExcelDateTimes,
    DateFormat,
    validUnixTimestamp,
    DateSlice
};
