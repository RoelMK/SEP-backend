import { FoodModel } from '../../gb/models/foodModel';
import { DateFormat } from '../utils/dates';
import FoodMapper from './foodMapper';

import { ModelParser } from '../modelParser';
import { GameBusToken } from '../../gb/auth/tokenHandler';

import { FoodInput, FoodSource } from './foodTypes';

/**
 * Food parser class that opens a .csv file and processes it to foodModels
 * Currently supported food sources:
 * - Abbott
 */
export default class FoodParser extends ModelParser {
    // Food data to be exported
    foodData?: FoodModel[];

    /**
     * Create foodparser with list of food datapoints that can stem from several sources
     * @param foodInput array of food inputs
     * @param foodSource specifies where the food input comes from
     * @param dateFormat specifies the format in which dates are represented
     * @param lastUpdated: when this file was processed for the last time
     * @param only_process_newest whether to process all data or only newest
     */
    constructor(
        private readonly foodInput: FoodInput,
        private readonly foodSource: FoodSource,
        private readonly dateFormat: DateFormat,
        userInfo: GameBusToken,
        only_process_newest: boolean,
        lastUpdated?: number
    ) {
        super(userInfo, only_process_newest, lastUpdated);
        // Process incoming foodInput data
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the FoodModel
     */
    private process() {
        this.foodData = this.foodInput.map(FoodMapper.mapFood(this.foodSource, this.dateFormat));
        // retrieve the last time stamp in the glucoseData and set it as a threshold
        // to prevent double parsing in the future
        this.setNewestEntry(this.foodData);

        // filter on entries after the last update with this file for this person
        this.foodData = this.filterAfterLastUpdate(this.foodData);
        //console.log(`Updating ${this.foodData.length} food entries`);
    }

    /**
     * Posts the imported food data to GameBus
     */
    async post(): Promise<void> {
        if (this.userInfo.playerId == 'testing') {
            return; // For testing food posting
        }
        try {
            if (this.foodData && this.foodData.length > 0)
                await this.gbClient
                    .food()
                    .postMultipleFoodActivities(this.foodData, parseInt(this.userInfo.playerId));
        } catch (e) {
            /*continue*/
        }
    }
}
