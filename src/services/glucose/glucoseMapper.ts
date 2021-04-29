import { glucoseModel, RecordType } from '../../gb/models/glucoseModel';
import { AbbottData } from '../csvParser';
import { parse, getUnixTime } from 'date-fns';
import { GlucoseSource } from './glucoseParser';
import { DateFormat } from '../dateParser';

/**
 * Helper class to map the different glucose sources to 1 glucoseModel
 */
export default class GlucoseMapper {
    private constructor() {}

    /**
     * Main function that returns the correct mapping function based on given source
     * @param glucoseSource Glucose source given as enum
     * @returns Mapping function that maps an entry from the source to a glucoseModel
     */
    public static mapFood(glucoseSource: GlucoseSource, dateFormat: DateFormat) {
        switch (glucoseSource) {
            case GlucoseSource.ABOTT:
                // returns a mapper function to the parser with a predefined dateFormat argument and variable entry argument
                return function (entry: AbbottData): glucoseModel {
                    return GlucoseMapper.mapAbott(entry, dateFormat);
                };
        }
    }

    /**
     * Abott mapping function
     * @param entry Abott entry
     * @returns glucoseModel with information
     */
    private static mapAbott(entry: AbbottData, dateFormat: DateFormat): glucoseModel {
        // based on its recordtype, a different glucose data is available
        switch (parseInt(entry.record_type)) {
            // When the glucose data was buffered in the sensor
            case RecordType.HISTORIC_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(entry.historic_glucose_mg_dl)
                } as glucoseModel;

            // When the glucose data was drawn from a live scan
            case RecordType.SCAN_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(entry.scan_glucose_mg_dl)
                } as glucoseModel;

            // When the glucose date was from a blood drop on a strip
            case RecordType.STRIP_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(entry.strip_glucose_mg_dl)
                } as glucoseModel;
        }

        // TODO what to do at end of function, this should not happen
        return {
            timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
            glucoseLevel: 0
        } as glucoseModel;
    }
}
