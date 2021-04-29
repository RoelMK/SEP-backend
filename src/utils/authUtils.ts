import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";

/**
 * Registers a (new) user.
 * @param userModel User to register
 * @returns If the user has been registered successfully
 */
export function connectUser(userModel: UserModel): boolean {
    return true; // TODO: add to database
}

/**
 * Removes a user from the system.
 * @param userModel User to remove
 * @returns If the user has been removed successfully
 */
export function disconnectUser(userModel: UserModel): boolean {
    return true; // TODO: remove from database
}

/**
 * Retrieves the status of a user.
 * @param userModel User to get status for
 * @returns If user has a connection to the systen
 */
export function getUserStatus(userModel: UserModel): boolean {
    return false; // TODO: find status in database
}

/**
 * Generates a jwt for a specified user id.
 * @param userId User id to generate token for
 * @returns Token
 */
export function generateToken(userId: string): string {
    return jwt.sign({userId: userId}, process.env.TOKEN_SECRET as string, { expiresIn: process.env.TOKEN_EXPIRES_IN, issuer: process.env.TOKEN_ISSUER, algorithm: 'HS256' });
}