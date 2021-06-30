/**
 * Interface of OneDrive token objects that are
 * retrieved after logging in to OneDrive
 */
export interface OneDriveTokenModel {
    homeAccountId: string;
    accessToken: string;
    expiresOn: number;
}

/**
 * Generates a redirect URL where account details are passed as query parameters.
 * @param account Account details to generate URL for
 * @returns URL to redirect to
 */
export function generateRedirectUrl(account: OneDriveTokenModel): string {
    let redirectUri = process.env.ONEDRIVE_FRONTEND_REDIRECT;
    if (!redirectUri) {
        redirectUri = '/onedrive/displayTokens'; // Set a default uri if none is specified in env
    }

    return (
        redirectUri +
        '?homeAccountId=' +
        encodeURIComponent(account.homeAccountId) +
        '&accessToken=' +
        encodeURIComponent(account.accessToken) +
        '&expiresOn=' +
        account.expiresOn.toString()
    );
}
