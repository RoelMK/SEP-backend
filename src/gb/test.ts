import { TokenHandler } from "./auth/tokenHandler";
import { GameBusClient } from "./gbClient";
import { FoodModel } from "./models/foodModel";
import { ActivityPOSTData } from "./models/gamebusModel";
import { FoodIDs } from "./objects/food";
import { userKevin } from "./usersExport";

const util = require('util')

let client : GameBusClient = new GameBusClient(new TokenHandler(userKevin.authToken,"",String(userKevin.playerID)),true)

let activity : ActivityPOSTData = {
    date : 1622818857000,
    image : "",
    gameDescriptorTK: "WALK",
    dataProviderName: "Daily_run",
    players:[userKevin.playerID],
    propertyInstances: [{
        propertyTK: "STEPS",
        value: 12
    }]
}

let activity2 : ActivityPOSTData = {
    date : 1622818887000,
    image : "",
    gameDescriptorTK: "WALK",
    dataProviderName: "Daily_run",
    players:[userKevin.playerID],
    propertyInstances: [{
        propertyTK: "STEPS",
        value: 24
    }]
}

let IDactivity = {
    date : 1622818857000,
    image : "",
    gameDescriptor: 1,
    dataProvider: 18,
    players:[userKevin.playerID],
    propertyInstances: [{
        property: 1,
        value: 12
    }]
}

let IDactivity2 = {
    date : 1622818887000,
    image : "",
    gameDescriptor: 1,
    dataProvider: 18,
    players:[userKevin.playerID],
    propertyInstances: [{
        property: 1,
        value: 24
    }]
}

async function go(activity, activity2) {
    try{
        //@ts-ignore
        let response = await client.client.request({
            method: "POST",
            url: 'https://api3.gamebus.eu/v2/me/activities?bulk=true&dryrun=false',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Diabetter Client',
                Accept: 'application/json',
                Authorization : "Bearer " + userKevin.authToken
            },
            data: [activity,activity2]
        })
        console.log(util.inspect(response.data, false, null, true /* enable colors */))
    } catch(err) {
        console.log(err)
    }
}

//go(IDactivity, IDactivity2)

let food1 : FoodModel = {
    timestamp : 1622905272000,
    carbohydrates: 56,
    description: "desc3",
    fibers: 123
}
let food2 : FoodModel = {
    timestamp : 1622915272000,
    carbohydrates: 78,
    description: "desc4",
    fibers: 456
}
//client.food().postMultipleFoodActivities([food1,food2],userKevin.playerID)
//console.log(client.food().toIDPOSTData(food1,1))
