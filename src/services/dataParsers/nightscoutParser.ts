import { XOR } from 'ts-xor';
import { GameBusToken } from '../../gb/auth/tokenHandler';
import { GlucoseUnit } from '../../gb/models/glucoseModel';
import { NightScoutClient } from '../../nightscout/nsClient';
import { FoodSource } from '../food/foodTypes';
import { GlucoseSource } from '../glucose/glucoseTypes';
import { InsulinSource } from '../insulin/insulinTypes';

import { DataParser } from './dataParser';
import {
    DataSource,
    NightScoutDatatype,
    NightScoutEntryModel,
    NightScoutTreatmentModel,
    OutputDataType
} from './dataParserTypes';

/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export default class NightscoutParser extends DataParser {
    private nightScoutEntries: NightScoutEntryModel[] = [];

    private nightScoutTreatments: NightScoutTreatmentModel[] = [];

    private glucoseUnit: GlucoseUnit = GlucoseUnit.UNDEFINED;

    private nsClient: NightScoutClient;

    /**
     * DataParser construction with DataSource set
     * @param nightScoutHost the url which points to the host of the nightscout instance
     * @param token the private token generated for Diabetter
     *
     */
    constructor(
        nightScoutHost: string,
        userInfo: GameBusToken,
        token?: string,
        private testEntries?: NightScoutEntryModel[],
        private testTreatments?: NightScoutTreatmentModel[]
    ) {
        super(DataSource.NIGHTSCOUT, '', userInfo);
        this.nsClient = new NightScoutClient(nightScoutHost, token);
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
    private async parseEntry(): Promise<NightScoutEntryModel[]> {
        const entries: NightScoutEntryModel[] = await this.nsClient.getEntries();
        return entries;
    }

    /**
     * Obtain all NightScoutTreatments from the nightscout instance
     * @returns all NightScoutTreatments that can be fetched from the nightscout instance
     */
    private async parseTreatment(): Promise<NightScoutTreatmentModel[]> {
        const treatments: NightScoutTreatmentModel[] = await this.nsClient.getTreatments();
        return treatments;
    }

    /**
     * Obtain GlucoseUnit from the nightscout instance
     * @returns GlucoseUnit from the nightscout instance
     */
    private async parseGlucoseUnit(): Promise<GlucoseUnit> {
        try {
            return await this.nsClient.getGlucoseUnit();
        } catch (e) {
            return GlucoseUnit.MMOL_L;
        }
    }

    /**
     * Function that is called (async) that creates the parsers and filters the data to the correct parsers
     */
    async process() {
        // retrieve when the file was parsed for the last time
        this.retrieveLastUpdate(this.nsClient.getNightscoutHost());

        if (this.testEntries === undefined || this.testTreatments === undefined) {
            this.nightScoutEntries = await this.parseEntry();
            this.nightScoutTreatments = await this.parseTreatment();
            // retrieve glucose unit
            this.glucoseUnit = await this.parseGlucoseUnit();
        } else {
            // use test input
            this.nightScoutEntries = this.testEntries;
            this.nightScoutTreatments = this.testTreatments;
        }

        // create parsers
        this.createParser(OutputDataType.GLUCOSE, this.nightScoutEntries, GlucoseSource.NIGHTSCOUT);

        const foodTreatments: NightScoutTreatmentModel[] = this.filterFood();
        this.createParser(OutputDataType.FOOD, foodTreatments, FoodSource.NIGHTSCOUT);

        const insulinTreatments: NightScoutTreatmentModel[] = this.filterInsulin();
        this.createParser(OutputDataType.INSULIN, insulinTreatments, InsulinSource.NIGHTSCOUT);

        // post data
        await this.postProcessedData();

        // update the timestamp of newest parsed entry to this file
        this.setLastUpdate(this.nsClient.getNightscoutHost(), this.getLastProcessedTimestamp());
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
     * Filters the insulin entries from the raw Nightscout data
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
