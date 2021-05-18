import FoodModel from '../../gb/models/foodModel';
import FoodParser, { FoodSource } from '../food/foodParser';
import * as EetmeterModels from '../../models/eetmeterModel';
import { DataParser, DataSource } from './dataParser';
/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class EetMeterParser extends DataParser {
    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private eetmeterConsumptionData: EetmeterModels.Consumptie[] = [];

    /**
     * DataParser construction with DataSource set
     * @param xmlFile file path of Eetmeter file
     */
    constructor(private readonly xmlFile: string) {
        super(DataSource.EETMETER, xmlFile);
    }

    /**
     * Function that is called (async) that creates the parsers and filers the data to the correct parsers
     */
    async process() {
        await this.parse();
        let eetmeterData: EetmeterModels.EetmeterData = (this.rawData as unknown as EetmeterModels.EetmeterData); 
        this.eetmeterConsumptionData = eetmeterData.Consumpties.Consumptie as EetmeterModels.Consumptie[];
        // Not sure why it does not always map it to an array (even with a single element)
        if (this.eetmeterConsumptionData.length == undefined) {
            this.eetmeterConsumptionData = [this.eetmeterConsumptionData as unknown as EetmeterModels.Consumptie];
        }
        this.foodParser = new FoodParser(this.eetmeterConsumptionData, FoodSource.EETMETER, this.dateFormat);
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData;
    }
}
