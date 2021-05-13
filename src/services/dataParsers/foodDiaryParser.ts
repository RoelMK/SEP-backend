import { DataParser, DataSource, OutputDataType } from "./dataParser";
import FoodParser, { FoodSource } from "../food/foodParser";
import InsulinParser, { InsulinSource } from "../insulin/insulinParser";
import { DateFormat } from "../utils/dates";




/**
 * Default class for parsing food diaries
 */
export default class FoodDiaryParser extends DataParser {

    private foodDiaryData: FoodDiaryData[] = [];

    constructor(private readonly doAutoFill: boolean, private foodDiaryFile?: string,) {
        super(DataSource.FOOD_DIARY, foodDiaryFile);
    }

    /**
     * Function that is called (async) that creates the parsers and passes the data to the correct lower parsers
     */
    async process()  {
        // specify the type of parsed data
        this.foodDiaryData = (await this.parse()) as FoodDiaryData[];

        // TODO is this at the correct place
        if (!FoodDiaryDataGuard(this.foodDiaryData[0])){
            console.log(this.foodDiaryData[0]);
            throw Error("Wrong input data for processing food diary data!");
        }
        //auto-fills empty cells in the Excel
        if(this.doAutoFill){
            const filledFoodDiaryData: FoodDiaryData[] = this.autoFill(this.foodDiaryData);
            this.foodParser = new FoodParser(filledFoodDiaryData, FoodSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
            this.insulinParser = new InsulinParser(filledFoodDiaryData, InsulinSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
        }else{
            this.foodParser = new FoodParser(this.foodDiaryData, FoodSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
            this.insulinParser = new InsulinParser(this.foodDiaryData, InsulinSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
        }
    }

    /**
     * Automatically fills rows where the date is left out with the last date
     * above it that has been entered (for ease of use in maintaining the file)
     * Automatically computes total insulin if not specified, but other subtypes of insulin are
     * 
     * This is done with raw data, because the order of the rows matters and most columns are needed
     * @param rawData Array of FoodDiary items 
     */
    private autoFill(rawData: FoodDiaryData[]): FoodDiaryData[]{
        // TODO PROBABLY VERY SLOW
        let lastDate: string = '';

        // loop over raw data
        for (let index = 0; index < rawData.length; index++) {
            const element = rawData[index];

            // automatically fills in the last known date if not specified
            if(element.date != ''){
                lastDate = element.date;
            }else{
                element.date = lastDate;
            }

            // automatically computes the sum of insulin if not specified
            if(element.total_insulin == ''){
                const base = element.base_insulin == '' ? 0 : parseFloat(element.base_insulin);
                const high_correct = element.high_correction_insulin == '' ? 0 : parseFloat(element.high_correction_insulin);
                const sports_correct = element.sports_correction_insulin == '' ? 0 : parseFloat(element.sports_correction_insulin);
                if(base + high_correct + sports_correct > 0){
                    element.total_insulin = (base + high_correct + sports_correct).toString();
                }
            }
        }
        return rawData;
    }
}   






/**
 * Type of a parsed food diary, extends string, string records
 */
export type FoodDiaryData = { 
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
 * Function to check if an object belongs to the FoodDiaryData interface
 * @param object any object
 * @returns whether the object is part of the interface AbbottData
 */
 function FoodDiaryDataGuard(object: any): object is FoodDiaryData{
    return ('date' in object) &&
           ('time' in object) &&
           ('description' in object) &&
           ('carbohydrates' in object) &&
           ('base_insulin' in object) &&
           ('high_correction_insulin' in object) &&
           ('total_insulin' in object)        
}





