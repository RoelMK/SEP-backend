import CSVParser from '../csvParser';
import foodModel from '../../gb/models/foodModel';
import FoodMapper from './foodMapper';
import { AbbottData } from '../csvParser';
import { RecordType } from '../../gb/models/glucoseModel';
import { DateFormat, getDateFormat } from '../dateParser';

/**
 * Food parser class that opens a .csv file and processes it to foodModels
 * Currently supported food sources:
 * - D1NAMO
 * - Abbott
 * TODO: automatically detect food source based on column names
 * TODO: change to dynamic .csv location?
 * TODO: change food input format since D1NAMO does not include a timestamp
 * TODO: use dynamic format where user is able to pick what column represents what
 * TODO: restructure for better overview
 * TODO: make 1 Abbott parser instead of having separate food/glucose parsers
 */
export default class FoodParser {
    private csvParser: CSVParser = new CSVParser();
    private rawData?: any[];
    // DateFormat of data .csv to be determined later
    private dateFormat: DateFormat = DateFormat.NONE;
    foodData?: foodModel[];
    Ready: Promise<any>;

    /**
     * File from filePath is read in constructor and parsed, waiting until Ready is advised.
     * @param filePath path to food .csv file
     */
    constructor(private readonly filePath: string, private readonly foodSource: FoodSource = FoodSource.ABBOTT) {
        this.Ready = new Promise((resolve, reject) => {
            this.parse()
                .then(() => {
                    resolve(undefined);
                })
                .catch(reject);
        });
    }

    /**
     * Parses CSV data to JSON format
     */
    async parse() {
        // Skip line if source is Abbott
        const skipLine: boolean = this.foodSource == FoodSource.ABBOTT;
        this.rawData = await this.csvParser.parse(this.filePath, skipLine);
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the FoodModel
     */
    private process() {
        switch (this.foodSource) {
            case FoodSource.ABBOTT:
                this.processAbbott();
        }
        this.foodData = this.rawData?.map(FoodMapper.mapFood(this.foodSource, this.dateFormat));
    }

    /**
     * Processes Abbott data by first filtering out irrelevant entries
     */
    private processAbbott() {
        // We can ignore all entries for which the record type is not 5 and for which the carbohydrates amount is NaN
        this.rawData = this.rawData?.filter((entry: AbbottData) => {
            return parseInt(entry.record_type) === RecordType.CARBOHYDRATES && entry.carbohydrates__grams_;
        });
        // Also get the date format from the dataset
        // Doing it only for the first entry saves a lot of comparisons
        // TODO: combine Abbott .csv parsing into 1 parser for both glucose, food and insulin
        this.dateFormat = getDateFormat(this.rawData?.[0].device_timestamp);
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post() {
        // TODO: post the foodData (correctly formatted) to GameBus
    }
}

/**
 * D1NAMO food data structure
 */
export interface D1NAMOFoodData {
    picture: string;
    description: string;
    calories: string;
    balance: string;
    quality: string;
}

/**
 * Current food sources available
 */
export enum FoodSource {
    D1NAMO = 0,
    ABBOTT = 1
}
