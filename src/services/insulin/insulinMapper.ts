import { getUnixTime } from 'date-fns';
import { parse } from 'date-fns';
import { InsulinModel, InsulinType } from '../../gb/models/insulinModel';
import { AbbottData } from '../abbottParser';
import { DateFormat, parseDate } from '../utils/dates';
import { InsulinSource } from './insulinParser';

/**
 * Helper class to map the different insulin sources to 1 insulinModel
 */
export default class InsulinMapper {
    private constructor() {}

    /**
     * Main function that returns the correct mapping function based on given source
     * @param insulineSource Insulin source given as enum
     * @param dateFormat DateFormat of the insulin measurement timestamps
     * @returns Mapping function that maps an entry from the source to a insulinModel
     */
    public static mapInsulin(insulinSource: InsulinSource, dateFormat: DateFormat) {
        switch (insulinSource) {
            case InsulinSource.ABBOTT:
                // returns a mapper function to the parser with a predefined dateFormat argument and variable entry argument
                return function (entry: AbbottData): InsulinModel {
                    return InsulinMapper.mapAbbott(entry, dateFormat);
                };
        }
    }

    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns insulinModel with time and type(RAPID or LONG)
     */
    private static mapAbbott(entry: AbbottData, dateFormat: DateFormat): InsulinModel {
        let insulin_amount: number;

        // based on its recordtype, different insulin types are available
        //Type Rapid by default
        let insulin_type: InsulinType = InsulinType.RAPID;

        // Early return to return empty insulin model
        if (
            !(
                entry.rapid_acting_insulin__units_ ||
                entry.long_acting_insulin__units_ ||
                entry.long_acting_insulin_value__units_
            )
        ) {
            return emptyInsulinModel();
        }

        if (entry.rapid_acting_insulin__units_) {
            insulin_amount = parseInt(entry.rapid_acting_insulin__units_);
        } else {
            switch (dateFormat) {
                //different name of the column for EU and US
                case DateFormat.ABBOTT_EU:
                    insulin_amount = parseInt(entry.long_acting_insulin_value__units_);
                    break;
                case DateFormat.ABBOTT_US:
                    insulin_amount = parseInt(entry.long_acting_insulin__units_);
                    break;
                default:
                    insulin_amount = parseInt(entry.long_acting_insulin_value__units_);
                    break;
            }
            insulin_type = InsulinType.LONG;
        }

        return {
            timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
            insulinAmount: insulin_amount,
            insulinType: insulin_type
        } as InsulinModel;
    }
}

/**
 * Function that can return an empty insulinModel entry that might be needed for easy returns
 * @returns Empty insulinModel
 */
const emptyInsulinModel = (): InsulinModel => ({
    timestamp: 0,
    insulinAmount: 0,
    insulinType: 0
});
