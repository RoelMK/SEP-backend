/**
 * This file exports all models stored in the current directory
 * for further use in our program.
 *
 */

// GameBus models
export { ActivityModel, ActivityProperty } from './activityModel';
export { BMIModel } from './bmiModels';

export {
    ActivityGETData,
    ActivityPOSTData,
    IDActivityPOSTData,
    PropertyInstanceReference,
    PropertyInstancePOST,
    ChallengePOSTData,
    CircleGETData,
    IDPropertyInstancePOST,
    GameBusUser,
    Headers,
    Query
} from './gamebusModel';
// data models
export { FoodModel } from './foodModel';
export { GlucoseModel } from './glucoseModel';
export { InsulinModel } from './insulinModel';
export { MoodModel } from './moodModel';
export { ExerciseModel } from './exerciseModel';

// combination of other models
export { UnionModel } from './unionModel';
