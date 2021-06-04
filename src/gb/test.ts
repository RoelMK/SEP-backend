import { bodyBlacklist } from "express-winston";
import { TokenHandler } from "./auth/tokenHandler";
import { GameBusClient } from "./gbClient";
import { FoodModel } from "./models/foodModel";
import { ActivityPOSTData } from "./models/gamebusModel";
import { Food, FoodPropertyKeys } from "./objects/food";
import { userKevin } from "./usersExport";

let client : GameBusClient = new GameBusClient(new TokenHandler(userKevin.authToken,"",String(userKevin.playerID)));

let activity : ActivityPOSTData = {
    date : 1622818857000,
    image: "",
    gameDescriptorTK: "WALK",
    dataProviderName: "Daily_run",
    players: [userKevin.playerID],
    propertyInstances: [{
        propertyTK: "STEPS",
        value: 12
    }]
}

let activity2: ActivityPOSTData = {
    date : 1622818887000,
    image: "",
    gameDescriptorTK: "WALK",
    dataProviderName: "Daily_run",
    players: [userKevin.playerID],
    propertyInstances: [{
        propertyTK: "STEPS",
        value: 24
    }]
}


async function go() {
    try {
        let response = await client.client.request({
            method: 'POST',
            url: 'https://api3.gamebus.eu/v2/me/activities?bulk=true',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Diabetter Client',
                Accept: 'application/json',
                Authorization : "Bearer " + userKevin.authToken
            },
            data: [activity, activity2]
            
        })
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
   
}
//go()
console.log(Object.keys(FoodPropertyKeys))
let food : FoodModel= {
    timestamp: 1622832285000,
    carbohydrates: 400,
    fibers: 34,
    description: "desc"
}
//client.food().postSingleFoodActivity(food,userKevin.playerID,undefined,undefined)
async function temp() {
    let result = await client.food().getExerciseActivityFromGd(userKevin.playerID)
    console.log(result)
}
temp()
//TODO set Axios to private again!
