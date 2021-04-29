import CSVParser from './csvParser';
import { DateFormat } from './dateParser';

/**
 * Abstract DataParser class that can take a .csv file as input and pass it onto other parsers
 */
export abstract class DataParser {
    protected csvParser: CSVParser = new CSVParser();
    protected rawData?: any[];
    protected dateFormat: DateFormat = DateFormat.NONE;

    // Promise to handle async functions in constructor
    Ready: Promise<any>;

    /**
     * Constructor needs async parse function so we create a Promise that should be awaited by the end user before continuing
     * @param filePath Path to .csv file
     * @param dataSource Data source of .csv file (see below)
     * TODO: change to dynamic .csv location/URL
     */
    constructor(private readonly filePath: string, protected readonly dataSource: DataSource) {
        this.Ready = new Promise((resolve, reject) => {
            this.parse()
                .then(() => {
                    resolve(undefined);
                })
                .catch(reject);
        });
    }

    private async parse() {
        const skipLine: boolean = this.dataSource == DataSource.ABBOTT;
        this.rawData = await this.csvParser.parse(this.filePath, skipLine);
    }

    protected abstract process(): void;
}

export enum DataSource {
    ABBOTT = 0
}
