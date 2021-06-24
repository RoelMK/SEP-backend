import { InsulinModel } from '../../gb/models/insulinModel';
import { DateFormat } from '../utils/dates';
import InsulinMapper from './insulinMapper';
import { ModelParser } from '../modelParser';
import { GameBusToken } from '../../gb/auth/tokenHandler';
import { InsulinInput, InsulinSource } from './insulinTypes';

/**
 * Insulin parser class that opens a .csv file and processes it to insulinModel
 * Currently supported insulin sources:
 */
export default class InsulinParser extends ModelParser {
    insulinData?: InsulinModel[];

    /**
     * List of insulin datapoints that can stem from several sources
     * @param insulinInput array of insulin inputs
     * @param insulinSource specifies where the insulin input comes from
     * @param dateFormat specifies the format in which dates are represented
     * @param lastUpdated: when this file was processed for the last time
     * @param only_process_newest whether to process all data or only newest
     */
    constructor(
        private readonly insulinInput: InsulinInput,
        private readonly insulinSource: InsulinSource,
        private readonly dateFormat: DateFormat,
        userInfo: GameBusToken,
        only_process_newest: boolean,
        lastUpdated?: number
    ) {
        // Process incoming insulinInput data
        super(userInfo, only_process_newest, lastUpdated);
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the insulinModel
     */
    private process() {
        this.insulinData = this.insulinInput.map(
            InsulinMapper.mapInsulin(this.insulinSource, this.dateFormat)
        );

        // retrieve the last time stamp in the glucoseData and set it as a threshold
        // to prevent double parsing in the future
        this.setNewestEntry(this.insulinData);

        // filter on entries after the last update with this file for this person
        this.insulinData = this.filterAfterLastUpdate(this.insulinData);
        //console.log(`Updating ${this.insulinData.length} insulin entries`);
    }

    /**
     * Posts the imported insulin data to GameBus
     */
    async post(): Promise<void> {
        if (this.userInfo.playerId == 'testing') {
            return;
        }
        try {
            if (this.insulinData && this.insulinData.length > 0)
                await this.gbClient
                    .insulin()
                    .postMultipleInsulinActivities(
                        this.insulinData,
                        parseInt(this.userInfo.playerId)
                    );
        } catch (e) {
            /*continue*/
        }
    }
}
