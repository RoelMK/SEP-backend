import jwt from "express-jwt";

// Default token location: req.user --> playerId can be found under req.user.playerId, same holds for the tokens
export const checkJwt = jwt({
    secret: process.env.TOKEN_SECRET as string,
    algorithms: ['HS256'],
    issuer: process.env.TOKEN_ISSUER as string,
});