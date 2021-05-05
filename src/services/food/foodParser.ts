import FoodModel from '../../gb/models/FoodModel';
import { AbbottData } from '../AbbottParser';
import { DateFormat } from '../utils/dates';
import FoodMapper from './FoodMapper';

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
        private readonly foodInput: AbbottData[],
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
    async post() {
        // TODO: post the foodData (correctly formatted) to GameBus
    }
}

/**
 * Current food sources available
 */
export enum FoodSource {
    ABBOTT = 0
}
