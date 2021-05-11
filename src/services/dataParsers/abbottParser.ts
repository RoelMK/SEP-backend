import FoodModel from '../../gb/models/foodModel';
import { GlucoseModel } from '../../gb/models/glucoseModel';
import { InsulinModel } from '../../gb/models/insulinModel';
import { DataParser, DataSource, OutputDataType } from './dataParser';
import FoodParser, { FoodSource } from '../food/foodParser';
import GlucoseParser, { GlucoseSource } from '../glucose/glucoseParser';
import InsulinParser, { InsulinSource } from '../insulin/insulinParser';
import { getDateFormat } from '../utils/dates';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class AbbottParser extends DataParser {


    private abbottData: AbbottData[] = [];

    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    private foodParser?: FoodParser<AbbottData>;
    private glucoseParser?: GlucoseParser<AbbottData>;
    private insulinParser?: InsulinParser<AbbottData>;

    /**
     * DataParser construction with DataSource set
     * @param abbotFile file path of Abbott file
     */
    constructor(private readonly abbotFile: string) {
        super(abbotFile, DataSource.ABBOTT);
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process() {
        console.log(this.rawData);
        // specify the type of parsed data
        this.abbottData = (await this.parse()) as AbbottData[];

        // We must first determine whether we are dealing with an US file or an EU file (set dateFormat)
        this.getLocale();
        console.log("DIT MOET KAPOT ZIJN")
        console.log(this.abbottData);
        // We can filter the rawData to get separate glucose, food & insulin data and create their parsers

        const foodData = this.filterFood();
        this.foodParser = new FoodParser<AbbottData>(foodData, FoodSource.ABBOTT, this.dateFormat);

        const glucoseData = this.filterGlucose();
        console.log(glucoseData)
        this.glucoseParser = new GlucoseParser<AbbottData>(glucoseData, GlucoseSource.ABBOTT, this.dateFormat);

        const insulinData = this.filterInsulin();
        this.insulinParser = new InsulinParser<AbbottData>(insulinData, InsulinSource.ABBOTT, this.dateFormat);
    }

    /**
     * Debugging function to get data contained in the parsers
     * @param abbottDataType Data type to get
     * @returns Data from data type's parser
     */
    getData(outputType: OutputDataType): GlucoseModel[] | InsulinModel[] | FoodModel[] | undefined {
        switch (outputType) {
            case OutputDataType.GLUCOSE:
                return this.glucoseParser?.glucoseData;
            case OutputDataType.INSULIN:
                return this.insulinParser?.insulinData;
            case OutputDataType.FOOD:
                return this.foodParser?.foodData;
        }
    }

    /**
     * Filters the glucose entries from the raw data
     * @returns All glucose entries
     */
    private filterGlucose(): AbbottData[] {
        console.log(this.abbottData[0]);
        const glucose = this.abbottData?.filter((entry: AbbottData) => {
            // We only include entries for which the record type is a glucose scan, either historical, manual (strip) or from a scan
            // We also only include entries for which the date is specified
            return (
                parseInt(entry.record_type) === RecordType.SCAN_GLUCOSE_LEVEL ||
                parseInt(entry.record_type) === RecordType.HISTORIC_GLUCOSE_LEVEL ||
                parseInt(entry.record_type) === RecordType.STRIP_GLUCOSE_LEVEL
                // TODO: checking for dateFormat for every entry can be slow,
                // it also looks like dates might be always present, but can this be assumed?
                //&&getDateFormat(entry.device_timestamp) !== DateFormat.NONE)
            );
        });
        // TODO: come up with a better way to return AbbottData if there is no glucose data
        if (!glucose) {
            return [emptyAbbottData()];
        }
        return glucose;
    }

    /**
     * Filters the food entries from the raw data
     * @returns All food entries
     */
    private filterFood(): AbbottData[] {
        const food = this.abbottData?.filter((entry: AbbottData) => {
            return parseInt(entry.record_type) === RecordType.CARBOHYDRATES && entry.carbohydrates__grams_;
        });
        // TODO: come up with a better way to return AbbottData if there is no food data
        if (food?.length === 0) {
            return [emptyAbbottData()];
        }
        return food;
    }

    /**
     * Filters the insulin entries from the raw data
     * @returns All insulin entries
     */
    private filterInsulin(): AbbottData[] {
        const insulin = this.abbottData?.filter((entry: AbbottData) => {
            return parseInt(entry.record_type) === RecordType.INSULIN;
        });
        if (insulin?.length === 0) {
            return [emptyAbbottData()];
        }
        return insulin;
    }

    /**
     * Determines the date format (locale) of the input file based on first entry
     */
    private getLocale(): void {
        // TODO check if the first entry is NONE, but others are not
        // TODO involves checking if first can be NONE at all
        this.dateFormat = getDateFormat(this.abbottData?.[0].device_timestamp);
    }
}

/**
 * Function that can return an empty AbbottData entry that might be needed for easy returns
 * @returns Empty AbbottData
 */
const emptyAbbottData = (): AbbottData => ({
    device: '',
    serial_number: '',
    device_timestamp: '',
    record_type: '',
    historic_glucose_mg_dl: '',
    historic_glucose_mmol_l: '',
    scan_glucose_mg_dl: '',
    scan_glucose_mmol_l: '',
    non_numeric_rapid_acting_insulin: '',
    rapid_acting_insulin__units_: '',
    non_numeric_food: '',
    carbohydrates__grams_: '',
    carbohydrates__servings_: '',
    non_numeric_long_acting_insulin: '',
    long_acting_insulin__units_: '',
    long_acting_insulin_value__units_: '',
    notes: '',
    strip_glucose_mg_dl: '',
    strip_glucose_mmol_l: '',
    ketone_mmol_l: '',
    meal_insulin__units_: '',
    correction_insulin__units_: '',
    user_change_insulin__units_: ''
});

/**
 * Raw Abbott .csv data format
 * TODO: what is non_numeric_food?
 */
export interface AbbottData extends Record<string, string | undefined> {
    device: string;
    serial_number: string;
    device_timestamp: string;
    record_type: string;
    historic_glucose_mg_dl?: string;
    historic_glucose_mmol_l?: string;
    scan_glucose_mg_dl?: string;
    scan_glucose_mmol_l?: string;
    non_numeric_rapid_acting_insulin: string;
    rapid_acting_insulin__units_: string;
    non_numeric_food: string;
    carbohydrates__grams_: string;
    carbohydrates__servings_: string;
    non_numeric_long_acting_insulin: string;
    long_acting_insulin__units_: string;
    long_acting_insulin_value__units_: string;
    notes: string;
    strip_glucose_mg_dl?: string;
    strip_glucose_mmol_l?: string;
    ketone_mmol_l: string;
    meal_insulin__units_: string;
    correction_insulin__units_: string;
    user_change_insulin__units_: string;
}

/**
 * Different record type meanings
 * Glucose levels (0 & 1) are in mmol/L
 * Insulin (4) includes both rapid-acting insulin and long-acting insulin (in units)
 * Carbohydrates are in grams
 */
export enum RecordType {
    HISTORIC_GLUCOSE_LEVEL = 0,
    SCAN_GLUCOSE_LEVEL = 1,
    STRIP_GLUCOSE_LEVEL = 2,
    INSULIN = 4,
    CARBOHYDRATES = 5,
    NOTES = 6
}

