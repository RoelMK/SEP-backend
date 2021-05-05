import { UserModel } from "../../src/models/userModel";
import { connectUser, disconnectUser, getDecryptedGamebusToken, getUserStatus } from "../../src/utils/authUtils";
import * as assert from 'assert';

// NOTE: these tokens are currently encrypted using AES with constant IV (128-bit)
// This may not be the GameBus way of doing things, and should be changed if necessary.
const decrToken = "123456789abc1";
const encrToken = "d2QmVGx5GcJ/1BRTwg==";

export function runAuthTests(): void {
    testConnectStatusDisconnect();
    testStatusNotConnected();
    testDisconnectNotConnected();
    testDuplicateConnect();
}

/**
 * Tests connect, status and disconnect sequentially for one single user.
 */
function testConnectStatusDisconnect() {
    let user: UserModel = {
        userId: "user1",
        gamebusToken: encrToken
    };
    assert.strictEqual(connectUser(user), true);
    assert.strictEqual(getUserStatus(user), true);
    assert.strictEqual(getDecryptedGamebusToken(user.userId), decrToken);
    assert.strictEqual(disconnectUser(user), true);
}

/**
 * Tests if status is correct if user is not connected.
 */
function testStatusNotConnected() {
    let user: UserModel = {
        userId: "user2",
        gamebusToken: encrToken
    };
    assert.strictEqual(getUserStatus(user), false); // TODO: add test for invalid token
}

/**
 * Tests if disconnect works properly if user does not exist.
 */
function testDisconnectNotConnected() {
    let user: UserModel = {
        userId: "user3",
        gamebusToken: encrToken
    };
    assert.strictEqual(disconnectUser(user), true);
}

/**
 * Tests if adding the same user twice works properly.
 */
function testDuplicateConnect() {
    let user: UserModel = {
        userId: "user4",
        gamebusToken: encrToken
    };
    assert.strictEqual(connectUser(user), true);
    assert.strictEqual(connectUser(user), true); // TODO: change key and check if key change happens
    assert.strictEqual(disconnectUser(user), true);
}