import FoodModel from '../gb/models/foodModel';
import { GlucoseModel } from '../gb/models/glucoseModel';
import { InsulinModel } from '../gb/models/insulinModel';
import { DataParser, DataSource } from './dataParser';
import FoodParser, { FoodSource } from './food/foodParser';
import * as EetmeterModels from '../models/eetmeterModel';
import { getDateFormat } from './utils/dates';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class EetMeterParser extends DataParser {
    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private foodParser?: FoodParser;

    // private : FoodDiaryData[] = [];

    /**
     * DataParser construction with DataSource set
     * @param abbotFile file path of Abbott file
     */
    constructor(private readonly xmlFile: string) {
        super(xmlFile, DataSource.EETMETER);
        console.log("in eetmeter parser constructor ");
        // this.process()
    }

    /**
     * Function that is called (async) that creates the parsers and filers the data to the correct parsers
     */
    async process() {
        console.log("in process of ")
        await this.parse();
        // We must first determine whether we are dealing with an US file or an EU file (set dateFormat)
        // this.getLocale();

        // We can filter the rawData to get separate glucose, food & insulin data and create their parsers
        
        //get array of consumptions with their dates
        // const foodData = this.filterFood();
        // this.foodDiaryData = (await this.parse()) as EetmeterModels.EetmeterData[];

        this.foodParser = new FoodParser(FoodSource.EETMETER, this.dateFormat, this.rawData);   
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData
    }
}