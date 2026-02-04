"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var logging_js_1 = require("../logging.js");
var state_js_1 = require("./state.js");
var snapshot;
(0, vitest_1.beforeEach)(function () {
    snapshot = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        trace: console.trace,
    };
    state_js_1.loggingState.consolePatched = false;
    state_js_1.loggingState.forceConsoleToStderr = false;
    state_js_1.loggingState.consoleTimestampPrefix = false;
    state_js_1.loggingState.rawConsole = null;
    (0, logging_js_1.resetLogger)();
});
(0, vitest_1.afterEach)(function () {
    console.log = snapshot.log;
    console.info = snapshot.info;
    console.warn = snapshot.warn;
    console.error = snapshot.error;
    console.debug = snapshot.debug;
    console.trace = snapshot.trace;
    state_js_1.loggingState.consolePatched = false;
    state_js_1.loggingState.forceConsoleToStderr = false;
    state_js_1.loggingState.consoleTimestampPrefix = false;
    state_js_1.loggingState.rawConsole = null;
    (0, logging_js_1.resetLogger)();
    (0, logging_js_1.setLoggerOverride)(null);
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("enableConsoleCapture", function () {
    (0, vitest_1.it)("swallows EIO from stderr writes", function () {
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        vitest_1.vi.spyOn(process.stderr, "write").mockImplementation(function () {
            throw eioError();
        });
        (0, logging_js_1.routeLogsToStderr)();
        (0, logging_js_1.enableConsoleCapture)();
        (0, vitest_1.expect)(function () { return console.log("hello"); }).not.toThrow();
    });
    (0, vitest_1.it)("swallows EIO from original console writes", function () {
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        console.log = function () {
            throw eioError();
        };
        (0, logging_js_1.enableConsoleCapture)();
        (0, vitest_1.expect)(function () { return console.log("hello"); }).not.toThrow();
    });
    (0, vitest_1.it)("prefixes console output with timestamps when enabled", function () {
        var _a, _b;
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        var now = new Date("2026-01-17T18:01:02.000Z");
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(now);
        var warn = vitest_1.vi.fn();
        console.warn = warn;
        (0, logging_js_1.setConsoleTimestampPrefix)(true);
        (0, logging_js_1.enableConsoleCapture)();
        console.warn("[EventQueue] Slow listener detected");
        (0, vitest_1.expect)(warn).toHaveBeenCalledTimes(1);
        var firstArg = String((_b = (_a = warn.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "");
        (0, vitest_1.expect)(firstArg.startsWith("2026-01-17T18:01:02.000Z [EventQueue]")).toBe(true);
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.it)("suppresses discord EventQueue slow listener duplicates", function () {
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        var warn = vitest_1.vi.fn();
        console.warn = warn;
        (0, logging_js_1.enableConsoleCapture)();
        console.warn("[EventQueue] Slow listener detected: DiscordMessageListener took 12.3 seconds for event MESSAGE_CREATE");
        (0, vitest_1.expect)(warn).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("does not double-prefix timestamps", function () {
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        var warn = vitest_1.vi.fn();
        console.warn = warn;
        (0, logging_js_1.setConsoleTimestampPrefix)(true);
        (0, logging_js_1.enableConsoleCapture)();
        console.warn("12:34:56 [exec] hello");
        (0, vitest_1.expect)(warn).toHaveBeenCalledWith("12:34:56 [exec] hello");
    });
    (0, vitest_1.it)("leaves JSON output unchanged when timestamp prefix is enabled", function () {
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: tempLogPath() });
        var log = vitest_1.vi.fn();
        console.log = log;
        (0, logging_js_1.setConsoleTimestampPrefix)(true);
        (0, logging_js_1.enableConsoleCapture)();
        var payload = JSON.stringify({ ok: true });
        console.log(payload);
        (0, vitest_1.expect)(log).toHaveBeenCalledWith(payload);
    });
});
function tempLogPath() {
    return node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-log-".concat(node_crypto_1.default.randomUUID(), ".log"));
}
function eioError() {
    var err = new Error("EIO");
    err.code = "EIO";
    return err;
}
