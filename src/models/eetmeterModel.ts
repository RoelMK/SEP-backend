// TODO: move somewhere else / to EetMeterParser directly

export interface EetmeterData {
    Consumpties: Consumpties;
}
export interface Consumpties {
    Attributes: [any];
    Consumptie: [Consumptie];
}
export interface Consumptie {
    Attributes: Periode;
    Datum: Datum;
    Product: Product;
    Nutrienten: Nutrienten;
}
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
    Naam: String;
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
