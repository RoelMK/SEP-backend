import FoodModel from '../../gb/models/foodModel';
import { AbbottData, AbbottDataType } from '../abbottParser';
import { DateFormat } from '../utils/dates';
import FoodMapper from './foodMapper';
import * as EetmeterModels from '../../models/eetmeterModel';

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

    // TODO: change to other inputs if needed
    constructor(
        private readonly foodInput: FoodInput[],
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
        console.log(this.foodInput);
        console.log(this.foodInput.length);

        this.foodData = this.foodInput.map(FoodMapper.mapFood(this.foodSource, this.dateFormat));
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post() {
        // TODO: post the foodData (correctly formatted) to GameBus
    }
}

/**
 * Current food sources available
 */
export enum FoodSource {
    ABBOTT = 0,
    EETMETER = 1
}

export type FoodInput = XOR<AbbottData, EetmeterModels.Consumptie>;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
