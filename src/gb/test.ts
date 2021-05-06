import { GameBusClient } from './gameBusClient';
require('dotenv').config();

let userKevin = {
    token: process.env.kevin_authtoken!,
    playerID: process.env.kevin_playerID!,
    userID: process.env.kevin_userID!
};

let client: GameBusClient = new GameBusClient(true, userKevin.token);
/*
async function testClientGetAllActs2(client: GameBusClient, playerId: number) {
    const activity = await client.activity().getActivitiesOnDate(524, Math.floor(Date.now() / 1000));
    console.log(activity);
}

testClientGetAllActs2(client, parseInt(userKevin.playerID));
*/
