export interface ExerciseModel {
    timestamp: number;
    name: string; // sensible name of activity (regex of type)
    type: string; // activity type
    duration?: number | null; // in seconds
    steps?: number | null; // in amount
    distance?: number | null; // in meters
    calories?: number | null; // in kcal
    groupSize?: number | null; // in amount (0 - inf)
    penalty?: number | null; // in amount (0 - 100), only relevant for air hockey
    score?: number | null; // in amount, only relevant for air hockey
    maxSpeed?: number | null; // in m/s, only relevant for (detail) activities
    avgSpeed?: number | null; // in m/s, only relevant for (detail) activities
    maxHeartrate?: number | null; // in bpm, only relevant for (detail) activities
    avgHeartrate?: number | null; // in bpm, only relevant for (detail) activities
    minHeartrate?: number | null; // in bpm, only relevant for (detail) activities
    heartrate: number | null; // in bpm, currently unused but can be used at a later date
    activityId?: number; // ID of GameBus activity
}
