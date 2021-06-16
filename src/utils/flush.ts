import { DBClient } from '../db/dbClient';
import { GameBusClient } from '../gb/gbClient';
import { Keys } from '../gb/objects/keys';

/**
 * Function that will both clear the database and can also clear a given user's GameBus account from activities
 *
 * Can be used to prepare for AT test
 * @param gamebusClient Client authenticated as user
 * @param playerId ID of player from which to remove all activities
 */
export async function flush(gamebusClient?: GameBusClient, playerId?: number): void {
    // Clean the database
    const dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();

    // If client and player ID provided, clear the account
    if (gamebusClient && playerId) {
        // Delete all user activities
        await gamebusClient.activity().deleteAllActivities(playerId);
        // Disconnect our data provider
        await gamebusClient.user().disconnectDataProvider(playerId, Keys.dataProviderId);
    }
}
