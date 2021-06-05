export abstract class ModelParser {
    protected newestEntry = 0;

    // whether to upload all input data, or only data after the last update
    protected ONLY_UPDATE_NEWEST = true;

    constructor(protected lastUpdated: number) {}
    setNewestEntry(items: any[]) {
        items.forEach((item) => {
            this.newestEntry =
                item.timestamp > this.newestEntry ? item.timestamp : this.newestEntry;
        });
    }

    getNewestEntry(): number {
        return this.newestEntry;
    }

    protected filterAfterLastUpdate(entries: any[]) {
        if(!this.ONLY_UPDATE_NEWEST) return entries;
        return entries.filter((entry: any) => entry.timestamp > this.lastUpdated);
    }

    //process(): void;

    //abstract post(): void;
}
