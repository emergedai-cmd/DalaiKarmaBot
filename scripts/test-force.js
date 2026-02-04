#!/usr/bin/env -S node --import tsx
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var ports_js_1 = require("../src/cli/ports.js");
var DEFAULT_PORT = 18789;
function killGatewayListeners(port) {
    try {
        var killed = (0, ports_js_1.forceFreePort)(port);
        if (killed.length > 0) {
            console.log("freed port ".concat(port, "; terminated: ").concat(killed
                .map(function (p) { return "".concat(p.command, " (pid ").concat(p.pid, ")"); })
                .join(", ")));
        }
        else {
            console.log("port ".concat(port, " already free"));
        }
        return killed;
    }
    catch (err) {
        console.error("failed to free port ".concat(port, ": ").concat(String(err)));
        return [];
    }
}
function runTests() {
    var _a, _b;
    var isolatedLock = (_a = process.env.OPENCLAW_GATEWAY_LOCK) !== null && _a !== void 0 ? _a : node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway.lock.test.".concat(Date.now()));
    var result = (0, node_child_process_1.spawnSync)("pnpm", ["vitest", "run"], {
        stdio: "inherit",
        env: __assign(__assign({}, process.env), { OPENCLAW_GATEWAY_LOCK: isolatedLock }),
    });
    if (result.error) {
        console.error("pnpm test failed to start: ".concat(String(result.error)));
        process.exit(1);
    }
    process.exit((_b = result.status) !== null && _b !== void 0 ? _b : 1);
}
function main() {
    var _a;
    var port = Number.parseInt((_a = process.env.OPENCLAW_GATEWAY_PORT) !== null && _a !== void 0 ? _a : "".concat(DEFAULT_PORT), 10);
    console.log("\uD83E\uDDF9 test:force - clearing gateway on port ".concat(port));
    var killed = killGatewayListeners(port);
    if (killed.length === 0) {
        console.log("no listeners to kill");
    }
    console.log("running pnpm test…");
    runTests();
}
main();
