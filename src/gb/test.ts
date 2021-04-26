// Example file on how to use this setup

import { GameBusClient } from './GameBusClient';
// Make sure you have a (valid) API token in .env.local
require('dotenv').config({ path: './env.local' });
const token = process.env.TEST_TOKEN;

async function main() {
    const gamebus = new GameBusClient(true, token);
    const activity = await gamebus.activity().getActivityById(0);
    console.log(JSON.stringify(activity));
}

main();
