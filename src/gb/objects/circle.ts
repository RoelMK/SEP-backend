import { GameBusClient } from '../gbClient';
import { CircleGETData, Headers, Query } from '../models';

export class Circle {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}

    /**
     * Get circle information from circle ID
     * @param circleId Circle ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Circle associated to given ID
     */
    async getCircleById(
        circleId: number,
        headers?: Headers,
        query?: Query
    ): Promise<CircleGETData> {
        const circle: CircleGETData = await this.gamebus.get(
            `circles/${circleId}`,
            headers,
            query,
            this.authRequired
        );
        return circle;
    }

    /**
     * Gets all circles for given player
     * @param playerId Player ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Array of circles for a given player
     */
    async getAllCircles(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<CircleGETData[]> {
        const circles: CircleGETData[] = await this.gamebus.get(
            `players/${playerId}/circles`,
            headers,
            query,
            this.authRequired
        );
        return circles;
    }

    /**
     * Get all circles where a player is a leader and the
     * circle names has "Diabetter" in it
     * @param playerId Player ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Array of circles where the player is leader of
     * and the name of the circle contains "Diabetter"
     */
    async getAllCirclesLeaderDiabetter(
        playerId: number,
        headers?: Headers,
        query?: Query
    ): Promise<CircleGETData[]> {
        const circleQuery: Query = {
            states: 'LEADERSHIP_APPROVED',
            ...query
        };
        const circles: CircleGETData[] = await this.gamebus.get(
            `players/${playerId}/circles`,
            headers,
            circleQuery,
            this.authRequired
        );

        const circles_Diabetter: CircleGETData[] = [];
        circles.forEach((element) => {
            if (element.name.includes('Diabetter') || element.name.includes('diabetter')) {
                circles_Diabetter.push(element);
            }
        });
        return circles_Diabetter;
    }

    /**
     * Get player ids in a circle
     * @param circleId Circle ID
     * @param headers Any extra headers
     * @param query Any queries
     * @returns Array of player ids in a circle
     */
    async getPlayersForAGivenCircle(
        circleId: number,
        headers?: Headers,
        query?: Query
    ): Promise<number[]> {
        const circle: CircleGETData = await this.gamebus.get(
            `circles/${circleId}`,
            headers,
            query,
            this.authRequired
        );

        const ids: number[] = [];
        if (circle.memberships != undefined) {
            for (let i = 0; i < circle.memberships.length || 0; i++) {
                ids.push(circle.memberships[i].player.id);
            }
        }
        return ids;
    }
}
