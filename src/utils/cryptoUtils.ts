const crypto = require('crypto');
const algorithm = 'aes-128-cfb8';
const constantIV = "1234567890123456";

/**
 * Decrypts a Gamebus token.
 * @param token Token to decrypt
 * @param key Key to use for decryption, should be 128-bit
 * @returns Decrypted token or undefined if failed to decrypt
 */
export function decryptGamebusToken(token: string, key: string): string | undefined {
    try {
        return decryptAES(token, key);  // TODO: check if key is undefined
    } catch(e) {
        throw e; // For testing only
        //return undefined; --> TODO: check if decrypted text format is valid
    }
}

/**
 * Encrypts a Gamebus token.
 * @param token Token to encrypt
 * @param key Key to use for encryption, should be 128-bit
 * @returns Encrypted token
 */
export function encryptGamebusToken(token: string, key: string): string {
    return encryptAES(token, key);
}

/**
 * Encrypts plain text using AES with constant IV.
 * @param text Text to encrypt
 * @param key Key to use for encryption (128-bit)
 * @returns Ciphertext, base-64 encoded
 */
function encryptAES(text: string, key: string) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), constantIV);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('base64'); 
}

/**
 * Decrypts ciphertext usig AES with constant IV.
 * @param text Ciphertext, base-64 encoded
 * @param key Key to use for decryption (128-bit)
 * @returns Plain text (invalid if given key was invalid)
 */
function decryptAES(text: string, key: string) {
    let encryptedText = Buffer.from(text, 'base64'); 
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), constantIV); 
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}