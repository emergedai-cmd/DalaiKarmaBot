"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var channel_js_1 = require("./channel.js");
(0, vitest_1.describe)("mattermostPlugin", function () {
    (0, vitest_1.describe)("messaging", function () {
        (0, vitest_1.it)("keeps @username targets", function () {
            var _a;
            var normalize = (_a = channel_js_1.mattermostPlugin.messaging) === null || _a === void 0 ? void 0 : _a.normalizeTarget;
            if (!normalize) {
                return;
            }
            (0, vitest_1.expect)(normalize("@Alice")).toBe("@Alice");
            (0, vitest_1.expect)(normalize("@alice")).toBe("@alice");
        });
        (0, vitest_1.it)("normalizes mattermost: prefix to user:", function () {
            var _a;
            var normalize = (_a = channel_js_1.mattermostPlugin.messaging) === null || _a === void 0 ? void 0 : _a.normalizeTarget;
            if (!normalize) {
                return;
            }
            (0, vitest_1.expect)(normalize("mattermost:USER123")).toBe("user:USER123");
        });
    });
    (0, vitest_1.describe)("pairing", function () {
        (0, vitest_1.it)("normalizes allowlist entries", function () {
            var _a;
            var normalize = (_a = channel_js_1.mattermostPlugin.pairing) === null || _a === void 0 ? void 0 : _a.normalizeAllowEntry;
            if (!normalize) {
                return;
            }
            (0, vitest_1.expect)(normalize("@Alice")).toBe("alice");
            (0, vitest_1.expect)(normalize("user:USER123")).toBe("user123");
        });
    });
    (0, vitest_1.describe)("config", function () {
        (0, vitest_1.it)("formats allowFrom entries", function () {
            var formatAllowFrom = channel_js_1.mattermostPlugin.config.formatAllowFrom;
            var formatted = formatAllowFrom({
                allowFrom: ["@Alice", "user:USER123", "mattermost:BOT999"],
            });
            (0, vitest_1.expect)(formatted).toEqual(["@alice", "user123", "bot999"]);
        });
    });
});
