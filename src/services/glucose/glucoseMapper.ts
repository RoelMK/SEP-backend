import { getUnixTime } from 'date-fns';
import { parse } from 'date-fns';
import { GlucoseUnit, GlucoseModel } from '../../gb/models/glucoseModel';
import { AbbottData, RecordType } from '../dataParsers/abbottParser';
import { DateFormat } from '../utils/dates';
import { convertMG_DLtoMMOL_L } from '../utils/units';
import { GlucoseSource } from './glucoseParser';

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
                return function (entry: AbbottData): GlucoseModel {
                    return GlucoseMapper.mapAbbott(entry, dateFormat, glucoseUnit);
                };
        }
    }

    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns glucoseModel with time and glucose level in mmol/L
     */
    private static mapAbbott(entry: AbbottData, dateFormat: DateFormat, glucoseUnit: GlucoseUnit): GlucoseModel {
        // based on its recordtype, different glucose data is available
        let glucose_level_mmol: number;
        switch (parseInt(entry.record_type)) {
            // When the glucose data was buffered in the sensor
            case RecordType.HISTORIC_GLUCOSE_LEVEL:
                // Convert to mmol/L
                glucose_level_mmol =
                    glucoseUnit == GlucoseUnit.MMOL_L
                        ? parseFloat(entry.historic_glucose_mmol_l as string)
                        : convertMG_DLtoMMOL_L(parseFloat(entry.historic_glucose_mg_dl as string));
                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: glucose_level_mmol
                } as GlucoseModel;

            // When the glucose data was drawn from a live scan
            case RecordType.SCAN_GLUCOSE_LEVEL:
                // Convert to mmol/L
                glucose_level_mmol =
                    glucoseUnit == GlucoseUnit.MMOL_L
                        ? parseFloat(entry.scan_glucose_mmol_l as string)
                        : convertMG_DLtoMMOL_L(parseFloat(entry.scan_glucose_mg_dl as string));

                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: glucose_level_mmol
                } as GlucoseModel;

            // When the glucose data was from a blood drop on a strip
            case RecordType.STRIP_GLUCOSE_LEVEL:
                // Convert to mmol/L
                glucose_level_mmol =
                    glucoseUnit == GlucoseUnit.MMOL_L
                        ? parseFloat(entry.strip_glucose_mmol_l as string)
                        : convertMG_DLtoMMOL_L(parseFloat(entry.strip_glucose_mg_dl as string));

                return {
                    timestamp: getUnixTime(parse(entry.device_timestamp, dateFormat, new Date())),
                    glucoseLevel: glucose_level_mmol
                } as GlucoseModel;
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
const emptyGlucoseModel = (): GlucoseModel => ({
    timestamp: 0,
    glucoseLevel: 0
});
