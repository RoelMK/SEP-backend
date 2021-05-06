import jwt from "jsonwebtoken";
import { DBClient } from "../db/dbClient";

/**
 * Registers a (new) user. Assumes call comes from a validated source, token may be overwritten.
 * @param userId Id of user to register
 * @param accessToken Access token of user to set
 * @param refreshToken Refresh token of user to set
 * @returns If the user has been registered successfully
 */
export function connectUser(userId: string, accessToken: string, refreshToken: string): boolean {
    if (userId === undefined || userId.length == 0 || accessToken === undefined || accessToken.length == 0) {
        return false;
    }

    let db: DBClient = new DBClient();
    let tokenSet: boolean = db.setUser(userId, accessToken, refreshToken);
    db.close();
    return tokenSet;
}

/**
 * Removes a user from the system. Assumes call comes from a validated source.
 * If token in db is undefined (normally meaning no token is in the db), true will be returned.
 * @param userId Id of user to remove
 * @returns If the user has been removed successfully
 */
export function disconnectUser(userId: string): boolean {
    let db: DBClient = new DBClient();
    let tokenRemoved: boolean = db.removeUser(userId);
    db.close();
    return tokenRemoved; 
}

/**
 * Retrieves the status of a user.
 * @param userModel User to get status for
 * @returns If user has a connection to the systen
 */
export function getUserStatus(userId: string): boolean {
    let db: DBClient = new DBClient();
    let foundToken: string | undefined = db.getAccessToken(userId);
    db.close();
    return foundToken !== undefined;
}

/**
 * Retrieves an access token for a user.
 * @param userId User to get access token for
 * @returns Access token or undefined if no access token was found or an error occurred
 */
export function getAccessToken(userId: string): string | undefined {
    let db: DBClient = new DBClient();
    let foundToken: string | undefined = db.getAccessToken(userId);
    db.close();
    return foundToken;
}

/**
 * Retrieves a refresh token for a user.
 * @param userId User to get refresh token for
 * @returns Refresh token or undefined if no refresh token was found or an error occurred
 */
export function getRefreshToken(userId: string): string | undefined {
    let db: DBClient = new DBClient();
    let foundToken: string | undefined = db.getRefreshToken(userId);
    db.close();
    return foundToken;
}

/**
 * Generates a jwt for a specified user id.
 * @param userId User id to generate token for
 * @returns Token
 */
export function generateToken(userId: string): string {
    return jwt.sign({userId: userId}, process.env.TOKEN_SECRET as string, { expiresIn: process.env.TOKEN_EXPIRES_IN, issuer: process.env.TOKEN_ISSUER, algorithm: 'HS256' });
}