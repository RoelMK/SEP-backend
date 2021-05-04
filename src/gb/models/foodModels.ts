/**
 * Food "activity" for GameBus includes the UNIX timestamp, amount of calories (in "amount"), other food related info (in grams) and an optional description
 */
export interface GameBusFoodActivity {
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
