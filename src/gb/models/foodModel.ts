/**
 * A meal has 3 basic properties; time of meal (unix), calories of meal, description of meal (optional)
 * Additionally, more properties can be included (in grams)
 */
export default interface foodModel {
    timestamp: number;
    calories: number;
    fat?: number;
    saturatedFat?: number;
    proteins?: number;
    carbohydrates?: number;
    fibers?: number;
    salt?: number;
    water?: number;
    sugars?: number;
    description?: string;
}
