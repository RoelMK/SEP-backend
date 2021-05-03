import { GameBusClient } from './GameBusClient';
require('dotenv').config();

let userKevin = {
    token: process.env.kevin_authtoken!,
    playerID: process.env.kevin_playerID!,
    userID: process.env.kevin_userID!
};

let client: GameBusClient = new GameBusClient(true, userKevin.token);

async function testClientGetAllActs2(client: GameBusClient, playerId: number) {
    const activity = await client.activity().getAllActivities(playerId);
    console.log(activity);
}

testClientGetAllActs2(client, parseInt(userKevin.playerID));
