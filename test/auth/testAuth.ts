import { connectUser, disconnectUser, getAccessToken, getRefreshToken, getUserStatus } from "../../src/utils/authUtils";
import * as assert from 'assert';

export function runAuthTests(): void {
    testInvalidConnect();
    testConnectStatusDisconnect();
    testStatusNotConnected();
    testDisconnectNotConnected();
    testDuplicateConnect();
    testEmptyRefreshToken();
}

/**
 * Tests connect, status and disconnect sequentially for one single user.
 */
function testConnectStatusDisconnect() {
    assert.strictEqual(connectUser("id1", "s1", "a1"), true);
    assert.strictEqual(getUserStatus("id1"), true);
    assert.strictEqual(getAccessToken("id1"), "s1");
    assert.strictEqual(getRefreshToken("id1"), "a1");
    assert.strictEqual(disconnectUser("id1"), true);
}

/**
 * Tests if an empty access token can be added.
 */
function testEmptyRefreshToken() {
    assert.strictEqual(connectUser("id1", "s1", ""), true);
    assert.strictEqual(getRefreshToken("id1"), "");
    assert.strictEqual(disconnectUser("id1"), true);
}

/**
 * Tests if invalid rejects are not accepted.
 */
function testInvalidConnect() {
    assert.strictEqual(connectUser("", "s1", ""), false);
    assert.strictEqual(connectUser("id1", "", ""), false);
    assert.strictEqual(connectUser("", "", ""), false);
    assert.strictEqual(connectUser("", "", "a1"), false);
}

/**
 * Tests if status is correct if user is not connected.
 */
function testStatusNotConnected() {
    assert.strictEqual(getUserStatus("id1"), false);
}

/**
 * Tests if disconnect works properly if user does not exist.
 */
function testDisconnectNotConnected() {
    assert.strictEqual(disconnectUser("id1"), true);
}

/**
 * Tests if adding the same user twice works properly.
 */
function testDuplicateConnect() {
    assert.strictEqual(connectUser("id1", "s1", "a1"), true);
    assert.strictEqual(connectUser("id1", "s1", "a1"), true);
    assert.strictEqual(connectUser("id1", "s2", "a1"), true);
    assert.strictEqual(getAccessToken("id1"), "s2");
    assert.strictEqual(disconnectUser("id1"), true);
}