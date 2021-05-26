import { GlucoseUnit } from '../../gb/models/glucoseModel';
import { NightScoutClient } from '../../nightscout/nsClient';
import GlucoseParser, { GlucoseSource } from '../glucose/glucoseParser';
import { DataParser, DataSource } from './dataParser';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class NightscoutParser extends DataParser {
    private nightScoutData: NightScoutEntry[] = [];

    private glucoseUnit: GlucoseUnit = GlucoseUnit.UNDEFINED;

    /**
     * DataParser construction with DataSource set
     * @param nightScoutHost the url which points to the host of the nightscout instance
     * @param token the private token generated for Diabetter
     */
    constructor(private nightScoutHost: string, private token?: string) {
        super(DataSource.NIGHTSCOUT, '');
    }

    /**
     * Obtain all nightscoutentries from the nightscout instance
     * @returns all NightScoutEntries that can be fetched from the nightscout instance
     */
    protected async parse(): Promise<NightScoutEntry[]> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        this.glucoseUnit = await nsClient.getGlucoseUnit();
        const entries: NightScoutEntry[] = await nsClient.getEntries();
        return entries;
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process() {
        // specify the type of parsed data
        this.nightScoutData = await this.parse();
        this.glucoseParser = new GlucoseParser(this.nightScoutData, GlucoseSource.NIGHTSCOUT, this.dateFormat, this.glucoseUnit);
    }
}

export type NightScoutEntry = {
    type: string;
    dateString?: string;
    date: number;
    sgv: number;
    direction?: string;
    noise?: number;
    filtered?: number;
    unfiltered?: number;
    rssi?: number;
};

export type NightScoutTreatment = {
    eventType: string;
    created_at?: string;
    glucose: string;
    glucoseType: string;
    carbs?: number;
    protein?: number;
    fat?: number;
    insulin?: number;
    units?: string;
    notes?: string;
    enteredBy?: string;
};