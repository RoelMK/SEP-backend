/**
 * Token handler that can refresh tokens if needed
 */
export class TokenHandler {
    /**
     * Constructs the token handler.
     * Note that all parameter values can be retrieved from user.req of the Express request object
     * if it is a properly authenticated request (use the middleware checkJwt).
     * @param accessToken Access token to use
     * @param refreshToken Refresh token to use
     * @param playerId Player id of logged-in player
     */
    constructor(
        private accessToken: string,
        private refreshToken: string,
        private readonly playerId: string
    ) {}

    // TODO: refresh tokens
    // --> This requires a lot of new knowledge from the GameBus side (how do we know when it expires, how to refresh)

    /**
     * Get method for current token
     * @returns Current token
     */
    getToken(): GameBusToken {
        return {
            playerId: this.playerId,
            accessToken: this.accessToken
        } as GameBusToken;
    }
}

/**
 * Token that is used for actually authenticating GameBus requests (from decoded JWT)
 */
export interface GameBusToken {
    playerId: string;
    accessToken: string;
}
