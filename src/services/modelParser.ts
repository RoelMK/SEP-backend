export abstract class ModelParser {
    protected newestEntry = 0;

    // whether to upload all input data, or only data after the last update
    protected ONLY_UPDATE_NEWEST = true;

    constructor(protected lastUpdated: number) {}

    /**
     * Calculates the most recent entry in the items array by checking
     * the timestamps and updates class variable this.newestEntry to it
     * @param items array of items that have a timestamp
     */
    setNewestEntry(items: any[]) {
        items.forEach((item) => {
            this.newestEntry =
                item.timestamp > this.newestEntry ? item.timestamp : this.newestEntry;
        });
    }

    /**
     * This function retrieces the timestamp of the newest entry that is parsed by its timestamp
     * (so not the time of processing!)
     * @returns the most recent timestamp of all parsed entries
     */
    getNewestEntry(): number {
        return this.newestEntry;
    }
    /**
     * Filters a list of items with a timestamp to only include items after class variable
     * 'this.lastUpdated', i.e. only return entries that took place after last update
     * @param entries 
     * @returns 
     */
    protected filterAfterLastUpdate(entries: any[]) {
        if(!this.ONLY_UPDATE_NEWEST) return entries;
        return entries.filter((entry: any) => entry.timestamp > this.lastUpdated);
    }

    /**
     * Turns off/on the functionality to filter out entries before last update
     * @param only_update_newest whether only entries after last update should be included
     * true = yes, false = no 
     */
    setParseBeforeLastUpdate(only_update_newest: boolean){
        this.ONLY_UPDATE_NEWEST = only_update_newest;
    }

    //process(): void;

    //abstract post(): void;
}
