import { GameBusToken, TokenHandler } from '../gb/auth/tokenHandler';
import { GameBusClient } from '../gb/gbClient';

export abstract class ModelParser {
    protected newestEntry = 0;

    // client for posting to GameBus
    protected gbClient: GameBusClient;

    constructor(
        protected userInfo: GameBusToken,
        // whether to upload all input data, or only data after the last update
        private only_process_newest: boolean,
        private lastUpdated?: number
    ) {
        if(lastUpdated === undefined){this.lastUpdated = 0}
        this.gbClient = new GameBusClient(
            //TODO optional, because it is not used?
            new TokenHandler(
                userInfo.accessToken,
                userInfo.refreshToken as string,
                userInfo.playerId
            )
        );
    }

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
        console.log(this.lastUpdated);
        if (!this.only_process_newest || this.lastUpdated == 0) return entries;
        return entries.filter((entry: any) => {
            return entry.timestamp > (this.lastUpdated as number);
        });
    }

    //process(): void;

    //abstract post(): void;
}
