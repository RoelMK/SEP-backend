export abstract class ModelParser {
   
    protected newestEntry = 0;

    setNewestEntry(items: any[]) {
        items.forEach((item) => {
            this.newestEntry =
                item.timestamp > this.newestEntry ? item.timestamp : this.newestEntry;
        });
    }

    getNewestEntry(): number{
        return this.newestEntry;
    }

    //process(): void;

    //abstract post(): void;
}
