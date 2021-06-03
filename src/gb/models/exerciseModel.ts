// TODO: add models for fitness activities (steps, heart beat, calories burnt), this depends on GameBus
export interface ExerciseModel {
    timestamp: number;
    type: string; // activity type
    duration?: number; // in seconds
    steps?: number; // in amount
    distance?: number; // in meters
    calories?: number; // in kcal
    groupSize?: number; // in amount (0 - inf)
    penalty?: number; // in amount (0 - 100), only relevant for air hockey
    score?: number; // in amount, only relevant for air hockey
}
