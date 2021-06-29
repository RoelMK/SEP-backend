import { ExerciseModel } from './exerciseModel';
import { FoodModel } from './foodModel';
import { GlucoseModel } from './glucoseModel';
import { InsulinModel } from './insulinModel';
import { MoodModel } from './moodModel';

/**
 * Model that defines the output we send to the frontend if they add the
 * 'union' query parameter -> it consists of one timestamp and one or more
 *  models that contain information about that specific timetstamp
 */
export interface UnionModel {
    timestamp: number | null;
    food: FoodModel | null;
    mood: MoodModel | null;
    insulin: InsulinModel | null;
    glucose: GlucoseModel | null;
    exercise: ExerciseModel | null;
}

/**
 * UnionModel object initialized with only zeroes
 * Is used as an initializer and subsequently filled with available data
 */
export const nullUnion: UnionModel = {
    timestamp: null,
    food: null,
    mood: null,
    insulin: null,
    glucose: null,
    exercise: null
};
