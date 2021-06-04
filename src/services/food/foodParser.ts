import { FoodModel } from '../../gb/models/foodModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { FoodDiaryData } from '../dataParsers/foodDiaryParser';
import { DateFormat } from '../utils/dates';
import FoodMapper from './foodMapper';
import { XOR } from 'ts-xor';
import { Consumptie } from '../dataParsers/eetmeterParser';
import { NightScoutTreatmentModel } from '../dataParsers/nightscoutParser';

/**
 * Food parser class that opens a .csv file and processes it to foodModels
 * Currently supported food sources:
 * - Abbott
 * TODO: automatically detect food source based on column names
 * TODO: use dynamic format where user is able to pick what column represents what
 */
export default class FoodParser {
    // Food data to be exported
    foodData?: FoodModel[];

    /**
     * Create foodparser with list of food datapoints that can stem from several sources
     * @param foodInput array of food inputs
     * @param foodSource specifies where the food input comes from
     * @param dateFormat specifies the format in which dates are represented
     */
    constructor(
        private readonly foodInput: FoodInput,
        private readonly foodSource: FoodSource,
        private readonly dateFormat: DateFormat
    ) {
        // Process incoming foodInput data
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the FoodModel
     */
    private process() {
        this.foodData = this.foodInput.map(FoodMapper.mapFood(this.foodSource, this.dateFormat));
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post(): Promise<void> {
        // TODO: post the foodData (correctly formatted) to GameBus
    }
}

/**
 * Current food sources available
 */
export enum FoodSource {
    ABBOTT = 0,
    FOOD_DIARY_EXCEL = 1,
    EETMETER = 2,
    NIGHTSCOUT = 3
}

/**
 * All possible input types for food data,
 */
export type FoodInput = XOR<Consumptie[], XOR<AbbottData[], XOR<FoodDiaryData[], NightScoutTreatmentModel[]>>>;
