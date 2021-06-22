import { DBClient } from '../db/dbClient';
import { GameBusClient } from '../gb/gbClient';
/**
 * Function that will clear a given user's GameBus account from activities
 *
 * Can be used to prepare for AT test
 * @param gamebusClient Client authenticated as user
 * @param playerId ID of player from which to remove all activities
 */
export async function flushActivities(
    gamebusClient?: GameBusClient,
    playerId?: number
): Promise<void> {
    // If client and player ID provided, clear the account
    if (gamebusClient && playerId) {
        // Delete all user activities
        console.log('Deleting GameBus activities...');
        await gamebusClient.activity().deleteAllActivities(playerId);
    }

    console.log('Flush complete!');
}

/**
 * Function that will clear a given user's database and disconnect from our dataprovider
 *
 * Can be used to prepare for AT test
 */
export async function flushDB(): Promise<void> {
    // Clean the database
    console.log('Cleaning database...');
    const dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();
}
