/**
 * Generic GameBus activity
 * This interface contains the needed information
 * TODO: might need to be expanded
 */
export interface ActivityModel {
    activityId: number; // ID of GameBus activity
    timestamp: number;
    id: number; // ID of property instance
    translationKey: string;
    value: number | string;
    property: ActivityProperty;
}

export interface ActivityProperty {
    id: number; // ID of property
    translationKey: string;
    baseUnit: string;
    inputType: string;
    // Other stuff isn't really needed
}
