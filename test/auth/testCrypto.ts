import * as assert from 'assert';
import { decryptGamebusToken, encryptGamebusToken } from '../../src/utils/cryptoUtils';

const plainText: string = "123456789abc1";
const encryptionKey: string = '2slbwyBzfgzUIvXZ'; // Must be 128 bytes (16 characters)

export function runCryptoTests() {
    testEncryptDecrypt();
    //testDecryptOnly();
}

/**
 * Tests decryption for a given cipher.
 * Currently not working, since IV/mode are unclear.
 */
function testDecryptOnly() {
    const encryptedPlainTextBas64: string = "d2QmVGx5GcJ/1BRTwg=="; // For testing purposes
    //const encryptedPlainTextBas64: string = "xjHPuN1v4WCKmPOSP1psOQ==";     // Generated using https://aesencryption.net/, but IV and mode are unknown (so does not work right now)

    let decrypted: string | undefined = decryptGamebusToken(encryptedPlainTextBas64, encryptionKey);
    assert.strictEqual(decrypted, plainText);
}

/**
 * Tests decryption for a known encryption method.
 */
function testEncryptDecrypt() {
    let encrypted: string = encryptGamebusToken(plainText, encryptionKey);
    console.log("Chipertext: " + encrypted)
    let decrypted: string | undefined = decryptGamebusToken(encrypted, encryptionKey);
    assert.strictEqual(decrypted, plainText);
}