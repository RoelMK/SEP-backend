import { getUnixTime } from 'date-fns';
import { parse } from 'date-fns';
import { InsulinModel, InsulinType } from '../../gb/models/insulinModel';
import { AbbottData } from '../abbottParser';
import { FoodDiaryData } from '../foodDiaryParser';
import { InsulinSource } from './insulinParser';
import { DateFormat, parseDate } from '../utils/dates';

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
                switch (dateFormat) {
                case DateFormat.ABBOTT_EU:
                    return this.mapAbbottEU;
                case DateFormat.ABBOTT_US:
                    return this.mapAbbottUS;
                }
            case InsulinSource.FOOD_DIARY_EXCEL:
                return this.mapFoodDiaryInsulin;
            default:
                return this.mapAbbottEU; 
                
    }
}

    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns insulinModel with time and type(RAPID or LONG)
     */
    private static mapAbbottEU(entry: any): InsulinModel {
        let insulin_amount: number;

        // based on its recordtype, different insulin types are available
        //Type Rapid by default
        let insulin_type: InsulinType = InsulinType.RAPID;

        // Early return to return empty insulin model
        if (
            !(
                entry.rapid_acting_insulin__units_ ||
                entry.long_acting_insulin_value__units_
            )
        ) {
            return emptyInsulinModel();
        }

        if (entry.rapid_acting_insulin__units_) {
            insulin_amount = parseInt(entry.rapid_acting_insulin__units_);
        } else {
            insulin_amount = parseInt(entry.long_acting_insulin_value__units_);
            insulin_type = InsulinType.LONG;
        }

        return {
            timestamp:getUnixTime(parse(entry.device_timestamp, DateFormat.ABBOTT_EU, new Date())),
            insulinAmount: insulin_amount,
            insulinType: insulin_type
        } as InsulinModel;
    }


    /**
     * Abbott mapping function
     * @param entry Abbott entry
     * @returns insulinModel with time and type(RAPID or LONG)
     */
     private static mapAbbottUS(entry: any): InsulinModel {
        let insulin_amount: number;

        // based on its recordtype, different insulin types are available
        //Type Rapid by default
        let insulin_type: InsulinType = InsulinType.RAPID;

        // Early return to return empty insulin model
        if (
            !(
                entry.rapid_acting_insulin__units_  ||
                entry.long_acting_insulin__units_ 
            )
        ) {
            return emptyInsulinModel();
        }

        if (entry.rapid_acting_insulin__units_) {
            insulin_amount = parseInt(entry.rapid_acting_insulin__units_);
        } else {
            insulin_amount = parseInt(entry.long_acting_insulin__units_);
            insulin_type = InsulinType.LONG;
        }

        return {
            timestamp: getUnixTime(parse(entry.device_timestamp, DateFormat.ABBOTT_US, new Date())),
            insulinAmount: insulin_amount,
            insulinType: insulin_type
        } as InsulinModel;
    }


    private static mapFoodDiaryInsulin(entry: any): InsulinModel{
        return {
            timestamp: getUnixTime(parse(entry.date, DateFormat.FOOD_DIARY, new Date())),
            insulinAmount: parseFloat(entry.total_insulin),
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
