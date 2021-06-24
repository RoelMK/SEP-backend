import { DataParser } from './dataParser';
import { getDateFormat } from '../utils/dates';
import { getFileName } from '../utils/files';
import { GameBusToken } from '../../gb/auth/tokenHandler';
import { RecordType } from '../../gb/models/glucoseModel';
import {
    AbbottData,
    AbbottDataGuard,
    DataSource,
    emptyAbbottData,
    InputError,
    OutputDataType
} from './dataParserTypes';
import { FoodSource } from '../food/foodTypes';
import { GlucoseSource } from '../glucose/glucoseTypes';
import { InsulinSource } from '../insulin/insulinTypes';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class AbbottParser extends DataParser {
    private abbottData: AbbottData[] = [];
    /**
     * DataParser construction with DataSource set
     * @param abbottFile file path of Abbott file
     */
    constructor(private abbotFile: string, userInfo: GameBusToken) {
        super(DataSource.ABBOTT, abbotFile, userInfo);
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process(): Promise<void> {
        // specify the type of parsed data
        this.abbottData = (await this.parse()) as AbbottData[];

        if (!AbbottDataGuard(this.abbottData[0])) {
            console.log(this.abbottData[0]);
            throw new InputError('Wrong input data for processing Abbott data!');
        }
        // We must first determine whether we are dealing with an US file or an EU file (set dateFormat)
        this.getLocale();

        // We can filter the rawData to get separate glucose, food & insulin data and create their parsers
        const foodData: AbbottData[] = this.filterFood();
        this.createParser(OutputDataType.FOOD, foodData, FoodSource.ABBOTT);

        const glucoseData: AbbottData[] = this.filterGlucose();
        this.createParser(OutputDataType.GLUCOSE, glucoseData, GlucoseSource.ABBOTT);

        const insulinData: AbbottData[] = this.filterInsulin();
        this.createParser(OutputDataType.INSULIN, insulinData, InsulinSource.ABBOTT);

        // post data
        await this.postProcessedData();

        // update the timestamp of newest parsed entry to this file
        this.setLastUpdate(getFileName(this.filePath as string), this.getLastProcessedTimestamp());
    }

    /**
     * Filters the glucose entries from the raw data
     * @returns All glucose entries
     */
    private filterGlucose(): AbbottData[] {
        const glucose = this.abbottData?.filter((entry: AbbottData) => {
            // We only include entries for which the record type is a glucose scan, either historical,
            // manual (strip) or from a scan
            // We also only include entries for which the date is specified
            return (
                parseInt(entry.record_type) === RecordType.SCAN_GLUCOSE_LEVEL ||
                parseInt(entry.record_type) === RecordType.HISTORIC_GLUCOSE_LEVEL ||
                parseInt(entry.record_type) === RecordType.STRIP_GLUCOSE_LEVEL
            );
        });
        if (!glucose) {
            return [emptyAbbottData()];
        }
        return glucose;
    }

    /**
     * Filters the food entries from the raw data
     * @returns All food entries
     */
    private filterFood(): AbbottData[] {
        const food = this.abbottData?.filter((entry: AbbottData) => {
            return (
                parseInt(entry.record_type) === RecordType.CARBOHYDRATES &&
                entry.carbohydrates__grams_
            );
        });
        if (food?.length === 0) {
            return [emptyAbbottData()];
        }
        return food;
    }

    /**
     * Filters the insulin entries from the raw data
     * @returns All insulin entries
     */
    private filterInsulin(): AbbottData[] {
        const insulin = this.abbottData?.filter((entry: AbbottData) => {
            return parseInt(entry.record_type) === RecordType.INSULIN;
        });
        if (insulin?.length === 0) {
            return [emptyAbbottData()];
        }
        return insulin;
    }

    /**
     * Determines the date format (locale) of the input file based on first entry
     */
    private getLocale(): void {
        this.dateFormat = getDateFormat(this.abbottData?.[0].device_timestamp);
    }
}
