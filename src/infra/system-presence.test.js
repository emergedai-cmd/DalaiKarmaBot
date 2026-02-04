"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var vitest_1 = require("vitest");
var system_presence_js_1 = require("./system-presence.js");
(0, vitest_1.describe)("system-presence", function () {
    (0, vitest_1.it)("dedupes entries across sources by case-insensitive instanceId key", function () {
        var _a, _b, _c;
        var instanceIdUpper = "AaBb-".concat((0, node_crypto_1.randomUUID)()).toUpperCase();
        var instanceIdLower = instanceIdUpper.toLowerCase();
        (0, system_presence_js_1.upsertPresence)(instanceIdUpper, {
            host: "openclaw",
            mode: "ui",
            instanceId: instanceIdUpper,
            reason: "connect",
        });
        (0, system_presence_js_1.updateSystemPresence)({
            text: "Node: Peter-Mac-Studio (10.0.0.1) · ui 2.0.0 · last input 5s ago · mode ui · reason beacon",
            instanceId: instanceIdLower,
            host: "Peter-Mac-Studio",
            ip: "10.0.0.1",
            mode: "ui",
            version: "2.0.0",
            lastInputSeconds: 5,
            reason: "beacon",
        });
        var matches = (0, system_presence_js_1.listSystemPresence)().filter(function (e) { var _a; return ((_a = e.instanceId) !== null && _a !== void 0 ? _a : "").toLowerCase() === instanceIdLower; });
        (0, vitest_1.expect)(matches).toHaveLength(1);
        (0, vitest_1.expect)((_a = matches[0]) === null || _a === void 0 ? void 0 : _a.host).toBe("Peter-Mac-Studio");
        (0, vitest_1.expect)((_b = matches[0]) === null || _b === void 0 ? void 0 : _b.ip).toBe("10.0.0.1");
        (0, vitest_1.expect)((_c = matches[0]) === null || _c === void 0 ? void 0 : _c.lastInputSeconds).toBe(5);
    });
    (0, vitest_1.it)("merges roles and scopes for the same device", function () {
        var deviceId = (0, node_crypto_1.randomUUID)();
        (0, system_presence_js_1.upsertPresence)(deviceId, {
            deviceId: deviceId,
            host: "openclaw",
            roles: ["operator"],
            scopes: ["operator.admin"],
            reason: "connect",
        });
        (0, system_presence_js_1.upsertPresence)(deviceId, {
            deviceId: deviceId,
            roles: ["node"],
            scopes: ["system.run"],
            reason: "connect",
        });
        var entry = (0, system_presence_js_1.listSystemPresence)().find(function (e) { return e.deviceId === deviceId; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.roles).toEqual(vitest_1.expect.arrayContaining(["operator", "node"]));
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.scopes).toEqual(vitest_1.expect.arrayContaining(["operator.admin", "system.run"]));
    });
});
