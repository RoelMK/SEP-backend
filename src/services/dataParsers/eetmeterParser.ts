import FoodModel from '../../gb/models/foodModel';
import FoodParser, { FoodSource } from '../food/foodParser';
import { DataParser, DataSource } from './dataParser';
/**
 * Class that reads the Abbott .csv files and passes the data onto the relevant parsers
 */
export class EetMeterParser extends DataParser {
    // Parsers can't be initialized from the start since they have to be initialized with the filtered data
    // TODO: don't think these should be private since you want to POST from them, but I'll keep them private for now,
    // alternatively, you can create a public method in the AbbottParser for each data type POST individually
    private eetmeterConsumptionData: Consumptie[] = [];

    /**
     * DataParser construction with DataSource set
     * @param xmlFile file path of Eetmeter file
     */
    constructor(private readonly xmlFile: string) {
        super(DataSource.EETMETER, xmlFile);
    }

    /**
     * Function that is called (async) that creates the parsers and filers the data to the correct parsers
     */
    async process(): Promise<void> {
        const eetmeterData: EetmeterData = (await this.parse()) as unknown as EetmeterData;
        this.eetmeterConsumptionData = eetmeterData.Consumpties.Consumptie as Consumptie[];
        // Not sure why it does not always map it to an array (even with a single element)
        if (this.eetmeterConsumptionData.length == undefined) {
            this.eetmeterConsumptionData = [this.eetmeterConsumptionData as unknown as Consumptie];
        }
        this.foodParser = new FoodParser(
            this.eetmeterConsumptionData,
            FoodSource.EETMETER,
            this.dateFormat
        );
    }

    getData(): FoodModel[] | undefined {
        return this.foodParser?.foodData;
    }
}

export interface EetmeterData {
    Consumpties: Consumpties;
}
export interface Consumpties {
    Attributes: [any];
    Consumptie: [Consumptie];
}
export type Consumptie = {
    Attributes: Periode;
    Datum: Datum;
    Product: Product;
    Nutrienten: Nutrienten;
};
export interface Nutrienten {
    Koolhydraten: Koolhydraten;
    Energie: Energie;
    Vet: Vet;
    VerzadigdVet: VerzadigdVet;
    Zout: Zout;
    Water: Water;
    Suikers: Suikers;
}

export interface Periode {
    Periode: string;
}

export interface Product {
    Naam: string;
}

export interface Datum {
    Dag: number;
    Maand: number;
    Jaar: number;
}

export interface Koolhydraten {
    Value: number;
}

export interface Energie {
    Value: number;
}

export interface Vet {
    Value: number;
}

export interface Zout {
    Value: number;
}

export interface Water {
    Value: number;
}

export interface Suikers {
    Value: number;
}

export interface VerzadigdVet {
    Value: number;
}
