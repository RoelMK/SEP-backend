import { GameBusClient } from '../gbClient';
import { ChallengePOSTData, Headers, Query } from '../models';
import FormData from 'form-data';

export class Challenge {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}

    /**
     * POST a challenge
     * @param data Challenge data
     */
    async postChallenge(
        data: ChallengePOSTData,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        // PUT uses form-data, so we convert data to string and send as form data
        const challengeBody = new FormData();
        challengeBody.append('challenge', JSON.stringify(data));
        const formHeaders = challengeBody.getHeaders();

        // We have to create the headers here because FormData has some extra headers
        let challengeHeaders = this.gamebus.createHeader(true, headers);
        challengeHeaders = {
            ...challengeHeaders,
            ...formHeaders
        };

        // URL can be created here as well
        const gamebusUrl = this.gamebus.createURL('challenges', {
            dryrun: 'false',
            ...query
        });

        // Then send the request
        const response = await this.gamebus.client.request({
            method: 'POST',
            url: gamebusUrl,
            headers: challengeHeaders,
            data: challengeBody
        });
        return response.data;
    }

    async postCircleMembership(
        circleId1: number,
        circleId2: number,
        challengeId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        const response = await this.gamebus.post(
            `challenges/${challengeId}/participants?circles=${circleId1},${circleId2}`,
            {},
            headers,
            query,
            true,
            false
        );
        return response;
    }
}
