"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_schema_js_1 = require("./config-schema.js");
(0, vitest_1.describe)("Tlon config schema", function () {
    (0, vitest_1.it)("accepts channelRules with string keys", function () {
        var _a, _b;
        var parsed = config_schema_js_1.TlonAuthorizationSchema.parse({
            channelRules: {
                "chat/~zod/test": {
                    mode: "open",
                    allowedShips: ["~zod"],
                },
            },
        });
        (0, vitest_1.expect)((_b = (_a = parsed.channelRules) === null || _a === void 0 ? void 0 : _a["chat/~zod/test"]) === null || _b === void 0 ? void 0 : _b.mode).toBe("open");
    });
    (0, vitest_1.it)("accepts accounts with string keys", function () {
        var _a, _b;
        var parsed = config_schema_js_1.TlonConfigSchema.parse({
            accounts: {
                primary: {
                    ship: "~zod",
                    url: "https://example.com",
                    code: "code-123",
                },
            },
        });
        (0, vitest_1.expect)((_b = (_a = parsed.accounts) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.ship).toBe("~zod");
    });
});
