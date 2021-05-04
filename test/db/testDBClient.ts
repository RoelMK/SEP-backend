import { DBClient } from "../../src/db/dbClient";
import { UserModel } from "../../src/models/userModel";
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
    const user: UserModel = {userId: "id1", gamebusToken: "secretToken"};

    dbClient.setToken(user);
    let token: string | undefined = dbClient.getToken(user.userId);
    assert.strictEqual(token, user.gamebusToken);

    dbClient.removeToken(user.userId);
    dbClient.close();
}

/**
 * Tests if adding an already existing entry does not cause an error.
 */
function testDBSetDuplicate() {
    const dbClient = new DBClient(true);
    const user1: UserModel = {userId: "id1", gamebusToken: "secretToken1"};
    const user2: UserModel = {userId: "id1", gamebusToken: "secretToken2"};

    dbClient.setToken(user1);
    let token: string | undefined = dbClient.getToken(user1.userId);
    assert.strictEqual(token, user1.gamebusToken);

    dbClient.setToken(user2);
    token = dbClient.getToken(user2.userId);
    assert.strictEqual(token, user2.gamebusToken);

    dbClient.removeToken(user2.userId);
    token = dbClient.getToken(user2.userId);
    assert.strictEqual(token, undefined);

    dbClient.close();
}

/**
 * Tests if removing a non-existing user does not cause an error.
 */
function testDBRemoveNonExisting() {
    const dbClient = new DBClient(true);
    const user: UserModel = {userId: "id1", gamebusToken: "secretToken"};

    dbClient.removeToken(user.userId);

    dbClient.close();
}

/**
 * Tests if requesting a token for a non-existing user does not cause an error,
 * but returns undefined instead.
 */
function testDBGetNonExisting() {
    const dbClient = new DBClient(true);
    const user: UserModel = {userId: "id1", gamebusToken: "secretToken"};

    let token: string | undefined = dbClient.getToken(user.userId);
    assert.strictEqual(token, undefined);

    dbClient.close();
}
