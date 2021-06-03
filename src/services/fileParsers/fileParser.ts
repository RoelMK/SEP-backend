import { time } from "console";
import { DBClient } from "../../db/dbClient";

export abstract class FileParser {

    // last parsed date of the file as unix timestamp
    protected lastParsedAt: number = 0;

    constructor() {}

    /**
     * Returns the last timestamp when the file was parsed
     */
    retrieveLastParsedAt(filePath: string): void {
        const dbClient: DBClient = new DBClient(false);
        this.lastParsedAt = dbClient.getFileParseTime("1", filePath);
        console.log(this.lastParsedAt);
        dbClient.close();
    }

    /**
     * Returns the last timestamp when the file was parsed
     */
     setLastParsedAt(filePath: string, time_stamp: number): void {
        const dbClient: DBClient = new DBClient(false);
        dbClient.registerFileParse("1", filePath, time_stamp);
        dbClient.close();
    }

    /**
     * Reads raw data of a file and returns it
     * Can have multiple arguments that are not predefined
     */
    abstract parse(filePath: string, v2?, v3?, v4?, v5?): Promise<Record<string, string>[]> | Record<string, string>[];
}
