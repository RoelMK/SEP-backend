import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import { DBClient } from "../db/dbClient";
import { decryptGamebusToken } from "./cryptoUtils";

/**
 * Registers a (new) user. Assumes given user is valid, token may be overwritten.
 * @param userModel User to register
 * @returns If the user has been registered successfully
 */
export function connectUser(userModel: UserModel): boolean {
    let db: DBClient = new DBClient();
    let tokenSet: boolean = db.setToken(userModel);
    db.close();
    return tokenSet;
}

/**
 * Removes a user from the system. Given token is validated.
 * If token in db is undefined (normally meaning no token is in the db), true will be returned.
 * @param userModel User to remove
 * @returns If the user has been removed successfully
 */
export function disconnectUser(userModel: UserModel): boolean {
    let db: DBClient = new DBClient();

    let tokenRemoved: boolean = false;
    let token: string | undefined = db.getToken(userModel.userId);
    if (token === userModel.gamebusToken) {
        tokenRemoved = db.removeToken(userModel.userId);
    } else if (token === undefined) {
        tokenRemoved = true;
    }
    db.close();

    return tokenRemoved; 
}

/**
 * Retrieves the status of a user. Token is validated. If token is invalid, false will be returned.
 * @param userModel User to get status for
 * @returns If user has a connection to the systen
 */
export function getUserStatus(userModel: UserModel): boolean {
    let db: DBClient = new DBClient();
    let foundToken: string | undefined = db.getToken(userModel.userId);
    db.close();
    return foundToken === userModel.gamebusToken;
}

/**
 * Retrieves the decrypted token for a user.
 * @param userId User to get token for
 * @returns Decrypted token or undefined if no token was found or an error occurred
 */
export function getDecryptedGamebusToken(userId: string): string | undefined {
    let db: DBClient = new DBClient();
    let foundToken: string | undefined = db.getToken(userId);
    db.close();
    if (foundToken) {
        return decryptGamebusToken(foundToken, process.env.GAMEBUS_TOKEN_SECRET as string);
    } else {
        return undefined;
    }
}

/**
 * Generates a jwt for a specified user id.
 * @param userId User id to generate token for
 * @returns Token
 */
export function generateToken(userId: string): string {
    return jwt.sign({userId: userId}, process.env.TOKEN_SECRET as string, { expiresIn: process.env.TOKEN_EXPIRES_IN, issuer: process.env.TOKEN_ISSUER, algorithm: 'HS256' });
}