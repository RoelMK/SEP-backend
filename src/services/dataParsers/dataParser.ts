import FoodModel from '../../gb/models/foodModel';
import { GlucoseModel } from '../../gb/models/glucoseModel';
import { InsulinModel } from '../../gb/models/insulinModel';
import CSVParser from '../fileParsers/csvParser';
import ExcelParser from '../fileParsers/excelParser';
import FoodParser from '../food/foodParser';
import GlucoseParser from '../glucose/glucoseParser';
import InsulinParser from '../insulin/insulinParser';
import { DateFormat } from '../utils/dates';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser<D extends {} = Record<string, string>> {
    protected csvParser: CSVParser = new CSVParser();
    protected excelParser: ExcelParser = new ExcelParser();
    protected rawData: D[] = [];
    protected dateFormat: DateFormat = DateFormat.NONE;

    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    protected foodParser?: FoodParser;
    protected glucoseParser?: GlucoseParser;
    protected insulinParser?: InsulinParser;

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     */
    constructor(private readonly filePath: string, protected readonly dataSource: DataSource) {}

    protected async parse(): Promise<void> {

        // determine method of parsing by checking file extension
        let extension: string = this.filePath.substring(this.filePath.lastIndexOf('.')+1);

        switch(extension){
            case "csv":
                const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
                this.rawData = (await this.csvParser.parse(this.filePath, skipLine)) as D[];
            case "xlsx":
                this.rawData = (await this.excelParser.parse(this.filePath, this.dataSource)) as D[];

            case "xml":
                //TODO
        }

        
    }

    abstract process(): Promise<void>;

    getData(outputType: OutputDataType): GlucoseModel[] | InsulinModel[] | FoodModel[] | undefined{
        switch (outputType) {
            case OutputDataType.GLUCOSE:
                return this.glucoseParser?.glucoseData;
            case OutputDataType.INSULIN:
                return this.insulinParser?.insulinData;
            case OutputDataType.FOOD:
                return this.foodParser?.foodData;
        }
    }
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
