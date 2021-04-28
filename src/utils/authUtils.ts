import { UserModel } from "../models/userModel";

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