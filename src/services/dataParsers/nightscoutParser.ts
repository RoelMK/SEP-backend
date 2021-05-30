import { XOR } from 'ts-xor';
import { GlucoseUnit } from '../../gb/models/glucoseModel';
import { NightScoutClient } from '../../nightscout/nsClient';
import FoodParser, { FoodSource } from '../food/foodParser';
import GlucoseParser, { GlucoseSource } from '../glucose/glucoseParser';
import InsulinParser, { InsulinSource } from '../insulin/insulinParser';
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
    constructor(
        private nightScoutHost: string,
        private token?: string,
        private testEntries?: NightScoutEntryModel[],
        private testTreatments?: NightScoutTreatmentModel[]
    ) {
        super(DataSource.NIGHTSCOUT, '');
    }

    /**
     * Overrides super-method parse of the DataParser class, because of its non-file nature
     * @param type type of data to be parsed
     * @returns Nightscout entries or nightscout treatments
     */
    protected async parse(
        type?: NightScoutDatatype
    ): Promise<XOR<NightScoutTreatmentModel[], NightScoutEntryModel[]>> {
        if (type === undefined) {
            throw new Error('NightScoutDataType is not defined, unknown which data to retrieve.');
        }
        switch (type) {
            case NightScoutDatatype.ENTRY:
                return this.parseEntry();
            case NightScoutDatatype.TREATMENT:
                return this.parseTreatment();
        }
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
    private async parseTreatment(): Promise<NightScoutTreatmentModel[]> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        const treatments: NightScoutTreatmentModel[] = await nsClient.getTreatments();
        return treatments;
    }

    /**
     * Obtain GlucoseUnit from the nightscout instance
     * @returns GlucoseUnit from the nightscout instance
     */
    private async parseGlucoseUnit(): Promise<GlucoseUnit> {
        const nsClient = new NightScoutClient(this.nightScoutHost, this.token);
        const glucose: GlucoseUnit = await nsClient.getGlucoseUnit();
        return glucose;
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process() {
       
        if (this.testEntries === undefined || this.testTreatments === undefined) {
            // TODO note to self use parse with parameter or just individual funtions as below
            // does not matter for result and below needs less overhead
            this.nightScoutEntries = await this.parseEntry();
            this.nightScoutTreatments = await this.parseTreatment();
            // retrieve glucose unit
            this.glucoseUnit = await this.parseGlucoseUnit();
        }else{
            // use test input
            this.nightScoutEntries = this.testEntries;
            this.nightScoutTreatments = this.testTreatments;
        }
        
        this.glucoseParser = new GlucoseParser(
            this.nightScoutEntries,
            GlucoseSource.NIGHTSCOUT,
            this.dateFormat,
            this.glucoseUnit
        );

        const foodTreatments: NightScoutTreatmentModel[] = this.filterFood();
        this.foodParser = new FoodParser(foodTreatments, FoodSource.NIGHTSCOUT, this.dateFormat);

        const insulinTreatments: NightScoutTreatmentModel[] = this.filterInsulin();
        this.insulinParser = new InsulinParser(
            insulinTreatments,
            InsulinSource.NIGHTSCOUT,
            this.dateFormat
        );
    }

    /**
     * Filters the food entries from the raw data
     * @returns All food entries
     */
    private filterFood(): NightScoutTreatmentModel[] {
        const food = this.nightScoutTreatments?.filter((entry: NightScoutTreatmentModel) => {
            return entry.carbs && entry.created_at;
        });
        if (food?.length === 0) {
            return [];
        }
        return food;
    }

    /**
     * Filters the insulin entries from the raw data
     * @returns All insulin entries
     */
    private filterInsulin(): NightScoutTreatmentModel[] {
        const insulin = this.nightScoutTreatments?.filter((entry: NightScoutTreatmentModel) => {
            return entry.insulin && entry.created_at;
        });
        if (insulin?.length === 0) {
            return [];
        }
        return insulin;
    }
}

export type NightScoutEntryModel = {
    type: string;
    dateString?: string;
    date: number;
    sgv: number;
    _id?: string;
    direction?: string;
    noise?: number;
    filtered?: number;
    unfiltered?: number;
    rssi?: number;
    utcOffset?: number;
    sysTime?: string;
};

export type NightScoutTreatmentModel = {
    eventType: string;
    created_at: string;
    _id?: string;
    glucose?: string;
    glucoseType?: string; // Finger or sensor
    carbs?: number;
    protein?: number;
    fat?: number;
    insulin?: number;
    units?: string; // glucose units
    notes?: string;
    enteredBy?: string;
    utcOffset?: number;
};

// Enum that contains all retrievable data from Nightscout
enum NightScoutDatatype {
    ENTRY = 0,
    TREATMENT = 1
}
