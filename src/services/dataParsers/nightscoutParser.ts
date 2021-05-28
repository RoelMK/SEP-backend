import FoodModel from '../../gb/models/foodModel';
import { GlucoseModel, GlucoseUnit } from '../../gb/models/glucoseModel';
import { InsulinModel, InsulinType } from '../../gb/models/insulinModel';
import { NightScoutClient } from '../../nightscout/nsClient';
import FoodParser, { FoodSource } from '../food/foodParser';
import GlucoseParser, { GlucoseSource } from '../glucose/glucoseParser';
import InsulinParser, { InsulinSource } from '../insulin/insulinParser';
import { DateFormat } from '../utils/dates';
import { DataParser, DataSource } from './dataParser';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class NightscoutParser extends DataParser {
    private nightScoutEntries: NightScoutEntryModel[] = [];
    
    private nightScoutTreatments: NightScoutTreatmentModel[] = [];

    private glucoseUnit: GlucoseUnit = GlucoseUnit.UNDEFINED;

    /**
     * DataParser construction with DataSource set
     * @param nightScoutHost the url which points to the host of the nightscout instance
     * @param token the private token generated for Diabetter
     *
     */
    constructor(private nightScoutHost: string, private token?: string) {
        super(DataSource.NIGHTSCOUT, '');
    }

    /**
     * Obtain all nightscoutentries from the nightscout instance
     * @returns all NightScoutEntries that can be fetched from the nightscout instance
     */
    protected async parseEntry(): Promise<NightScoutEntryModel[]> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        const entries: NightScoutEntryModel[] = await nsClient.getEntries();
        return entries;
    }

    /**
     * Obtain all NightScoutTreatments from the nightscout instance
     * @returns all NightScoutTreatments that can be fetched from the nightscout instance
     */
    protected async parseTreatment(): Promise<NightScoutTreatmentModel[]> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        const treatments: NightScoutTreatmentModel[] = await nsClient.getTreatments();
        return treatments;
    }

    /**
     * Obtain GlucoseUnit from the nightscout instance
     * @returns GlucoseUnit from the nightscout instance
     */
    protected async parseGlucose(): Promise<GlucoseUnit> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        const glucose: GlucoseUnit = await nsClient.getGlucoseUnit();
        return glucose;
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process() {
        // specify the type of parsed data
        // have to parse nightscout treatment to foot model
        this.nightScoutEntries = await this.parseEntry();
        this.nightScoutTreatments = await this.parseTreatment();

        this.foodParser = new FoodParser(
            this.nightScoutTreatments,
            FoodSource.NIGHTSCOUT,
            this.dateFormat,
        );

        this.glucoseParser = new GlucoseParser(
            this.nightScoutEntries,
            GlucoseSource.NIGHTSCOUT,
            this.dateFormat,
            this.glucoseUnit
        );

        this.insulinParser = new InsulinParser(
            this.nightScoutTreatments,
            InsulinSource.NIGHTSCOUT,
            this.dateFormat
        );
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData;
    }

    getInsulinData(): InsulinModel[] | undefined {
        return this.insulinParser?.insulinData;
    }
}

export type NightScoutEntryModel = {
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

export type NightScoutTreatmentModel = {
    eventType: string;
    created_at: string;
    glucose?: string;
    glucoseType?: string;
    carbs?: number;
    protein?: number;
    fat?: number;
    insulin?: number;
    units?: string;
    notes?: string;
    enteredBy?: string;
};
