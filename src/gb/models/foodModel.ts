/**
 * A meal has 3 basic properties; time of meal (unix), calories of meal, description of meal
 */
export default interface foodModel {
    timestamp?: number;
    calories: number;
    description?: string;
}
