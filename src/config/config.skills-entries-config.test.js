"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var zod_schema_js_1 = require("./zod-schema.js");
(0, vitest_1.describe)("skills entries config schema", function () {
    (0, vitest_1.it)("accepts custom fields under config", function () {
        var res = zod_schema_js_1.OpenClawSchema.safeParse({
            skills: {
                entries: {
                    "custom-skill": {
                        enabled: true,
                        config: {
                            url: "https://example.invalid",
                            token: "abc123",
                        },
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.success).toBe(true);
    });
    (0, vitest_1.it)("rejects unknown top-level fields", function () {
        var res = zod_schema_js_1.OpenClawSchema.safeParse({
            skills: {
                entries: {
                    "custom-skill": {
                        url: "https://example.invalid",
                    },
                },
            },
        });
        (0, vitest_1.expect)(res.success).toBe(false);
        if (res.success) {
            return;
        }
        (0, vitest_1.expect)(res.error.issues.some(function (issue) {
            return issue.path.join(".") === "skills.entries.custom-skill" &&
                issue.message.toLowerCase().includes("unrecognized");
        })).toBe(true);
    });
});
