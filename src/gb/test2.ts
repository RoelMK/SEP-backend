import { GameBusClient } from './GameBusClient';
require('dotenv').config({ path: __dirname.split('\\').slice(0, -1).join('\\') + '\\.env.local' });

let userKevin = {
    authToken: process.env.kevin_authtoken!,
    playerID: process.env.kevin_playerID!,
    userID: process.env.kevin_userID!
};

let client: GameBusClient = new GameBusClient(true, '436a116e-6814-409a-8afc-0be7a2e34711');

async function testClientGetAllActs2(client: GameBusClient, playerId: number) {
    const activity = await client.activity().getAllActivities(524);
    console.log(activity);
}

testClientGetAllActs2(client, parseInt(userKevin.userID));
