// TODO
export interface ActivityModel {
    timestamp: number;
    id: number;
    value: number;
    property: ActivityProperty;
}

export interface ActivityProperty {
    id: number;
    translationKey: string;
    baseUnit: string;
    inputType: string;
    // Other stuff isn't really needed
}
