import { Query, Headers } from '../gbClient';
import FoodModel from '../models/foodModel';
import { ActivityGETData, ActivityPOSTData, PropertyInstancePOST } from '../models/gamebusModel';
import { GameBusObject } from './base';

/**
 * Class for food-specific functions
 */
export class Food extends GameBusObject {
    private foodId = 0; // TODO: assign to GameBus-given activity ID
    private foodGameDescriptor = "LOG_GLUCOSE";

    /**
     * Example function that retrieves all activities with pre-set ID
     * @returns All food activities (provided ID is correct)
     */
    async getAllFoodActivities(headers?: Headers, query?: Query): Promise<ActivityGETData[]> {
        // TODO: implement getAllActivitiesWithId()
        const food = await this.activity.getAllActivitiesWithId(this.foodId, headers, query);
        return food as unknown as ActivityGETData[];
    }

    async postSingleInsulinActivity(model: FoodModel, playerID: number, headers?: Headers, query?:Query) {
        let data = this.toPOSTData(model,playerID);
        this.activity.postActivity(data,headers,query)
    }

    private toPOSTData(model: FoodModel, playerID: number) : ActivityPOSTData{
        let obj = {
            gameDescriptorTK: this.foodGameDescriptor,
            dataProviderName: this.activity.dataProviderName,
            image: "", //TODO add image?
            date: model.timestamp,
            propertyInstances: [{
                propertyTK : "FOOD_CARBOHYDRATES_GRAMS",
                value : model.carbohydrates
            }] as PropertyInstancePOST[],
            players: [playerID]
        }
        if(model.calories !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_CALORIES_KCAL", value : model.calories})}
        if(model.meal_type !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_MEAL_TYPE", value : model.meal_type})}
        if(model.glycemic_index !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_GLYCEMIC_INDEX", value : model.glycemic_index})}
        if(model.fat !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_FAT_GRAMS", value : model.fat})}
        if(model.saturatedFat !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_SATURATED_FAT_GRAMS", value : model.saturatedFat})}
        if(model.proteins !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_PROTEINS_GRAMS", value : model.proteins})}
        if(model.fibers !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_FIBERS_GRAMS", value : model.fibers})}
        if(model.salt !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_SALT_GRAMS", value : model.salt})}
        if(model.water !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_WATER_GRAMS", value : model.water})}
        if(model.sugars !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_SUGAR_GRAMS", value : model.sugars})}
        if(model.description !== undefined) {obj.propertyInstances.push({propertyTK : "FOOD_DESCRIPTION", value : model.description})}
        return obj;
    }
}