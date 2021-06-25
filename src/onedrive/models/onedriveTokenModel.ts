/**
 * Interface of OneDrive token objects that are
 * retrieved after logging in to OneDrive
 */
export interface OneDriveTokenModel {
    homeAccountId: string;
    accessToken: string;
    expiresOn: number;
}
