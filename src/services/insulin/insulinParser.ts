import { InsulinModel } from '../../gb/models/InsulinModel';
import { AbbottData } from '../AbbottParser';
import { DateFormat } from '../utils/dates';
import InsulinMapper from './InsulinMapper';

/**
 * Insulin parser class that opens a .csv file and processes it to insulinModel
 * Currently supported insulin sources:
 * - Abbott
 */
export default class InsulinParser {
    insulinData?: InsulinModel[];
    /**
     * File from filePath is read in constructor and parsed, waiting until Ready is advised.
     * @param filePath path to insulin .csv file
     */
    constructor(
        private readonly insulinInput: AbbottData[],
        private readonly insulinSource: InsulinSource = InsulinSource.ABBOTT,
        private readonly dateFormat: DateFormat
    ) {
        // Process incoming insulinInput data
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the insulinModel
     */
    private process() {
        this.insulinData = this.insulinInput.map(InsulinMapper.mapInsulin(this.insulinSource, this.dateFormat));
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
    ABBOTT = 0
}
