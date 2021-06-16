import { DBClient } from '../db/dbClient';

/**
 * Log token for a user
 * @param email Email of the user
 * @param loginToken Login token of the user
 * @returns If entry in the tokens table is added successfully
 */
export function logToken(email: string, loginToken: string): boolean {
    const dbClient: DBClient = new DBClient();

    const registered = dbClient.logToken(email, loginToken);
    dbClient.close();
    return registered;
}

/**
 * Request supervisor role from a supervisor
 * @param supervisorEmail Email of the supervisor user
 * @param childEmail Email of the normal user
 * @param confirmed Boolean which is true if the request is confirmed,
 * false otherwise
 * @returns If request/confirmation is successful
 */
export function request(supervisorEmail: string, childEmail: string, confirmed?: boolean): boolean {
    const dbClient: DBClient = new DBClient();

    let success = false;
    if (confirmed) {
        success = dbClient.confirmSupervisor(supervisorEmail, childEmail);
    } else {
        success = dbClient.requestSupervisor(supervisorEmail, childEmail);
    }
    dbClient.close();
    return success;
}

/**
 * Get tokens of children for a supervisor
 * @param supervisorEmail Email of the supervisor user
 * @returns Tokens of children for a supervisor user
 */
export function getToken(childEmail, supervisorEmail: string): any {
    const dbClient: DBClient = new DBClient();
    const token = dbClient.getToken(supervisorEmail, childEmail);
    return token;
}

/**
 * Get list of requested supervisor users for a normal user
 * @param childEmail Email of the normal user
 * @returns List of requested supervisor users
 */
export function getSupervisors(childEmail: string): any {
    const dbClient: DBClient = new DBClient();
    const tokens = dbClient.getRequestedSupervisors(childEmail);
    return tokens;
}

/**
 * Get approved supervisors for a user
 * @param childEmail Email of the normal user
 * @returns Approved supervisors
 */
export function getApproved(childEmail: string): any {
    const dbClient: DBClient = new DBClient();
    const tokens = dbClient.getApprovedSupervisors(childEmail);
    return tokens;
}

/**
 * Get the normal users for a supervisor
 * @param supervisorEmail Email of the supervisor user
 * @returns Normal users(children) for a supervisor
 */
export function getChildren(supervisorEmail: string): any {
    const dbClient: DBClient = new DBClient();
    const tokens = dbClient.getChildren(supervisorEmail);
    return tokens;
}

/**
 * Retract permission for a supervisor user to supervise
 * normal user
 * @param supervisorEmail Email of the supervisor user
 * @param childEmail Email of the normal user
 * @returns If the retractation is successful
 */
export function retractPermission(childEmail: string, supervisorEmail: string): boolean {
    const dbClient: DBClient = new DBClient();
    const success = dbClient.retractPermission(childEmail, supervisorEmail);
    return success;
}

/**
 * Check if user is a supervisor
 * @param email Email of the  user
 * @returns If the user is a supervisor
 */
export function checkSupervisor(email: string): any {
    const dbClient: DBClient = new DBClient();
    const supervisor = dbClient.checkRole(email);
    return supervisor;
}
