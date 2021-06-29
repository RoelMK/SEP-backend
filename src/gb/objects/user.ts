import { GameBusClient } from '../gbClient';
import { GameBusUser, Query, Headers } from '../models';

export class User {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}

    /**
     * Gets currently authenticated user
     * @returns Currently authenticated user as GameBusUser
     */
    async getCurrentUser(headers?: Headers, query?: Query): Promise<GameBusUser> {
        const response = await this.gamebus.get('users/current', headers, query, this.authRequired);
        return response;
    }

    /**
     * Disconnects given data provider (ID) from the given player (ID)
     * @param playerId ID of player
     * @param dataProviderId ID of data provider to disconnect
     */
    async disconnectDataProvider(
        playerId: number,
        dataProviderId: number,
        headers?: Headers,
        query?: Query
    ): Promise<void> {
        await this.gamebus.delete(
            `players/${playerId}/data-providers/${dataProviderId}`,
            headers,
            query,
            this.authRequired
        );
    }

    /**
     * Connects given data provider (ID) from the given player (ID)
     * @param playerId ID of player
     * @param dataProviderId ID of data provider to connect
     */
    async connectDataProvider(
        playerId: number,
        dataProviderId: number,
        headers?: Headers,
        query?: Query
    ): Promise<void> {
        await this.gamebus.post(
            `players/${playerId}/data-providers/${dataProviderId}`,
            undefined,
            headers,
            query,
            this.authRequired
        );
    }
}
