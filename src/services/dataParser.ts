import CSVParser from './csvParser';
import { DateFormat } from './utils/dates';
import XMLParser from './xmlParser';
import * as EetmeterModels from '../models/eetmeterModel';
import { AbbottData } from './abbottParser';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser<D extends {} = Record<string, string>> {
    protected csvParser: CSVParser = new CSVParser();
    protected xmlParser: XMLParser = new XMLParser();
    protected rawData: any[] = [];
    protected dateFormat: DateFormat = DateFormat.NONE;

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv or xml file
     * @param dataSource Data source of .csv file (see below)
     * TODO: change to dynamic .csv location/URL
     */
    constructor(private readonly filePath: string, protected readonly dataSource: DataSource) {
        console.log("in dataParser constructor")
    }

    protected async parse(): Promise<void> {
        console.log("in parse of dataParser")
        if(this.dataSource == DataSource.ABBOTT) {
            const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
            this.rawData = (await this.csvParser.parse(this.filePath, skipLine)) as Record<string, string>[];
        } else if (this.dataSource == DataSource.EETMETER) {
            console.log("In data parser for eetmeter")
            this.rawData
            var eetmeterRawData = (await this.xmlParser.parse(this.filePath)) as EetmeterModels.EetmeterData;
            this.rawData = eetmeterRawData.Consumpties.Consumptie as EetmeterModels.Consumptie[]
        }
    }

    abstract process(): Promise<void>;
}

export enum DataSource {
    ABBOTT = 0,
    EETMETER = 1
}
