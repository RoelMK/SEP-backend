import { parse, getUnixTime, isValid } from 'date-fns';

/**
 * Function that will parse a string date to a Date object or Unix timestamp
 * @param dateString String to be parsed
 * @param dateFormat Format to be used for date (see below)
 * @param referenceDate (Optional) Reference date from when to parse, will use today if not provided
 * @param unix (Optional) Whether a unix timestamp should be returned, default is false
 * @returns Date or unix timestamp of given date string
 */
const parseDate = (dateString: string, dateFormat: DateFormat, referenceDate?: Date, unix?: boolean): Date | number => {
    // Parse date using specified format
    const date = parse(dateString, dateFormat.toString(), referenceDate ? referenceDate : new Date());
    // If unix isn't specified, return the date
    if (!unix) {
        return date;
    }
    // Otherwise, return the unix timestamp
    return getUnixTime(date);
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
        let valid;
        try {
            // Try to make a valid date using the format
            valid = isValid(
                parse(
                    dateString,
                    DateFormat[format as keyof typeof DateFormat],
                    referenceDate ? referenceDate : new Date()
                )
            );
            // If the date is valid, return the used format
            if (valid) {
                return DateFormat[format as keyof typeof DateFormat];
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
 * Different date formats used in different data sources (including NONE)
 */
enum DateFormat {
    ABBOTT_US = 'MM-dd-yyyy p',
    ABBOTT_EU = 'dd/MM/yyyy HH:mm',
    NONE = ''
}

export { parseDate, getDateFormat, DateFormat };