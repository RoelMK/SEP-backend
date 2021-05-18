import FoodModel from '../gb/models/foodModel';
import { DataParser, DataSource } from './dataParser';
import FoodParser, { FoodSource } from './food/foodParser';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class EetMeterParser extends DataParser {
    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private foodParser?: FoodParser;

    /**
     * DataParser construction with DataSource set
     * @param xmlFile file path of Eetmeter file
     */
    constructor(private readonly xmlFile: string) {
        super(xmlFile, DataSource.EETMETER);
    }

    /**
     * Function that is called (async) that creates the parsers and filers the data to the correct parsers
     */
    async process() {
        await this.parse();

        this.foodParser = new FoodParser(this.rawData, FoodSource.EETMETER, this.dateFormat);
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData;
    }
}
