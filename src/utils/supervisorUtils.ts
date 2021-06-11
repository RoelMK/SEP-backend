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
export function getTokens(supervisorEmail: string): any {
    const dbClient: DBClient = new DBClient();
    const tokens = dbClient.getChildTokens(supervisorEmail);
    return tokens;
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

export function getApproved(childEmail): any {
  const dbClient: DBClient = new DBClient();
  const tokens = dbClient.getApprovedSupervisors(childEmail);
  return tokens;
}

export function getChildren(supervisorEmail): any {
  const dbClient: DBClient = new DBClient();
  const tokens = dbClient.getRequestedChildren(supervisorEmail);
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
