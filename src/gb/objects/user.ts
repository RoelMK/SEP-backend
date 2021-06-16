import { GameBusClient, Query, Headers } from '../gbClient';
import { GameBusUser } from '../models/gamebusModel';

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
}
