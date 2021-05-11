import { DataParser, DataSource, OutputDataType } from "./dataParser";
import ExcelParser from "../fileParsers/excelParser";
import FoodParser, { FoodSource } from "../food/foodParser";
import GlucoseParser from "../glucose/glucoseParser";
import InsulinParser, { InsulinSource } from "../insulin/insulinParser";
import { DateFormat } from "../utils/dates";
import { fil } from "date-fns/locale";
import { GlucoseModel } from "../../gb/models/glucoseModel";



/**
 * Default class for parsing food diaries
 */
export default class FoodDiaryParser extends DataParser<FoodDiaryData> {

    
    constructor(private readonly foodDiaryFile: string, private readonly doAutoFill: boolean) {
        super(foodDiaryFile, DataSource.FOOD_DIARY);
    }

    /**
     * Function that is called (async) that creates the parsers and passes the data to the correct lower parsers
     */
    async process()  {
        await (this.parse()); 

        //auto-fills empty cells in the Excel
        if(this.doAutoFill){
            this.rawData = this.autoFill(this.rawData);
        }

        this.foodParser = new FoodParser<FoodDiaryData>(this.rawData, FoodSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
        this.insulinParser = new InsulinParser<FoodDiaryData>(this.rawData, InsulinSource.FOOD_DIARY_EXCEL, DateFormat.FOOD_DIARY);
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





