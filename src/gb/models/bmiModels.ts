export interface BMIModel {
    timestamp: number;
    activityId?: number; // ID of GameBus activity
    weight: number | null; // weight in kg, should not be optional since we POST it
    length: number | null; // height in cm
    age: number | null; // age in years
    gender?: string | null; // Either m, f or o, optional since we don't really need it
    waistCircumference?: number | null; // in cm, optional since we don't really need it
    bmi?: number | null; // in kg/m^2, optional since we don't really need it
}
