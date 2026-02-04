"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var utils_js_1 = require("../utils.js");
var cache_trace_js_1 = require("./cache-trace.js");
(0, vitest_1.describe)("createCacheTrace", function () {
    (0, vitest_1.it)("returns null when diagnostics cache tracing is disabled", function () {
        var trace = (0, cache_trace_js_1.createCacheTrace)({
            cfg: {},
            env: {},
        });
        (0, vitest_1.expect)(trace).toBeNull();
    });
    (0, vitest_1.it)("honors diagnostics cache trace config and expands file paths", function () {
        var lines = [];
        var trace = (0, cache_trace_js_1.createCacheTrace)({
            cfg: {
                diagnostics: {
                    cacheTrace: {
                        enabled: true,
                        filePath: "~/.openclaw/logs/cache-trace.jsonl",
                    },
                },
            },
            env: {},
            writer: {
                filePath: "memory",
                write: function (line) { return lines.push(line); },
            },
        });
        (0, vitest_1.expect)(trace).not.toBeNull();
        (0, vitest_1.expect)(trace === null || trace === void 0 ? void 0 : trace.filePath).toBe((0, utils_js_1.resolveUserPath)("~/.openclaw/logs/cache-trace.jsonl"));
        trace === null || trace === void 0 ? void 0 : trace.recordStage("session:loaded", {
            messages: [],
            system: "sys",
        });
        (0, vitest_1.expect)(lines.length).toBe(1);
    });
    (0, vitest_1.it)("records empty prompt/system values when enabled", function () {
        var _a, _b;
        var lines = [];
        var trace = (0, cache_trace_js_1.createCacheTrace)({
            cfg: {
                diagnostics: {
                    cacheTrace: {
                        enabled: true,
                        includePrompt: true,
                        includeSystem: true,
                    },
                },
            },
            env: {},
            writer: {
                filePath: "memory",
                write: function (line) { return lines.push(line); },
            },
        });
        trace === null || trace === void 0 ? void 0 : trace.recordStage("prompt:before", { prompt: "", system: "" });
        var event = JSON.parse((_b = (_a = lines[0]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "{}");
        (0, vitest_1.expect)(event.prompt).toBe("");
        (0, vitest_1.expect)(event.system).toBe("");
    });
    (0, vitest_1.it)("respects env overrides for enablement", function () {
        var lines = [];
        var trace = (0, cache_trace_js_1.createCacheTrace)({
            cfg: {
                diagnostics: {
                    cacheTrace: {
                        enabled: true,
                    },
                },
            },
            env: {
                OPENCLAW_CACHE_TRACE: "0",
            },
            writer: {
                filePath: "memory",
                write: function (line) { return lines.push(line); },
            },
        });
        (0, vitest_1.expect)(trace).toBeNull();
    });
});
