import { GlucoseModel, GlucoseUnit } from '../../gb/models/glucoseModel';
import { AbbottData } from '../dataParsers/abbottParser';
import { DateFormat } from '../utils/dates';
import GlucoseMapper from './glucoseMapper';

/**
 * Glucose parser class that opens a .csv file and processes it to glucoseModel
 * Currently supported glucose sources:
 * - Abbott
 */
export default class GlucoseParser {
    // Glucose data to be exported
    glucoseData?: GlucoseModel[];

    /**
     * List of glucose datapoints that can stem from several sources
     * @param glucoseInput array of glucose inputs
     * @param glucoseSource specifies where the glucose input comes from
     * @param dateFormat specifies the format in which dates are represented
     */
    constructor(
        private readonly glucoseInput: GlucoseInput,
        private readonly glucoseSource: GlucoseSource = GlucoseSource.ABBOTT,
        private readonly dateFormat: DateFormat
    ) {
        // Process incoming glucoseInput data
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the GlucoseModel
     */
    private process() {
        // indicates in which unit the glucose levels are measured
        let glucoseUnit: GlucoseUnit;

        // We assume that the dateFormat also defines which unit to use
        switch (this.dateFormat) {
            case DateFormat.ABBOTT_EU:
                glucoseUnit = GlucoseUnit.MMOL_L;
                break;
            case DateFormat.ABBOTT_US:
                glucoseUnit = GlucoseUnit.MG_DL;
                break;
            default:
                // TODO this should not happen, but should also be caught earlier (see Abbottparser)
                glucoseUnit = GlucoseUnit.UNDEFINED;
                break;
        }

        this.glucoseData = this.glucoseInput.map(
            GlucoseMapper.mapGlucose(this.glucoseSource, this.dateFormat, glucoseUnit)
        );
    }

    /**
     * Posts the imported glucose data to GameBus
     */
    async post(): Promise<void> {
        // TODO: post the glucoseData to GameBus
    }
}
/**
 * Current glucose sources available //TODO ? Add more
 */
export enum GlucoseSource {
    ABBOTT = 1
}

/**
 * All possible input types for glucose data
 */
export type GlucoseInput = AbbottData[];
