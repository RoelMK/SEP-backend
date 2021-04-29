import { glucoseModel, GlucoseUnit, RecordType} from '../../gb/models/glucoseModel';
import { AbbottData } from '../abbottParser';
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
     * @param dateFormat DateFormat of the glucose measurement timestamps
     * @param glucoseUnit GlucoseUnit in which the glucose level is measured
     * @returns Mapping function that maps an entry from the source to a glucoseModel
     */
    public static mapGlucose(glucoseSource: GlucoseSource, dateFormat: DateFormat, glucoseUnit: GlucoseUnit) {
        switch (glucoseSource) {
            case GlucoseSource.ABBOTT:
                // returns a mapper function to the parser with a predefined dateFormat argument and variable entry argument
                return function (entry: AbbottData): glucoseModel {
                    return GlucoseMapper.mapAbott(entry, dateFormat, glucoseUnit);
                };
        }
    }

    /**
     * Abott mapping function
     * @param entry Abott entry
     * @returns glucoseModel with information
     */
    private static mapAbott(entry: AbbottData, dateFormat: DateFormat, glucoseUnit: GlucoseUnit): glucoseModel {

        // TODO now of type any because otherwise ts complains that entry.historic_glucose_mg_dl can be undefined
        let historic_glucose;
        let scan_glucose;
        let strip_glucose;
        switch(glucoseUnit){
            case GlucoseUnit.MMOL_L:
                historic_glucose = entry.historic_glucose_mmol_l;
                scan_glucose     = entry.scan_glucose_mmol_l;
                strip_glucose    = entry.strip_glucose_mmol_l;
                break;

            case GlucoseUnit.MG_DL:
                historic_glucose = entry.historic_glucose_mg_dl;
                scan_glucose     = entry.scan_glucose_mg_dl;
                strip_glucose    = entry.strip_glucose_mg_dl;
                break;
        }

        // based on its recordtype, a different glucose data is available
        switch (parseInt(entry.record_type)) {

            // When the glucose data was buffered in the sensor
            case RecordType.HISTORIC_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(historic_glucose),
                    glucoseUnit : glucoseUnit
                } as glucoseModel;

            // When the glucose data was drawn from a live scan
            case RecordType.SCAN_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(scan_glucose),
                    glucoseUnit : glucoseUnit
                } as glucoseModel;

            // When the glucose date was from a blood drop on a strip
            case RecordType.STRIP_GLUCOSE_LEVEL:
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: parseInt(strip_glucose),
                    glucoseUnit : glucoseUnit
                } as glucoseModel;
        }

        // TODO what to do at end of function, this should not happen
        // For now return empty model with only zeros
        return emptyGlucoseModel();
    }
}

/**
* Function that can return an empty GlucoseModel entry that might be needed for easy returns
* @returns Empty GlucoseModel
*/
const emptyGlucoseModel = (): glucoseModel => ({
    timestamp: 0,
    glucoseLevel: 0,
    glucoseUnit: GlucoseUnit.UNDEFINED
})
