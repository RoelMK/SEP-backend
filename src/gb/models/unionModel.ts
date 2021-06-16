import { ExerciseModel } from './exerciseModel';
import { FoodModel } from './foodModel';
import { GlucoseModel } from './glucoseModel';
import { InsulinModel } from './insulinModel';
import { MoodModel } from './moodModel';

export interface UnionModel {
    timestamp: number | null;
    food: FoodModel | null;
    mood: MoodModel | null;
    insulin: InsulinModel | null;
    glucose: GlucoseModel | null;
    exercise: ExerciseModel | null;
}

export const nullUnion: UnionModel = {
    timestamp: null,
    food: null,
    mood: null,
    insulin: null,
    glucose: null,
    exercise: null
};
