import { MEAL_TYPE } from './foodModel';
import { InsulinType } from './insulinModel';

export interface UnionModel {
    timestamp: number | null;
    activityId?: number | null; // ID of GameBus activity
    // exercise
    name: string | null; // sensible name of activity (regex of type)
    type: string | null; // activity type
    duration: number | null; // in seconds
    steps: number | null; // in amount
    distance: number | null; // in meters
    caloriesBurnt: number | null; // in kcal //TODO changed name
    groupSize: number | null; // in amount (0 - inf)
    penalty: number | null; // in amount (0 - 100), only relevant for air hockey
    score: number | null; // in amount, only relevant for air hockey
    maxSpeed: number | null; // in m/s, only relevant for (detail) activities
    avgSpeed: number | null; // in m/s, only relevant for (detail) activities
    maxHeartrate: number | null; // in bpm, only relevant for (detail) activities
    avgHeartrate: number | null; // in bpm, only relevant for (detail) activities
    minHeartrate: number | null; // in bpm, only relevant for (detail) activities
    heartrate: number | null; // in bpm, currently unused but can be used at a later date
    // food
    carbohydrates: number | null;
    calories: number | null;
    meal_type: MEAL_TYPE | null; // indicates breakfast, lunch, snack etc.
    glycemic_index: number | null;
    fat: number | null;
    saturatedFat: number | null;
    proteins: number | null;
    fibers: number | null;
    salt: number | null;
    water: number | null;
    sugars: number | null;
    description: string | null;
    // glucose
    glucoseLevel: number | null;
    // insulin
    insulinAmount: number | null;
    insulinType: InsulinType | null;
    // mood
    arousal: number | null;
    valence: number | null;
}

export const nullUnion: UnionModel = {
    timestamp: null,
    // exercise
    name: null, // sensible name of activity (regex of type)
    type: null, // activity type
    duration: null, // in seconds
    steps: null, // in amount
    distance: null, // in meters
    caloriesBurnt: null, // in kcal //TODO changed name
    groupSize: null, // in amount (0 - inf)
    penalty: null, // in amount (0 - 100), only relevant for air hockey
    score: null, // in amount, only relevant for air hockey
    maxSpeed: null, // in m/s, only relevant for (detail) activities
    avgSpeed: null, // in m/s, only relevant for (detail) activities
    maxHeartrate: null, // in bpm, only relevant for (detail) activities
    avgHeartrate: null, // in bpm, only relevant for (detail) activities
    minHeartrate: null, // in bpm, only relevant for (detail) activities
    heartrate: null, // in bpm, currently unused but can be used at a later date
    // food
    carbohydrates: null,
    calories: null,
    meal_type: null, // indicates breakfast, lunch, snack etc.
    glycemic_index: null,
    fat: null,
    saturatedFat: null,
    proteins: null,
    fibers: null,
    salt: null,
    water: null,
    sugars: null,
    description: null,
    // glucose
    glucoseLevel: null,
    // insulin
    insulinAmount: null,
    insulinType: null,
    // mood
    arousal: null,
    valence: null
};
