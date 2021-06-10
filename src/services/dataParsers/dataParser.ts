import { DBClient } from '../../db/dbClient';
import { GameBusToken } from '../../gb/auth/tokenHandler';
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
import { ModelParser } from '../modelParser';
import MoodParser from '../mood/moodParser';
import { DateFormat } from '../utils/dates';
import { getFileExtension, getFileName } from '../utils/files';

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
    protected lastUpdated = 0;

    // whether to parse all incoming data or only new data
    protected only_parse_newest = false;

    // array containing all model parsers used for this data parser
    private intializedParsers: ModelParser[] = [];

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     */
    constructor(
        protected readonly dataSource: DataSource,
        protected filePath: string,
        protected userInfo: GameBusToken,
        protected oneDriveToken?: string,
        protected tableName?: string // for excel parsing
    ) {}

    /**
     * Parse data file by looking at its extension and choosing the correct file parser
     */
    protected async parse(): Promise<Record<string, string | number>[] | undefined> {
        if (!this.filePath) {
            throw new DeveloperError('File path is not set!');
        }

        // retrieve when the file was parsed for the last time
        this.retrieveLastUpdate(getFileName(this.filePath));

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
                return await this.xmlParser.parse(this.filePath);
        }
        throw new InputError(`Unsupported file type ${extension}`);
    }

    /**
     * Allows the program to define the path after the object has been created
     * @param path string representation of the path to the file
     */
    setFilePath(path: string): void {
        this.filePath = path;
    }
    getFilePath(): string {
        return this.filePath;
    }

    abstract process(): Promise<void>;

    /**
     * Creates parsers and allows easy non-duplicative class variable insertion
     * @param type output datatype
     * @param data array containing model objects
     * @param dataSource FoodSource, GlucoseSource or InsulinSource object
     */
    protected createParser(type: OutputDataType, data: any[], dataSource: any): void {
        switch (type) {
            case OutputDataType.FOOD:
                this.foodParser = new FoodParser(
                    data,
                    dataSource,
                    this.dateFormat,
                    this.userInfo,
                    this.only_parse_newest,
                    this.lastUpdated
                );
                this.intializedParsers.push(this.foodParser);
                return;
            case OutputDataType.MOOD:
                //TODO
                this.moodParser = new MoodParser(data, this.userInfo);
                this.intializedParsers.push(this.moodParser);
                return;
            case OutputDataType.INSULIN:
                this.insulinParser = new InsulinParser(
                    data,
                    dataSource,
                    this.dateFormat,
                    this.userInfo,
                    this.only_parse_newest,
                    this.lastUpdated
                );
                this.intializedParsers.push(this.insulinParser);
                return;
            case OutputDataType.GLUCOSE:
                this.glucoseParser = new GlucoseParser(
                    data,
                    dataSource,
                    this.dateFormat,
                    this.userInfo,
                    this.only_parse_newest,
                    this.lastUpdated
                );
                this.intializedParsers.push(this.glucoseParser);
                return;
            default:
                throw Error('Output type is not implemented');
        }
    }
    /**
     * To be called after processing, for retrieving processed data
     * @param outputType Glucose, Insulin or Food
     * @returns Glucose, Insulin or FoodModel object
     */
    getData(
        outputType: OutputDataType
    ): InsulinModel[] | FoodModel[] | GlucoseModel[] | MoodModel[] | undefined {
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

    protected async postProcessedData(): Promise<void> {
        // post all data
        try {
            await this.foodParser?.post();
            await this.glucoseParser?.post();
            await this.insulinParser?.post();
            await this.moodParser?.post();
        } catch (e) {
            console.log('Async kutzooi');
        }
    }

    /**
     * Returns the last timestamp when the file was parsed or the client was called for updates
     */
    protected retrieveLastUpdate(fileName: string): void {
        const dbClient: DBClient = new DBClient(false);
        this.lastUpdated = dbClient.getLastUpdate(this.userInfo.playerId, fileName);
        dbClient.close();
    }

    /**
     * Returns the last timestamp when the file was parsed or the client was called for updates
     * including the file name and playerId
     */
    protected setLastUpdate(fileName: string, timestamp: number) {
        const dbClient: DBClient = new DBClient(false);
        dbClient.registerFileParse(this.userInfo.playerId, fileName, timestamp);
        dbClient.close();
    }

    /**
     * Looks over all parsers and returns the timestamp of the newest datapoint
     * that was parsed and processed
     * @returns the timestamp of the most recent entry that was parsed
     */
    protected getLastProcessedTimestamp(): number {
        const newestModels: number[] = [];
        newestModels.push(this.foodParser ? this.foodParser.getNewestEntry() : 0);
        //newestModels.push(this.moodParser ? this.moodParser.getNewestEntry() : 0); tracking update times for mood is useless
        newestModels.push(this.insulinParser ? this.insulinParser.getNewestEntry() : 0);
        newestModels.push(this.glucoseParser ? this.glucoseParser.getNewestEntry() : 0);
        return Math.max(...newestModels);
    }

    /**
     * Configures whether to upload all incoming data or only data after the last known update
     * @param only_parse_newest true = only process data after last update, false = process all
     */
    parseOnlyNewest(only_parse_newest: boolean): void {
        this.only_parse_newest = only_parse_newest;
    }
}

/**
 * A list of possible data sources
 */
export enum DataSource {
    ABBOTT = 0,
    FOOD_DIARY = 1,
    EETMETER = 2,
    NIGHTSCOUT = 3
}

/**
 * A list of possible output models
 */
export enum OutputDataType {
    GLUCOSE = 0,
    INSULIN = 1,
    FOOD = 2,
    MOOD = 3
}

// custom errors
export class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
    }
}

class DeveloperError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DeveloperError';
    }
}
