"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = generateUUID;
var warnedWeakCrypto = false;
function uuidFromBytes(bytes) {
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
    var hex = "";
    for (var i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
    }
    return "".concat(hex.slice(0, 8), "-").concat(hex.slice(8, 12), "-").concat(hex.slice(12, 16), "-").concat(hex.slice(16, 20), "-").concat(hex.slice(20));
}
function weakRandomBytes() {
    var bytes = new Uint8Array(16);
    var now = Date.now();
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[0] ^= now & 0xff;
    bytes[1] ^= (now >>> 8) & 0xff;
    bytes[2] ^= (now >>> 16) & 0xff;
    bytes[3] ^= (now >>> 24) & 0xff;
    return bytes;
}
function warnWeakCryptoOnce() {
    if (warnedWeakCrypto) {
        return;
    }
    warnedWeakCrypto = true;
    console.warn("[uuid] crypto API missing; falling back to weak randomness");
}
function generateUUID(cryptoLike) {
    if (cryptoLike === void 0) { cryptoLike = globalThis.crypto; }
    if (cryptoLike && typeof cryptoLike.randomUUID === "function") {
        return cryptoLike.randomUUID();
    }
    if (cryptoLike && typeof cryptoLike.getRandomValues === "function") {
        var bytes = new Uint8Array(16);
        cryptoLike.getRandomValues(bytes);
        return uuidFromBytes(bytes);
    }
    warnWeakCryptoOnce();
    return uuidFromBytes(weakRandomBytes());
}
