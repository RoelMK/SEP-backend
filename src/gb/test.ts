import { GameBusClient } from './gbClient';
import { Activity } from './objects/activity';
require('dotenv').config();

let userKevin = {
    token: process.env.kevin_authtoken!,
    playerID: process.env.kevin_playerID!,
    userID: process.env.kevin_userID!
};

//let client: GameBusClient = new GameBusClient(true, userKevin.token);
/*
async function testClientGetAllActs2(client: GameBusClient, playerId: number) {
    const activity = await client.activity().getActivitiesOnUnixDate(playerId, 1618848682);
    const activityAsModel = Activity.getActivityInfoFromActivity(activity[0]);
    console.log(activityAsModel);
}

testClientGetAllActs2(client, parseInt(userKevin.playerID));
