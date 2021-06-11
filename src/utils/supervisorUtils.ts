import jwt from 'jsonwebtoken';
import { DBClient } from '../db/dbClient';
import { GameBusClient } from '../gb/gbClient';
import crypto from 'crypto';

/**
 * Finishes a login attempt and generates a JWT with credentials.
 * @param loginToken Login token of attempt to finish
 * @returns A JWT with credentials or undefined if failed to finish login attempt
 */
export function logToken(email: string, loginToken: string ): Boolean {
  const dbClient: DBClient = new DBClient();

  const registered = dbClient.logToken(email, loginToken);
  dbClient.close();

  return registered;
}

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

export function getTokens(supervisorEmail): any {
  const dbClient: DBClient = new DBClient();
  const tokens = dbClient.getChildTokens(supervisorEmail);
  return tokens;
}

export function getSupervisors(childEmail): any {
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

export function retractPermission(childEmail, supervisorEmail) {
  const dbClient: DBClient = new DBClient();
  const success = dbClient.retractPermission(childEmail, supervisorEmail);

  return success;

}