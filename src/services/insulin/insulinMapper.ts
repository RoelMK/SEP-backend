import { InsulinModel, InsulinType } from '../../gb/models/insulinModel';
import { NightScoutTreatmentModel } from '../dataParsers/dataParserTypes';
import { DateFormat, parseDate } from '../utils/dates';
import { InsulinSource } from './insulinTypes';

/**
 * Helper class to map the different insulin sources to 1 insulinModel
 */
export default class InsulinMapper {
    /**
     * Main function that returns the correct mapping function based on given source
     * @param insulineSource Insulin source given as enum
     * @param dateFormat DateFormat of the insulin measurement timestamps
     * @returns Mapping function that maps an entry from the source to a insulinModel
     */
    public static mapInsulin(
        insulinSource: InsulinSource,
        dateFormat: DateFormat
    ): (entry: any) => InsulinModel {
        switch (insulinSource) {
            case InsulinSource.ABBOTT:
                // returns a mapper function to the parser with a predefined dateFormat
                // argument and variable entry argument
                return function (entry: any): InsulinModel {
                    return InsulinMapper.mapAbbott(entry, dateFormat);
                };
            case InsulinSource.FOOD_DIARY_EXCEL:
                return this.mapFoodDiaryInsulin;
            case InsulinSource.NIGHTSCOUT:
                return this.mapNightScout;
            default:
                throw Error('Insulin source not implemented!');
        }
    }

    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns insulinModel with time and type(RAPID or LONG)
     */
    private static mapAbbott(entry: any, dateFormat: DateFormat): InsulinModel {
        let insulin_amount: number;

        // based on its recordtype, different insulin types are available
        //Type Rapid by default
        let insulin_type: InsulinType = InsulinType.RAPID;
        // Early return to return empty insulin model
        if (
            !(
                entry.rapid_acting_insulin__units_ ||
                entry.long_acting_insulin_value__units_ ||
                entry.long_acting_insulin__units_
            )
        ) {
            return emptyInsulinModel();
        }

        if (entry.rapid_acting_insulin__units_) {
            insulin_amount = parseInt(entry.rapid_acting_insulin__units_);
        } else {
            insulin_amount =
                dateFormat == DateFormat.ABBOTT_US
                    ? parseInt(entry.long_acting_insulin__units_)
                    : parseInt(entry.long_acting_insulin_value__units_);
            insulin_type = InsulinType.LONG;
        }

        return {
            timestamp: parseDate(entry.device_timestamp, dateFormat, undefined, true),
            insulinAmount: insulin_amount,
            insulinType: insulin_type
        } as InsulinModel;
    }

    private static mapFoodDiaryInsulin(entry: any): InsulinModel {
        return {
            timestamp: parseDate(
                entry.date.replace(/-/g, '/') + ' ' + entry.time,
                DateFormat.FOOD_DIARY, // Use date format of food diary for the insulin entry
                new Date(),
                true
            ),
            insulinAmount: parseFloat(entry.total_insulin),
            insulinType: InsulinType.RAPID
        } as InsulinModel;
    }

    private static mapNightScout(entry: NightScoutTreatmentModel): InsulinModel {
        return {
            timestamp: new Date(entry.created_at).getTime(),
            insulinAmount: entry.insulin,
            insulinType: InsulinType.RAPID
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
