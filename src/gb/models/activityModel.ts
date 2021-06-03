/**
 * Generic GameBus activity
 * This interface contains the needed information
 * TODO: might need to be expanded
 */
export interface ActivityModel {
    timestamp: number;
    id: number;
    translationKey: string;
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
