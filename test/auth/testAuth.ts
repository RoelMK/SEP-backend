import * as assert from 'assert';
import jwt from "jsonwebtoken";
import { createJWT } from '../../src/utils/authUtils';

// NOTE: test cases below not required if tokens are not saved in database.
export function runAuthTests(): void {
    testCreateJWT();
}

/**
 * Tests if a JWT is properly generated and contains the correct information.
 */
function testCreateJWT() : void {
    let token = createJWT("id1", "a1", "r1");
    let decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as any;
    console.log(decoded);
    assert.strictEqual(decoded.userId, "id1");
    assert.strictEqual(decoded.accessToken, "a1");
    assert.strictEqual(decoded.refreshToken, "r1");
}

// TODO: test for refresh token
// TODO: test for validate connect request