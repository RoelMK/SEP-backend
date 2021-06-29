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
import {
    CombinedDataParserOutput,
    DataSource,
    DeveloperError,
    InputError,
    OutputDataType
} from './dataParserTypes';

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
                    this.userInfo, // This is for making sure we are only posting new food data
                    this.only_parse_newest,
                    this.lastUpdated
                );
                this.intializedParsers.push(this.foodParser);
                return;
            case OutputDataType.MOOD:
                //TODO implement moodparser (if mood from other sources is parsed)
                this.moodParser = new MoodParser(data, this.userInfo);
                this.intializedParsers.push(this.moodParser);
                return;
            case OutputDataType.INSULIN:
                this.insulinParser = new InsulinParser(
                    data,
                    dataSource,
                    this.dateFormat,
                    this.userInfo, // This is for making sure we are only posting new insulin data
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
                    this.userInfo, // This is for making sure we are only posting new glucose data
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
     * @param outputType Glucose, Insulin, Food, Mood or All
     * @returns Glucose, Insulin, Food, Mood or Combined models
     */
    getData(
        outputType: OutputDataType
    ):
        | InsulinModel[]
        | FoodModel[]
        | GlucoseModel[]
        | MoodModel[]
        | CombinedDataParserOutput
        | undefined {
        switch (outputType) {
            case OutputDataType.GLUCOSE:
                return this.glucoseParser?.glucoseData;
            case OutputDataType.INSULIN:
                return this.insulinParser?.insulinData;
            case OutputDataType.FOOD:
                return this.foodParser?.foodData;
            case OutputDataType.MOOD:
                return this.moodParser?.mood;
            case OutputDataType.ALL:
                // Should return all of the types (if they are present)
                return {
                    /** For every type we check:
                     * If the parser is defined
                     * If the parser has any data
                     * If the data has any entries
                     *
                     * If any of these properties do not hold, we set as null
                     */
                    food:
                        this.foodParser &&
                        this.foodParser.foodData &&
                        this.foodParser.foodData.length > 0
                            ? this.foodParser.foodData
                            : null,
                    glucose:
                        this.glucoseParser &&
                        this.glucoseParser.glucoseData &&
                        this.glucoseParser.glucoseData.length > 0
                            ? this.glucoseParser.glucoseData
                            : null,
                    insulin:
                        this.insulinParser &&
                        this.insulinParser.insulinData &&
                        this.insulinParser.insulinData.length > 0
                            ? this.insulinParser.insulinData
                            : null,
                    mood: this.moodParser && this.moodParser.mood ? [this.moodParser.mood] : null
                } as CombinedDataParserOutput;

            default:
                return [];
        }
    }

    protected async postProcessedData(): Promise<void> {
        const promises: Promise<any>[] = [];
        // post all data
        if (this.foodParser) promises.push(this.foodParser.post());
        if (this.glucoseParser) promises.push(this.glucoseParser.post());
        if (this.insulinParser) promises.push(this.insulinParser.post());
        if (this.moodParser) promises.push(this.moodParser.post());
        await Promise.all(promises);
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
        //TODO moodparser is not implemented
        //newestModels.push(this.moodParser ? this.moodParser.getNewestEntry() : 0);
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
