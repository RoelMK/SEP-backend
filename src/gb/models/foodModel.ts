/**
 * A meal has 3 basic properties; time of meal (unix), calories of meal, description of meal (optional)
 * Additionally, more properties can be included (in grams)
 */
export interface FoodModel {
    timestamp: number;
    carbohydrates: number;
    calories?: number | null;
    meal_type?: MEAL_TYPE | null; // indicates breakfast, lunch, snack etc.
    glycemic_index?: number | null;
    fat?: number | null;
    saturatedFat?: number | null;
    proteins?: number | null;
    fibers?: number | null;
    salt?: number | null;
    water?: number | null;
    sugars?: number | null;
    description?: string | null;
    activityId?: number; // ID of GameBus activity
}

export enum MEAL_TYPE {
    BREAKFAST = 'Breakfast',
    LUNCH = 'Lunch',
    DINNER = 'Dinner',
    SNACK = 'Snack',
    UNDEFINED = ''
}
