import { InsulinModel } from '../../gb/models/insulinModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { DateFormat } from '../utils/dates';
import InsulinMapper from './insulinMapper';
import { FoodDiaryData } from '../dataParsers/foodDiaryParser';
import { XOR } from 'ts-xor';
import { NightScoutTreatmentModel } from '../dataParsers/nightscoutParser';
import { ModelParser } from '../modelParser';
import { DiabetterUserInfo } from '../dataParsers/dataParser';
/**
 * Insulin parser class that opens a .csv file and processes it to insulinModel
 * Currently supported insulin sources:
 * - Abbott
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
        private readonly userInfo: DiabetterUserInfo,
        only_process_newest: boolean,
        lastUpdated?: number
    ) {
        // Process incoming insulinInput data
        super(only_process_newest, lastUpdated);
        this.process();
        this.post();
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
    }

    /**
     * Posts the imported insulin data to GameBus
     */
    async post(): Promise<void> {
        // TODO: post the insulinData to GameBus
    }
}
/**
 * Current insulin sources available //TODO ? Add more
 */
export enum InsulinSource {
    ABBOTT = 0,
    FOOD_DIARY_EXCEL = 1,
    NIGHTSCOUT = 2
}

/**
 * All possible input types for insulin data
 */
export type InsulinInput = XOR<AbbottData[], XOR<FoodDiaryData[], NightScoutTreatmentModel[]>>;
