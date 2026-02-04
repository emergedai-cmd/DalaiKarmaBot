"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var zod_schema_js_1 = require("./zod-schema.js");
(0, vitest_1.describe)("telegram custom commands schema", function () {
    (0, vitest_1.it)("normalizes custom commands", function () {
        var _a, _b;
        var res = zod_schema_js_1.OpenClawSchema.safeParse({
            channels: {
                telegram: {
                    customCommands: [{ command: "/Backup", description: "  Git backup  " }],
                },
            },
        });
        (0, vitest_1.expect)(res.success).toBe(true);
        if (!res.success) {
            return;
        }
        (0, vitest_1.expect)((_b = (_a = res.data.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.customCommands).toEqual([
            { command: "backup", description: "Git backup" },
        ]);
    });
    (0, vitest_1.it)("rejects custom commands with invalid names", function () {
        var res = zod_schema_js_1.OpenClawSchema.safeParse({
            channels: {
                telegram: {
                    customCommands: [{ command: "Bad-Name", description: "Override status" }],
                },
            },
        });
        (0, vitest_1.expect)(res.success).toBe(false);
        if (res.success) {
            return;
        }
        (0, vitest_1.expect)(res.error.issues.some(function (issue) {
            return issue.path.join(".") === "channels.telegram.customCommands.0.command" &&
                issue.message.includes("invalid");
        })).toBe(true);
    });
});
