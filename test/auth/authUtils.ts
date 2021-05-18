import jwt from 'jsonwebtoken';

export function createJWT(
    userId: string,
    accessToken: string,
    refreshToken: string,
    tokenSecret: string,
    expiresIn: string,
    issuer: string
): string {
    return jwt.sign(
        { userId: userId, accessToken: accessToken, refreshToken: refreshToken },
        tokenSecret,
        {
            expiresIn: expiresIn,
            issuer: issuer,
            algorithm: 'HS256'
        }
    );
}
