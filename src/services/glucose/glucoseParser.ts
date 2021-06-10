import { XOR } from 'ts-xor';
import { GameBusToken } from '../../gb/auth/tokenHandler';
import { GlucoseModel, GlucoseUnit } from '../../gb/models/glucoseModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { NightScoutEntryModel } from '../dataParsers/nightscoutParser';
import { ModelParser } from '../modelParser';
import { DateFormat } from '../utils/dates';
import GlucoseMapper from './glucoseMapper';

/**
 * Glucose parser class that opens a .csv file and processes it to glucoseModel
 * Currently supported glucose sources:
 * - Abbott
 */
export default class GlucoseParser extends ModelParser {
    // Glucose data to be exported
    glucoseData?: GlucoseModel[];

    /**
     * List of glucose datapoints that can stem from several sources
     * @param glucoseInput array of glucose inputs
     * @param glucoseSource specifies where the glucose input comes from
     * @param dateFormat specifies the format in which dates are represented
     * @param lastUpdated: when this file was processed for the last time
     * @param only_process_newest whether to process all data or only newest
     */
    constructor(
        private readonly glucoseInput: GlucoseInput,
        private readonly glucoseSource: GlucoseSource = GlucoseSource.ABBOTT,
        private readonly dateFormat: DateFormat,
        userInfo: GameBusToken,
        only_process_newest: boolean,
        lastUpdated?: number,
        // indicates in which unit the glucose levels are measured
        private glucoseUnit?: GlucoseUnit
    ) {
        super(userInfo, only_process_newest, lastUpdated);
        // Process incoming glucoseInput data
        this.process();
        this.post();
    }

    /**
     * Processes the data (if necessary) and maps it to the GlucoseModel
     */
    private process() {
        // if no glucose unit is specified, assume it based on the date format
        if (this.glucoseUnit === undefined) {
            this.glucoseUnit = this.assumeUnit(this.dateFormat);
        }

        this.glucoseData = this.glucoseInput.map(
            GlucoseMapper.mapGlucose(this.glucoseSource, this.dateFormat, this.glucoseUnit)
        );

        // retrieve the last time stamp in the glucoseData and set it as a threshold
        // to prevent double parsing in the future
        this.setNewestEntry(this.glucoseData);

        // filter on entries after the last update with this file for this person
        this.glucoseData = this.filterAfterLastUpdate(this.glucoseData);
        console.log(`Updating ${this.glucoseData.length} glucose entries`);
    }

    /**
     * Determines the glucoseUnit of the glucose input based on the date format
     */
    private assumeUnit(dateFormat: DateFormat): GlucoseUnit {
        // We assume that the dateFormat also defines which unit to use
        switch (dateFormat) {
            case DateFormat.ABBOTT_EU:
                return GlucoseUnit.MMOL_L;
            case DateFormat.ABBOTT_US:
                return GlucoseUnit.MG_DL;
            default:
                // TODO this should not happen, but should also be caught earlier (see Abbottparser)
                return GlucoseUnit.UNDEFINED;
        }
    }

    /**
     * Posts the imported glucose data to GameBus
     */
    async post(): Promise<void> {
        if (this.glucoseData && this.glucoseData.length > 0)
            this.gbClient
                .glucose()
                .postMultipleGlucoseActivities(this.glucoseData, parseInt(this.userInfo.playerId));
    }
}
/**
 * Current glucose sources available //TODO ? Add more
 */
export enum GlucoseSource {
    ABBOTT = 1,
    NIGHTSCOUT = 2
}

/**
 * All possible input types for glucose data
 */
export type GlucoseInput = XOR<AbbottData[], NightScoutEntryModel[]>;
