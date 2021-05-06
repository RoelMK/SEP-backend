import CSVParser from './csvParser';
import { DateFormat } from './utils/dates';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser<D extends {} = Record<string, string>> {
    protected csvParser: CSVParser = new CSVParser();
    protected rawData: D[] = [];
    protected dateFormat: DateFormat = DateFormat.NONE;

    /**
     * Constructor with file path and data source (provided by children)
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     * TODO: change to dynamic .csv location/URL
     */
    constructor(private readonly filePath: string, protected readonly dataSource: DataSource) {}

    protected async parse(): Promise<void> {
        const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
        this.rawData = (await this.csvParser.parse(this.filePath, skipLine)) as D[];
    }

    abstract process(): Promise<void>;
}

export enum DataSource {
    ABBOTT = 0
}   
