import { parse, isValid, fromUnixTime } from 'date-fns';

/**
 * Function that will parse a string date to a Date object or Unix timestamp
 * @param dateString String to be parsed
 * @param dateFormat Format to be used for date (see below)
 * @param referenceDate (Optional) Reference date from when to parse, will use today if not provided
 * @param unix (Optional) Whether a unix timestamp should be returned, default is false
 * @returns Date or unix timestamp of given date string, NaN if dateString does not match DateFormat
 */
const parseDate = (dateString: string, dateFormat: DateFormat, referenceDate?: Date, unix?: boolean): Date | number => {
    // Parse date using specified format
    const date = parse(dateString, dateFormat.toString(), referenceDate ? referenceDate : new Date());
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
    for (let format in DateFormat) {
        //console.log(`Parsing {${dateString}} as {${DateFormat[format as keyof typeof DateFormat]}}`);
        let valid: boolean;
        try {
            // Try to make a valid date using the format
            valid = isValid(parse(dateString, DateFormat[format], referenceDate ? referenceDate : new Date()));
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
 * Different date formats used in different data sources (including NONE)
 */
enum DateFormat {
    ABBOTT_US = 'MM-dd-yyyy p',
    ABBOTT_EU = 'dd/MM/yyyy HH:mm',
    EETMETER = 'd/M/yyyy H:m',
    NONE = ''
}

export { parseDate, getDateFormat, fromUnixMsTime, DateFormat };
