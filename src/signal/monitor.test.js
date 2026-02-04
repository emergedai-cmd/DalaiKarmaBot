"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var identity_js_1 = require("./identity.js");
(0, vitest_1.describe)("signal groupPolicy gating", function () {
    (0, vitest_1.it)("allows when policy is open", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "open",
            allowFrom: [],
            sender: { kind: "phone", raw: "+15550001111", e164: "+15550001111" },
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks when policy is disabled", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "disabled",
            allowFrom: ["+15550001111"],
            sender: { kind: "phone", raw: "+15550001111", e164: "+15550001111" },
        })).toBe(false);
    });
    (0, vitest_1.it)("blocks allowlist when empty", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "allowlist",
            allowFrom: [],
            sender: { kind: "phone", raw: "+15550001111", e164: "+15550001111" },
        })).toBe(false);
    });
    (0, vitest_1.it)("allows allowlist when sender matches", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "allowlist",
            allowFrom: ["+15550001111"],
            sender: { kind: "phone", raw: "+15550001111", e164: "+15550001111" },
        })).toBe(true);
    });
    (0, vitest_1.it)("allows allowlist wildcard", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "allowlist",
            allowFrom: ["*"],
            sender: { kind: "phone", raw: "+15550002222", e164: "+15550002222" },
        })).toBe(true);
    });
    (0, vitest_1.it)("allows allowlist when uuid sender matches", function () {
        (0, vitest_1.expect)((0, identity_js_1.isSignalGroupAllowed)({
            groupPolicy: "allowlist",
            allowFrom: ["uuid:123e4567-e89b-12d3-a456-426614174000"],
            sender: {
                kind: "uuid",
                raw: "123e4567-e89b-12d3-a456-426614174000",
            },
        })).toBe(true);
    });
});
