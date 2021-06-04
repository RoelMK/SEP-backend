import { Console } from "console";
import { GameBusClient } from "./gbClient";
import { FoodModel, MEAL_TYPE } from "./models/foodModel";
import { GlucoseModel } from "./models/glucoseModel";
import { InsulinModel, InsulinType } from "./models/insulinModel";
import { MoodModel } from "./models/moodModel";

let client = new GameBusClient()



function testFood() {
    let fModel : FoodModel = {
        timestamp: 12,
        carbohydrates: 42,
        calories: 63,
        meal_type: MEAL_TYPE.BREAKFAST, // indicates breakfast, lunch, snack etc.
        /*
        glycemic_index?: number;
        fat?: number;
        saturatedFat?: number;
        proteins?: number;
        fibers?: number;
        salt?: number;
        water?: number;
        sugars?: number;
        description?: string;
        */
    }
    
    let fPOST = client.food().toPOSTData(fModel,9)
    console.log("Food:")
    console.log(fPOST)
    console.log("")
}

function testInsulin() {
    let model : InsulinModel = {
        timestamp: 12,
        insulinAmount: 420,
        insulinType: InsulinType.RAPID //rapid = 0
    }
    
    let post = client.insulin().toPOSTData(model,9)
    console.log("insulin:")
    console.log(post)
    console.log("")
}

function testGlucose() {
    let model : GlucoseModel = {
        timestamp: 12,
        glucoseLevel: 420
    }
    
    let post = client.glucose().toPOSTData(model,9)
    console.log("glucose:")
    console.log(post)
    console.log("")
}

function testMood() {
    let model : MoodModel = {
        timestamp: 12,
        arousal: 42,
        valence: 420
    }
    
    let post = client.mood().toPOSTData(model,9)
    console.log("glucose:")
    console.log(post)
    console.log("")
}

testMood()