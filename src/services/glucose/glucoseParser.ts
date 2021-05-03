import { AbbottData } from '../abbottParser';
import { glucoseModel, GlucoseUnit } from '../../gb/models/glucoseModel';
import GlucoseMapper from './glucoseMapper';
import { DateFormat } from '../dateParser';

/**
 * Glucose parser class that opens a .csv file and processes it to glucoseModel
 * Currently supported glucose sources:
 * - Abbott
 */
export default class GlucoseParser {
    glucoseData?: glucoseModel[];
    /**
     * File from filePath is read in constructor and parsed, waiting until Ready is advised.
     * @param filePath path to glucose .csv file
     */
    constructor(
        private readonly glucoseInput: AbbottData[],
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
        var glucoseUnit: GlucoseUnit;

        // We assume that the dateFormat also defines which unit to use
        switch(this.dateFormat){
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

        this.glucoseData = this.glucoseInput.map(GlucoseMapper.mapGlucose(this.glucoseSource, this.dateFormat, glucoseUnit));
    }

    /**
     * Posts the imported glucose data to GameBus
     */
    async post() {
        // TODO: post the glucoseData to GameBus
    }
}
/**
 * Current glucose sources available //TODO ? Add more
 */
export enum GlucoseSource {
    ABBOTT = 1
}