/**
 * A meal has 3 basic properties; time of meal (unix), calories of meal, description of meal (optional)
 * Additionally, more properties can be included (in grams)
 */
export default interface FoodModel {
    timestamp: number;
    carbohydrates: number;
    calories?: number;
    meal_type?: meal_type; // indicates breakfast, lunch, snack etc.
    glycemic_index?: number;
    fat?: number;
    saturatedFat?: number;
    proteins?: number;
    fibers?: number;
    salt?: number;
    water?: number;
    sugars?: number;
    description?: string;
}

export enum meal_type {
    breakfast = 'Breakfast',
    lunch = 'Lunch',
    dinner = 'Dinner',
    snack = 'Snack'
}
