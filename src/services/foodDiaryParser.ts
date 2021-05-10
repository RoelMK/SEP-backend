import ExcelParser from "./excelParser";
import FoodParser, { FoodSource } from "./food/foodParser";
import GlucoseParser from "./glucose/glucoseParser";
import InsulinParser from "./insulin/insulinParser";
import { DateFormat } from "./utils/dates";



/**
 * Default class for parsing .xlsx files
 */
export default class FoodDiaryParser extends ExcelParser<FoodDiaryData> {

    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private foodParser?: FoodParser;
    private insulinParser?: InsulinParser;

    
    constructor(private readonly foodDiaryFile: string) {
        super(foodDiaryFile);
    }

    async process()  {
        console.log(await (this.parse(FoodDiaryDataKeys())));      

        this.foodParser = new FoodParser<FoodDiaryData>(this.rawData, FoodSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
        console.log(this.foodParser.foodData);
    }
   
}   

export interface FoodDiaryData {
    date: string;
    time: string;
    description: string;
    carbohydrates: string,
    base_insulin: string;
    high_correction_insulin: string;
    sports_correction_insulin: string;
    total_insulin: string;
}

/**
* Excel parser does not accept interfaces as argument, only stringarray
* //TODO until now I have not found a way of generating this automatically
* It seems not possible as the import { keys } from 'ts-transformer-keys' is broken
* @returns array containing all keys of interface FoodDiaryData
*/
function FoodDiaryDataKeys(): string[]{
    return [
        "date",
        "time",
        "description",
        "carbohydrates",
        "base_insulin",
        "high_correction_insulin",
        "sports_correction_insulin",
        "total_insulin"
    ];
};



