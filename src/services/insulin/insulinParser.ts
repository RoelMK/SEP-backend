import { InsulinModel } from '../../gb/models/insulinModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { DateFormat } from '../utils/dates';
import InsulinMapper from './insulinMapper';
import { FoodDiaryData } from '../dataParsers/foodDiaryParser';
import { XOR } from 'ts-xor';
/**
 * Insulin parser class that opens a .csv file and processes it to insulinModel
 * Currently supported insulin sources:
 * - Abbott
 */
export default class InsulinParser {
    insulinData?: InsulinModel[];

    /**
     * List of insulin datapoints that can stem from several sources
     * @param insulinInput array of insulin inputs
     * @param insulinSource specifies where the insulin input comes from
     * @param dateFormat specifies the format in which dates are represented
     */
    constructor(
        private readonly insulinInput: InsulinInput,
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
        this.insulinData = this.insulinInput.map(
            InsulinMapper.mapInsulin(this.insulinSource, this.dateFormat)
        );
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

/**
 * All possible input types for insulin data
 */
export type InsulinInput = XOR<AbbottData[], FoodDiaryData[]>;
