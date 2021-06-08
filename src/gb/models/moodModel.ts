export interface MoodModel {
    timestamp: number;
    arousal: number;
    valence: number;
    activityId?: number; // ID of GameBus activity
}
