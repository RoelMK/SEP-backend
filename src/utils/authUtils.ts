import jwt from 'jsonwebtoken';

/**
 * Generates a new JWT for a specified user id.
 * Token payload:
 * "userId": Id of user to which the token belongs
 * "accessToken": Token which can be used to access the GameBus backend
 * "refreshToken": Token which can be used to refresh the accessToken
 *
 * @param userId User id to generate JWT for
 * @returns JWT
 */
export function createJWT(userId: string, accessToken: string, refreshToken: string): string {
    return jwt.sign(
        { userId: userId, accessToken: accessToken, refreshToken: refreshToken },
        process.env.TOKEN_SECRET as string,
        { expiresIn: process.env.TOKEN_EXPIRES_IN, issuer: process.env.TOKEN_ISSUER, algorithm: 'HS256' }
    );
}

/**
 * Refreshes a JWT with an invalidated access token.
 * @param userId User id to refresh JWT for
 * @param refreshToken Refresh token in previous JWT
 * @returns New JWT
 */
export function refreshJWT(userId: string, refreshToken: string): string {
    let newAccessToken: string = ''; // TODO: add call to GameBus to refresh tokens
    let newRefreshToken: string = ''; // Same TODO
    return createJWT(userId, newAccessToken, newRefreshToken);
}

/**
 * Validates a request to connect a user to the dashboard.
 * @param userId User id to validate request for
 * @param accessToken Access token to validate
 * @returns If the user id is real and the access token belongs to the user and is valid
 */
export function validateConnectRequest(userId: string, accessToken: string): boolean {
    return true; // TODO: validate the request using GameBus (i.e. make call to GameBus and see if it works)
}

/**
 * What the (decoded) JWT token looks like
 * iat: issues at time
 * exp: expiry date
 * iss: issuer
 */
export interface DecodedJWT {
    userId: string;
    accessToken: string;
    refreshToken: string;
    iat: number;
    exp: number;
    iss: string;
}
