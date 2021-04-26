// Example file on how to use this setup

import { GameBusClient } from './GameBusClient';

async function main() {
    const gamebus = new GameBusClient();
    const activity = await gamebus.activity().getActivityById(0);
    console.log(JSON.stringify(activity));
}

main();
