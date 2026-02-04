"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var vitest_1 = require("vitest");
var signature_js_1 = require("./signature.js");
var sign = function (body, secret) {
    return node_crypto_1.default.createHmac("SHA256", secret).update(body).digest("base64");
};
(0, vitest_1.describe)("validateLineSignature", function () {
    (0, vitest_1.it)("accepts valid signatures", function () {
        var secret = "secret";
        var rawBody = JSON.stringify({ events: [{ type: "message" }] });
        (0, vitest_1.expect)((0, signature_js_1.validateLineSignature)(rawBody, sign(rawBody, secret), secret)).toBe(true);
    });
    (0, vitest_1.it)("rejects signatures computed with the wrong secret", function () {
        var rawBody = JSON.stringify({ events: [{ type: "message" }] });
        (0, vitest_1.expect)((0, signature_js_1.validateLineSignature)(rawBody, sign(rawBody, "wrong-secret"), "secret")).toBe(false);
    });
    (0, vitest_1.it)("rejects signatures with a different length", function () {
        var rawBody = JSON.stringify({ events: [{ type: "message" }] });
        (0, vitest_1.expect)((0, signature_js_1.validateLineSignature)(rawBody, "short", "secret")).toBe(false);
    });
});
