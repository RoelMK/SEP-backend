import { GlucoseUnit, GlucoseModel, RecordType } from '../../gb/models/glucoseModel';
import { DateFormat, parseDate } from '../utils/dates';
import { convertMG_DLtoMMOL_L } from '../utils/units';
import { emptyGlucoseModel, GlucoseSource } from './glucoseTypes';

/**
 * Helper class to map the different glucose sources to 1 glucoseModel
 */
export default class GlucoseMapper {
    /**
     * Main function that returns the correct mapping function based on given source
     * @param glucoseSource Glucose source given as enum
     * @param dateFormat DateFormat of the glucose measurement timestamps
     * @param glucoseUnit GlucoseUnit in which the glucose level is measured
     * @returns Mapping function that maps an entry from the source to a glucoseModel
     */
    public static mapGlucose(
        glucoseSource: GlucoseSource,
        dateFormat: DateFormat,
        glucoseUnit: GlucoseUnit
    ): (entry: any) => GlucoseModel {
        switch (glucoseSource) {
            case GlucoseSource.ABBOTT:
                // returns a mapper function to the parser with a predefined dateFormat
                // argument and variable entry argument
                return function (entry: any): GlucoseModel {
                    return GlucoseMapper.mapAbbott(entry, dateFormat, glucoseUnit);
                };
            case GlucoseSource.NIGHTSCOUT:
                // returns a mapper function to the parser with a predefined dateFormat
                // argument and variable entry argument
                return function (entry: any): GlucoseModel {
                    return GlucoseMapper.mapNightScout(entry, glucoseUnit);
                };
        }
    }

    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns glucoseModel with time and glucose level in mmol/L
     */
    private static mapAbbott(
        entry: any,
        dateFormat: DateFormat,
        glucoseUnit: GlucoseUnit
    ): GlucoseModel {
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
                    timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
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
                    timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
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
                    timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
                    glucoseLevel: glucose_level_mmol
                } as GlucoseModel;
        }

        // Return empty model with only zeros
        return emptyGlucoseModel();
    }

    private static mapNightScout(entry: any, glucoseUnit: GlucoseUnit) {
        // Convert to mmol/L
        const glucose_level_mmol =
            glucoseUnit == GlucoseUnit.MMOL_L ? entry.sgv : convertMG_DLtoMMOL_L(entry.sgv);
        return {
            timestamp: entry.date,
            glucoseLevel: glucose_level_mmol
        } as GlucoseModel;
    }
}
