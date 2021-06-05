export abstract class FileParser { //TODO can be removed possibly

    /**
     * Reads raw data of a file and returns it
     * Can have multiple arguments that are not predefined
     */
    abstract parse(filePath: string, v2?, v3?, v4?, v5?): Promise<Record<string, string>[]> | Record<string, string>[];
}
