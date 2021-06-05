export abstract class ModelParser {
    protected newestEntry = 0;


    constructor(
        protected lastUpdated: number,
        private only_process_newest // whether to upload all input data, or only data after the last update
    ) {}

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
     * This function retrieces the timestamp of the newest entry that is processed w.r.t. its timestamp
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
        if (!this.only_process_newest) return entries;
        return entries.filter((entry: any) => {
            return entry.timestamp > this.lastUpdated;
        });
    }

    //process(): void;

    //abstract post(): void;
}
