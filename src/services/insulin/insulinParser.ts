import { InsulinModel } from '../../gb/models/insulinModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { DateFormat } from '../utils/dates';
import InsulinMapper from './insulinMapper';
import { FoodDiaryData } from '../dataParsers/foodDiaryParser';
/**
 * Insulin parser class that opens a .csv file and processes it to insulinModel
 * Currently supported insulin sources:
 * - Abbott
 */
export default class InsulinParser<D extends {} = AbbottData | FoodDiaryData > {
    insulinData?: InsulinModel[];
    /**
     * File from filePath is read in constructor and parsed, waiting until Ready is advised.
     * @param filePath path to insulin .csv file
     */
    constructor(
        private readonly insulinInput: D[],
        private readonly insulinSource: InsulinSource,
        private readonly dateFormat: DateFormat
    ) {
        // Process incoming insulinInput data
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the insulinModel
     */
    private process() {
        this.insulinData = this.insulinInput.map(InsulinMapper.mapInsulin(this.insulinSource, this.dateFormat));

    }

    /**
     * Posts the imported insulin data to GameBus
     */
    async post() {
        // TODO: post the insulinData to GameBus
    }
}
/**
 * Current insulin sources available //TODO ? Add more
 */
export enum InsulinSource {
    ABBOTT = 0,
    FOOD_DIARY_EXCEL = 1
}
