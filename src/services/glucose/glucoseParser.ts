import CSVParser from '../csvParser';
import { AbbottData } from '../csvParser';
import { glucoseModel, RecordType } from '../../gb/models/glucoseModel';
import GlucoseMapper from './glucoseMapper';
import { parse, isValid } from 'date-fns';
import { DateFormat, getDateFormat } from '../dateParser';

/**
 * Glucose parser class that opens a .csv file and processes it to glucoseModel
 * Currently supported food sources:
 * - Abott
 */
export default class GlucoseParser {
    private csvParser: CSVParser = new CSVParser();
    private rawData?: any[];
    glucoseData?: glucoseModel[];
    // DateFormat of data .csv to be determined later
    private dateFormat: DateFormat = DateFormat.NONE;
    Ready: Promise<any>;

    /**
     * File from filePath is read in constructor and parsed, waiting until Ready is advised.
     * @param filePath path to food .csv file
     */
    constructor(
        private readonly filePath: string,
        private readonly glucoseSource: GlucoseSource = GlucoseSource.ABOTT
    ) {
        this.Ready = new Promise((resolve, reject) => {
            this.parse()
                .then(() => {
                    resolve(undefined);
                })
                .catch(reject);
        });
    }

    /**
     * Parses CSV data to JSON format
     */
    async parse() {
        // Skip line if source is Abott
        const skipLine: boolean = this.glucoseSource == GlucoseSource.ABOTT;
        this.rawData = await this.csvParser.parse(this.filePath, skipLine);
        this.process();
    }

    /**
     * Processes the data (if necessary) and maps it to the FoodModel
     */
    private process() {
        switch (this.glucoseSource) {
            case GlucoseSource.ABOTT:
                this.processAbott();
        }
        console.log(this.rawData);
        this.glucoseData = this.rawData?.map(GlucoseMapper.mapFood(this.glucoseSource, this.dateFormat));
    }

    /**
     * Processes Abott data by first filtering out irrelevant entries
     */
    private processAbott() {
        // We only include entries for which the record type is a glucose scan, either historical, manual (strip) or from a scan
        // We also only include entries for which the date is specified

        this.rawData = this.rawData?.filter((entry: AbbottData) => {
            return (
                (parseInt(entry.record_type) === RecordType.SCAN_GLUCOSE_LEVEL ||
                    parseInt(entry.record_type) === RecordType.HISTORIC_GLUCOSE_LEVEL ||
                    parseInt(entry.record_type) === RecordType.STRIP_GLUCOSE_LEVEL) &&
                getDateFormat(entry.device_timestamp) !== DateFormat.NONE
            );
        });

        // TODO check if not NONE
        this.dateFormat = getDateFormat(this.rawData?.[0].device_timestamp);
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
    ABOTT = 1
}
