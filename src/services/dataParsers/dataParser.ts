import { DBClient } from '../../db/dbClient';
import { FoodModel } from '../../gb/models/foodModel';
import { GlucoseModel } from '../../gb/models/glucoseModel';
import { InsulinModel } from '../../gb/models/insulinModel';
import { MoodModel } from '../../gb/models/moodModel';
import CSVParser from '../fileParsers/csvParser';
import ExcelParser from '../fileParsers/excelParser';
import OneDriveExcelParser from '../fileParsers/oneDriveExcelParser';
import XMLParser from '../fileParsers/xmlParser';
import FoodParser from '../food/foodParser';
import GlucoseParser from '../glucose/glucoseParser';
import InsulinParser from '../insulin/insulinParser';
import MoodParser from '../mood/moodParser';
import { DateFormat } from '../utils/dates';
import { getFileExtension, getFileName } from '../utils/files';
import { NightScoutEntryModel } from './nightscoutParser';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser {
    protected csvParser: CSVParser = new CSVParser();
    protected excelParser: ExcelParser = new ExcelParser();
    protected xmlParser: XMLParser = new XMLParser();
    protected oneDriveExcelParser: OneDriveExcelParser = new OneDriveExcelParser();
    protected rawData: Record<string, string>[] = [];
    protected dateFormat: DateFormat = DateFormat.NONE;

    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    protected foodParser?: FoodParser;
    protected glucoseParser?: GlucoseParser;
    protected insulinParser?: InsulinParser;
    protected moodParser?: MoodParser;

    // UNIX timestamp in ms that indicates when it was last parsed
    protected lastParsed: number = 0;

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     */
    constructor(
        protected readonly dataSource: DataSource,
        protected filePath?: string,
        protected oneDriveToken?: string,
        protected tableName?: string // for excel parsing
    ) {}

    /**
     * Parse data file by looking at its extension and choosing the correct file parser
     */
    protected async parse(): Promise<Record<string, string | number>[] | undefined> {
        if (!this.filePath) {
            throw Error('File path is not set!');
        }

        // retrieve when the file was parsed for the last time
        this.lastParsed = this.retrieveLastParsed(getFileName(this.filePath));

        // determine method of parsing by checking file extension
        const extension: string = getFileExtension(this.filePath);
        switch (extension) {
            case 'csv':
                // eslint-disable-next-line no-case-declarations
                const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
                return await this.csvParser.parse(this.filePath, skipLine);
            case 'xlsx':
                if (this.oneDriveToken === undefined)
                    return await this.excelParser.parse(this.filePath, this.dataSource);

                return await this.oneDriveExcelParser.parse(
                    this.filePath,
                    this.dataSource,
                    this.oneDriveToken,
                    this.tableName as string
                );

            case 'xml':
                if (this.dataSource == DataSource.EETMETER) {
                    return await this.xmlParser.parse(this.filePath);
                }
        }
    }

    /**
     * Allows the program to define the path after the object has been created
     * @param path string representation of the path to the file
     */
    setFilePath(path: string): void {
        this.filePath = path;
    }

    abstract process(): Promise<void>;

    /**
     * To be called after processing, for retrieving processed data
     * @param outputType Glucose, Insulin or Food
     * @returns Glucose, Insulin or FoodModel object
     */
    getData(
        outputType: OutputDataType
    ):
        | InsulinModel[]
        | FoodModel[]
        | GlucoseModel[]
        | NightScoutEntryModel[]
        | MoodModel[]
        | undefined {
        switch (outputType) {
            case OutputDataType.GLUCOSE:
                return this.glucoseParser?.glucoseData;
            case OutputDataType.INSULIN:
                return this.insulinParser?.insulinData;
            case OutputDataType.FOOD:
                return this.foodParser?.foodData;

            case OutputDataType.MOOD:
                return [this.moodParser?.mood as MoodModel];

            default:
                // TODO this should not happen
                return [];
        }
    }

    /**
     * Returns the last timestamp when the file was parsed
     */
    retrieveLastParsed(filePath: string): number {
        const dbClient: DBClient = new DBClient(false);
        const lastParsedAt: number = dbClient.getLastParsed('1', filePath);
        dbClient.close();
        return lastParsedAt;
    }

    /**
     * Returns the last timestamp when the file was parsed, including the file name and
     * playerId
     */
    setLastParsed(fileName: string, timestamp: number) {
        const dbClient: DBClient = new DBClient(false);
        dbClient.registerFileParse('1', fileName, timestamp);
        dbClient.close();
    }

    getLastPostedModel(): number {
        let newestModels: number[] = [];
        newestModels.push(this.foodParser ? this.foodParser.getNewestEntry() : 0);
        newestModels.push(this.moodParser ? this.moodParser.getNewestEntry() : 0);
        newestModels.push(this.insulinParser ? this.insulinParser.getNewestEntry() : 0);
        newestModels.push(this.glucoseParser ? this.glucoseParser.getNewestEntry() : 0);
        return Math.max.apply(Math, newestModels);
    }
}

export enum DataSource {
    ABBOTT = 0,
    FOOD_DIARY = 1,
    EETMETER = 2,
    NIGHTSCOUT = 3
}

export enum OutputDataType {
    GLUCOSE = 0,
    INSULIN = 1,
    FOOD = 2,
    MOOD = 3
}
