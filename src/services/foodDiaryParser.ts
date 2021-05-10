import ExcelParser from "./excelParser";
import FoodParser from "./food/foodParser";
import GlucoseParser from "./glucose/glucoseParser";
import InsulinParser from "./insulin/insulinParser";

/**
 * Default class for parsing .xlsx files
 */
export default class FoodDiaryParser {

    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private foodParser?: FoodParser;
    private insulinParser?: InsulinParser;
    
    constructor(private readonly foodDiaryFile: string) {}

    process(rawData: unknown[])  {
        (new ExcelParser()).parse(this.foodDiaryFile);    
    }
}   