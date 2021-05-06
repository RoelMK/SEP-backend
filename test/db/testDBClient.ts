import { DBClient } from "../../src/db/dbClient";
import * as assert from 'assert';

/**
 * Runs all SQLite database related tests.
 */
export function runDBTests() {
    testDBInitialization();
    testDBGetNonExisting();
    testDBInsertGetRemove();
    testDBSetDuplicate();
    testDBRemoveNonExisting();
}

/**
 * Tests if a database initializes properly.
 */
function testDBInitialization() {
    const dbClient = new DBClient(true);
    dbClient.initialize();
    dbClient.close();
}

/**
 * Tests if entries can be inserted and removed properly.
 */
function testDBInsertGetRemove() {
    const dbClient = new DBClient(true);

    assert.strictEqual(dbClient.setUser("id1", "secretToken1", "refreshToken1"), true);
    assert.strictEqual(dbClient.getAccessToken("id1"), "secretToken1");
    assert.strictEqual(dbClient.getRefreshToken("id1"), "refreshToken1");

    assert.strictEqual(dbClient.removeUser("id1"), true);
    dbClient.close();
}

/**
 * Tests if adding an already existing entry does not cause an error.
 */
function testDBSetDuplicate() {
    const dbClient = new DBClient(true);

    assert.strictEqual(dbClient.setUser("id1", "s1", "r1"), true);
    let token: string | undefined = dbClient.getAccessToken("id1");
    assert.strictEqual(token, "s1");

    assert.strictEqual(dbClient.setUser("id1", "s2", "r1"), true);
    token = dbClient.getAccessToken("id1");
    assert.strictEqual(token, "s2");

    assert.strictEqual(dbClient.removeUser("id1"), true);
    token = dbClient.getAccessToken("id1");
    assert.strictEqual(token, undefined);

    dbClient.close();
}

/**
 * Tests if removing a non-existing user does not cause an error.
 */
function testDBRemoveNonExisting() {
    const dbClient = new DBClient(true);

    assert.strictEqual(dbClient.removeUser("id1"), true);

    dbClient.close();
}

/**
 * Tests if requesting a token for a non-existing user does not cause an error,
 * but returns undefined instead.
 */
function testDBGetNonExisting() {
    const dbClient = new DBClient(true);

    let token: string | undefined = dbClient.getAccessToken("id1");
    assert.strictEqual(token, undefined);

    dbClient.close();
}
