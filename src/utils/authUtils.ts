import jwt from 'jsonwebtoken';
import { DBClient } from '../db/dbClient';
import { GameBusClient } from '../gb/gbClient';
import crypto from 'crypto';

const gbClientAuthHeader = ('Basic ' + process.env.GAMEBUS_CLIENT_AUTH_HEADER) as string;
const loginAttemptValidityInMinutes = 5;

/**
 * Finishes a login attempt and generates a JWT with credentials.
 * @param loginToken Login token of attempt to finish
 * @returns A JWT with credentials or undefined if failed to finish login attempt
 */
export function finishLoginAttempt(loginToken: string): string | undefined {
    const dbClient: DBClient = new DBClient();
    dbClient.cleanLoginAttempts();
    const loginRow = dbClient.getLoginAttemptByLoginToken(loginToken); // Get ongoing attempt from database
    if (loginRow && loginRow.player_id && loginRow.access_token && loginRow.refresh_token) {
        const playerId = loginRow.player_id as string;
        const accessToken = loginRow.access_token as string;
        const refreshToken = loginRow.refresh_token as string;
        dbClient.removeFinishedLoginAttempt(playerId);
        dbClient.close();
        return createJWT(playerId, accessToken, refreshToken);
    }
    dbClient.close();
    return undefined;
}

/**
 * Registers callback from GameBus from ongoing login attempt.
 * @param playerId Player id received
 * @param accessToken Access token received
 * @param refreshToken Refresh token received
 * @returns If registration succeeded
 */
export function registerConnectCallback(
    playerId: string,
    accessToken: string,
    refreshToken: string
): boolean {
    const dbClient: DBClient = new DBClient();
    const callbackRegistered = dbClient.registerCallback(playerId, accessToken, refreshToken);
    dbClient.close();
    return callbackRegistered;
}

/**
 * Starts a login attempt from our side.
 * @param email Email to start attempt for
 * @param interpretEmailAsToken Skip asking for player id step and use email as player id
 * @returns Attempt token or undefined if failed to start attempt
 */
export async function startLoginAttempt(
    email: string,
    interpretEmailAsPlayerId?: boolean
): Promise<LoginAttemptToken | undefined> {
    let playerId: string | undefined;
    if (interpretEmailAsPlayerId) {
        playerId = email;
    } else {
        playerId = await getPlayerIdByEmail(email);
    }

    if (playerId) {
        const dbClient: DBClient = new DBClient();
        dbClient.cleanLoginAttempts();
        const loginToken = crypto.randomBytes(16).toString('hex');
        const expires: Date = new Date(
            new Date().getTime() + loginAttemptValidityInMinutes * 60000
        );
        const registered = dbClient.registerLoginAttempt(playerId, loginToken, expires);
        dbClient.close();

        if (registered) {
            return { loginToken: loginToken, expires: expires.getTime() };
        } else {
            return undefined;
        }
    }
    return undefined;
}

/**
 * Tries to get the player id corresponding to a given email from GameBus.
 * @param email Email to look for
 * @returns Player id or undefined if none found
 */
async function getPlayerIdByEmail(email: string): Promise<string | undefined> {
    const clientAccessCode = await getClientAccessToken();
    if (clientAccessCode) {
        const gbClient: GameBusClient = new GameBusClient(undefined, true);
        try {
            const response = await gbClient.get(
                'users',
                { Authorization: 'Bearer ' + clientAccessCode },
                { q: email }
            );
            if (
                response &&
                Array.isArray(response) &&
                response.length > 0 &&
                response[0].player &&
                response[0].player.id
            ) {
                return response[0].player.id.toString();
            }
        } catch (error) {
            return undefined;
        }
    }
    return undefined;
}

/**
 * Gets the access token for the client (this server) from GameBus.
 * @returns An access token or undefined if none is available
 */
async function getClientAccessToken(): Promise<string | undefined> {
    const gbClient: GameBusClient = new GameBusClient();

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    try {
        const response = await gbClient.post('oauth/token', params.toString(), {
            Authorization: gbClientAuthHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        if (response && response.access_token) {
            return response.access_token as string;
        } else {
            return undefined;
        }
    } catch (error) {
        return undefined;
    }
}

/**
 * Generates a new JWT for a specified user id.
 * Token payload:
 * "playerId": Id of user to which the token belongs
 * "accessToken": Token which can be used to access the GameBus backend
 * "refreshToken": Token which can be used to refresh the accessToken
 *
 * @param playerId User id to generate JWT for
 * @returns JWT
 */
export function createJWT(playerId: string, accessToken: string, refreshToken: string): string {
    return jwt.sign(
        { playerId: playerId, accessToken: accessToken, refreshToken: refreshToken },
        process.env.TOKEN_SECRET as string,
        {
            expiresIn: process.env.TOKEN_EXPIRES_IN,
            issuer: process.env.TOKEN_ISSUER,
            algorithm: 'HS256'
        }
    );
}

/**
 * Refreshes a JWT with an invalidated access token.
 * @param playerId Player id to refresh JWT for
 * @param refreshToken Refresh token in previous JWT
 * @returns New JWT
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function refreshJWT(playerId: string, refreshToken: string): string {
    const newAccessToken = ''; // TODO: add call to GameBus to refresh tokens
    const newRefreshToken = ''; // Same TODO
    return createJWT(playerId, newAccessToken, newRefreshToken);
}

/**
 * loginToken: token which should be used for login attempt
 * expires: when the token expires as Unix timestamp
 */
export interface LoginAttemptToken {
    loginToken: string;
    expires: number;
}

/**
 * What the (decoded) JWT token looks like
 * iat: issues at time
 * exp: expiry date
 * iss: issuer
 */
export interface DecodedJWT {
    playerId: string;
    accessToken: string;
    refreshToken: string;
    iat: number;
    exp: number;
    iss: string;
}
