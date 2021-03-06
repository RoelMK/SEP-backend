import { DataParser } from './dataParser';
import { DateFormat, parseExcelTime } from '../utils/dates';
import OneDriveExcelParser from '../fileParsers/oneDriveExcelParser';
import ExcelParser from '../fileParsers/excelParser';
import { MEAL_TYPE } from '../../gb/models/foodModel';
import { getFileName } from '../utils/files';
import { GameBusToken } from '../../gb/auth/tokenHandler';
import {
    DataSource,
    FoodDiaryData,
    FoodDiaryDataGuard,
    InputError,
    OutputDataType
} from './dataParserTypes';
import { FoodSource } from '../food/foodTypes';
import { InsulinSource } from '../insulin/insulinTypes';

/**
 * Default class for parsing food diaries
 */
export default class FoodDiaryParser extends DataParser {
    private foodDiaryData: FoodDiaryData[] = [];

    constructor(foodDiaryFile: string, userInfo: GameBusToken, protected oneDriveToken?: string) {
        super(DataSource.FOOD_DIARY, foodDiaryFile, userInfo, oneDriveToken, 'fooddiary');
    }

    /**
     * Function that is called (async) that creates the parsers and passes the data to the correct lower parsers
     */
    async process(): Promise<void> {
        // specify the type of parsed data
        this.foodDiaryData = (await this.parse()) as FoodDiaryData[];

        // check for erroneous input
        if (!FoodDiaryDataGuard(this.foodDiaryData[0])) {
            throw new InputError('Wrong input data for processing food diary data!');
        }
        //auto-fills empty cells in the Excel + other preprocessing

        const preprocessedFoodDiaryData: FoodDiaryData[] = FoodDiaryParser.preprocess(
            this.foodDiaryData,
            await this.getMealTypeMap(this.filePath as string, this.oneDriveToken)
        );

        // set dateFormat and create parsers
        this.dateFormat = DateFormat.FOOD_DIARY;
        this.createParser(
            OutputDataType.FOOD,
            preprocessedFoodDiaryData,
            FoodSource.FOOD_DIARY_EXCEL
        );
        this.createParser(
            OutputDataType.INSULIN,
            preprocessedFoodDiaryData,
            InsulinSource.FOOD_DIARY_EXCEL
        );

        // post data
        await this.postProcessedData();

        // update the timestamp of newest food diary entry to this file
        this.setLastUpdate(getFileName(this.filePath as string), this.getLastProcessedTimestamp());
    }

    /**
     * Gets a Map of specified meal types to default time values (for example Breakfast: 08:00)
     * @param filepath path of the excel file that contains a table
     * @param oneDriveToken token to access a OneDrive, can be undefined
     * @returns a Map of meal types to default times
     */
    private async getMealTypeMap(
        filepath: string,
        oneDriveToken?: string
    ): Promise<Map<string, string>> {
        let mealTypeMap: Map<string, string>;
        // based on oneDrive token, determine oneDrive or local lookup
        if (oneDriveToken !== undefined && oneDriveToken !== '') {
            mealTypeMap = await OneDriveExcelParser.getMappingTableValues(
                filepath,
                oneDriveToken,
                'mealtypemap'
            );
        } else {
            mealTypeMap = await ExcelParser.getMappingTableValues(this.filePath as string);
        }

        // if the map is valid, i.e. the value is a number, update the excel time value to readable format
        mealTypeMap.forEach(function (value, key) {
            if (value != '' && !isNaN(parseFloat(value)))
                mealTypeMap.set(key, parseExcelTime(parseFloat(value)));
            else mealTypeMap.delete(key);
        });
        return mealTypeMap;
    }

    /**
     * Automatically fills rows where the date is left out with the last date
     * above it that has been entered (for ease of use in maintaining the file)
     * Automatically computes total insulin if not specified, but other subtypes of insulin are
     * Removes empty rows if present
     *
     * This is done with raw data, because the order of the rows matters and most columns are needed
     * @param rawData Array of FoodDiary items
     */
    static preprocess(
        rawData: FoodDiaryData[],
        mealTimeMap?: Map<string, string>
    ): FoodDiaryData[] {
        // filter out empty rows
        rawData = rawData.filter((entry: FoodDiaryData) => {
            return (
                entry.date !== '' ||
                entry.time !== '' ||
                entry.description !== '' ||
                entry.carbohydrates !== '' ||
                entry.base_insulin !== '' ||
                entry.sports_correction_insulin !== '' ||
                entry.high_correction_insulin !== '' ||
                entry.total_insulin !== ''
            );
        });

        let lastDate = '',
            lastTime = '';
        // loop over raw data
        for (let index = 0; index < rawData.length; index++) {
            let element = rawData[index];

            // fill in the dates
            const fillDate = FoodDiaryParser.fillDate(element, lastDate);
            element = fillDate[0];
            lastDate = fillDate[1];

            // fill in the time
            const fillTime = FoodDiaryParser.fillTime(element, lastTime, mealTimeMap);
            element = fillTime[0];
            lastTime = fillTime[1];

            // auto-compute total insulin
            element = FoodDiaryParser.computeTotalInsulin(element);
        }

        return rawData;
    }

    /**
     * Automatically fills in missing dates with the last known date
     * in the column
     * @param entry a food diary data entry
     * @param lastDate the last non-empty date value
     * @returns updated lastDate variable and entry in array
     */
    static fillDate(entry: FoodDiaryData, lastDate: string): any[] {
        // automatically fills in the last known date if not specified
        if (entry.date != '') {
            lastDate = entry.date;
        } else if (lastDate != '') {
            entry.date = lastDate;
        } else {
            throw new Error('First date needs to be filled in!');
        }
        return [entry, lastDate];
    }

    /**
     * If no time value is specified for the element, but a meal type is
     * the method automatically fills in a default value.
     * @param element food data entry
     * @param lastTime last recorded time value
     * @param mealTimeMap mapping from specific meal types to default times on the day
     * @returns updated lastTime variable and entry in array
     */
    static fillTime(
        entry: FoodDiaryData,
        lastTime: string,
        mealTimeMap?: Map<string, string>
    ): any[] {
        // if the time is not specified, but the meal type is, fill in a default time
        if (
            entry.time == '' &&
            entry.meal_type != MEAL_TYPE.UNDEFINED &&
            mealTimeMap !== undefined &&
            mealTimeMap.get(entry.meal_type) != undefined
        ) {
            entry.time = mealTimeMap.get(entry.meal_type) as string;
            return [entry, lastTime];
        }
        if (entry.time == '') {
            // if no mapping can be done, use last known time or midnight
            entry.time = lastTime == '' ? '00:00' : lastTime;
            return [entry, lastTime];
        }
        // update last known time
        return [entry, entry.time];
    }

    /**
     * Automatically computes the sum of insulin when not filled in and other data about
     * insulin is present
     * @param element food diary data element
     * @returns updated entry
     */
    static computeTotalInsulin(entry: FoodDiaryData): FoodDiaryData {
        // automatically computes the sum of insulin if not specified
        if (entry.total_insulin == '') {
            const base = entry.base_insulin == '' ? 0 : parseFloat(entry.base_insulin);
            const high_correct =
                entry.high_correction_insulin == '' ? 0 : parseFloat(entry.high_correction_insulin);
            const sports_correct =
                entry.sports_correction_insulin == ''
                    ? 0
                    : parseFloat(entry.sports_correction_insulin);
            if (base + high_correct + sports_correct > 0) {
                entry.total_insulin = (base + high_correct + sports_correct).toString();
            }
        }
        return entry;
    }
}
