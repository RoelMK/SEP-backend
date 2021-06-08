export interface ExerciseModel {
    timestamp: number;
    name: string; // sensible name of activity (regex of type)
    type: string; // activity type
    duration?: number; // in seconds
    steps?: number; // in amount
    distance?: number; // in meters
    calories?: number; // in kcal
    groupSize?: number; // in amount (0 - inf)
    penalty?: number; // in amount (0 - 100), only relevant for air hockey
    score?: number; // in amount, only relevant for air hockey
    maxSpeed?: number; // in m/s, only relevant for (detail) activities
    avgSpeed?: number; // in m/s, only relevant for (detail) activities
    maxHeartrate?: number; // in bpm, only relevant for (detail) activities
    avgHeartrate?: number; // in bpm, only relevant for (detail) activities
    minHeartrate?: number; // in bpm, only relevant for (detail) activities
    heartrate: null | number; // in bpm, currently unused but can be used at a later date
    activityId?: number; // ID of GameBus activity
}
