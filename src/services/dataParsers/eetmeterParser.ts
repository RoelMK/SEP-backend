import { GameBusToken } from '../../gb/auth/tokenHandler';
import { FoodModel } from '../../gb/models/foodModel';
import { FoodSource } from '../food/foodParser';
import { getFileName } from '../utils/files';
import { DataParser, DataSource, OutputDataType } from './dataParser';
import { Consumptie, EetmeterData } from './dataParserTypes';
/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export class EetMeterParser extends DataParser {
    private eetmeterConsumptionData: Consumptie[] = [];

    /**
     * DataParser construction with DataSource set
     * @param xmlFile file path of Eetmeter file
     */
    constructor(private readonly xmlFile: string, userInfo: GameBusToken) {
        super(DataSource.EETMETER, xmlFile, userInfo);
    }

    /**
     * Function that is called (async) that creates the parsers and filers the data to the correct parsers
     */
    async process(): Promise<void> {
        const eetmeterData: EetmeterData = (await this.parse()) as unknown as EetmeterData;
        this.eetmeterConsumptionData = eetmeterData.Consumpties.Consumptie as Consumptie[];

        // TODO check input and possibly throw input error

        // Not sure why it does not always map it to an array (even with a single element)
        if (this.eetmeterConsumptionData.length == undefined) {
            this.eetmeterConsumptionData = [this.eetmeterConsumptionData as unknown as Consumptie];
        }

        // create the food parser
        this.createParser(OutputDataType.FOOD, this.eetmeterConsumptionData, FoodSource.EETMETER);

        // post data
        await this.postProcessedData();

        // update the timestamp of newest parsed entry to this file
        this.setLastUpdate(getFileName(this.filePath as string), this.getLastProcessedTimestamp());
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData;
    }
}
