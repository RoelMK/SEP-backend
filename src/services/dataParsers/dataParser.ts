import FoodModel from '../../gb/models/foodModel';
import { GlucoseModel } from '../../gb/models/glucoseModel';
import { InsulinModel } from '../../gb/models/insulinModel';
import CSVParser from '../fileParsers/csvParser';
import ExcelParser from '../fileParsers/excelParser';
import FoodParser from '../food/foodParser';
import GlucoseParser from '../glucose/glucoseParser';
import InsulinParser from '../insulin/insulinParser';
import { DateFormat } from '../utils/dates';
import { AbbottData } from './abbottParser';
import { FoodDiaryData } from './foodDiaryParser';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser {
    protected csvParser: CSVParser = new CSVParser();
    protected excelParser: ExcelParser = new ExcelParser();
    protected rawData: Record<string, string>[] = [];
    protected dateFormat: DateFormat = DateFormat.NONE;

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     */
    constructor(private readonly filePath: string, protected readonly dataSource: DataSource) {}


    /**
     * Parse data file by looking at its extension and choosing the correct file parser
     */
    protected async parse(): Promise<Record<string, string>[] | undefined> {

        // determine method of parsing by checking file extension
        let extension: string = this.filePath.substring(this.filePath.lastIndexOf('.')+1);
        switch(extension){
            case "csv":
                const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
                return (await this.csvParser.parse(this.filePath, skipLine));
            case "xlsx":
                return (await this.excelParser.parse(this.filePath, this.dataSource));
            case "xml":
                //TODO
        }      
    }

    abstract process(): Promise<void>;

    /**
     * To be called after processing, for retrieving processed data
     * @param outputType Glucose, Insulin or Food
     * @returns Glucose, Insulin or FoodModel object
     */
    abstract getData(outputType: OutputDataType): GlucoseModel[] | InsulinModel[] | FoodModel[] | undefined;
}

export enum DataSource {
    ABBOTT = 0,
    FOOD_DIARY = 1
}

export enum OutputDataType {
    GLUCOSE = 0,
    INSULIN = 1,
    FOOD = 2
}
