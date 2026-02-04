"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var parse_log_line_js_1 = require("./parse-log-line.js");
(0, vitest_1.describe)("parseLogLine", function () {
    (0, vitest_1.it)("parses structured JSON log lines", function () {
        var line = JSON.stringify({
            time: "2026-01-09T01:38:41.523Z",
            0: '{"subsystem":"gateway/channels/whatsapp"}',
            1: "connected",
            _meta: {
                name: '{"subsystem":"gateway/channels/whatsapp"}',
                logLevelName: "INFO",
            },
        });
        var parsed = (0, parse_log_line_js_1.parseLogLine)(line);
        (0, vitest_1.expect)(parsed).not.toBeNull();
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.time).toBe("2026-01-09T01:38:41.523Z");
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.level).toBe("info");
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.subsystem).toBe("gateway/channels/whatsapp");
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.message).toBe('{"subsystem":"gateway/channels/whatsapp"} connected');
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.raw).toBe(line);
    });
    (0, vitest_1.it)("falls back to meta timestamp when top-level time is missing", function () {
        var line = JSON.stringify({
            0: "hello",
            _meta: {
                name: '{"subsystem":"gateway"}',
                logLevelName: "WARN",
                date: "2026-01-09T02:10:00.000Z",
            },
        });
        var parsed = (0, parse_log_line_js_1.parseLogLine)(line);
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.time).toBe("2026-01-09T02:10:00.000Z");
        (0, vitest_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.level).toBe("warn");
    });
    (0, vitest_1.it)("returns null for invalid JSON", function () {
        (0, vitest_1.expect)((0, parse_log_line_js_1.parseLogLine)("not-json")).toBeNull();
    });
});
