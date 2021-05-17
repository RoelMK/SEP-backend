import { parse, getUnixTime, isValid, add, format } from 'date-fns';

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
 * Some excel libraries do not offer possibility to convert dates to string format
 * and instead return the number of days since the start of 1900. This function converts those numbers
 * to a readable dateformat // TODO now only usable for fooddiary onedrive imports
 * @param daysSince1900 the number of days since 1900, i.e. the way excel stores dates
 */
const parseExcelDate = (daysSince1900: number): string =>{
    const start = parse("1/1/1900", 'd/M/yyyy', new Date());

    // duration as date-fns duration objects
    // https://www.epochconverter.com/seconds-days-since-y0#:~:text=Days%20Since%201900%2D01%2D01,the%20number%20on%20this%20page.
    // the excel format has two extra days as specified by the article above
    const offset = {
        days: daysSince1900 - 2,  
      }
    return (format(add(start, offset), 'dd/MM/yy'));
}
 

/**
 * Some excel libraries do not offer possibility to convert times to string format
 * and instead return the fraction of a day, for example 0.5 for noon
 * This function converts the fraction to a readable dateformat (HH:mm) // TODO now only usable for fooddiary onedrive imports
 * @param daysSince1900 the fraction of the day, i.e. how excel stores time
 */
 const parseExcelTime = (dayFraction: number): string =>{
    const hours: number   = Math.floor(dayFraction * 24);
    const minutes: number = Math.round(((dayFraction * 24) % hours) * 60);

    // return the time in the HH:mm format
    return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
}
 



/**
 * Different date formats used in different data sources (including NONE)
 */
enum DateFormat {
    ABBOTT_US = 'MM-dd-yyyy p',
    ABBOTT_EU = 'dd/MM/yyyy HH:mm',
    FOOD_DIARY = 'dd/MM/yy HH:mm',
    FOOD_DIARY_2 = "dd-MM-yy",
    NONE = ''
}

export { parseDate, getDateFormat, parseExcelDate,parseExcelTime, DateFormat };
