"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var globals_js_1 = require("./globals.js");
var logger_js_1 = require("./logger.js");
var logging_js_1 = require("./logging.js");
(0, vitest_1.describe)("logger helpers", function () {
    (0, vitest_1.afterEach)(function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)(null);
        (0, globals_js_1.setVerbose)(false);
    });
    (0, vitest_1.it)("formats messages through runtime log/error", function () {
        var log = vitest_1.vi.fn();
        var error = vitest_1.vi.fn();
        var runtime = { log: log, error: error, exit: vitest_1.vi.fn() };
        (0, logger_js_1.logInfo)("info", runtime);
        (0, logger_js_1.logWarn)("warn", runtime);
        (0, logger_js_1.logSuccess)("ok", runtime);
        (0, logger_js_1.logError)("bad", runtime);
        (0, vitest_1.expect)(log).toHaveBeenCalledTimes(3);
        (0, vitest_1.expect)(error).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)("only logs debug when verbose is enabled", function () {
        var logVerbose = vitest_1.vi.spyOn(console, "log");
        (0, globals_js_1.setVerbose)(false);
        (0, logger_js_1.logDebug)("quiet");
        (0, vitest_1.expect)(logVerbose).not.toHaveBeenCalled();
        (0, globals_js_1.setVerbose)(true);
        logVerbose.mockClear();
        (0, logger_js_1.logDebug)("loud");
        (0, vitest_1.expect)(logVerbose).toHaveBeenCalled();
        logVerbose.mockRestore();
    });
    (0, vitest_1.it)("writes to configured log file at configured level", function () {
        var logPath = pathForTest();
        cleanup(logPath);
        (0, logging_js_1.setLoggerOverride)({ level: "info", file: logPath });
        node_fs_1.default.writeFileSync(logPath, "");
        (0, logger_js_1.logInfo)("hello");
        (0, logger_js_1.logDebug)("debug-only"); // may be filtered depending on level mapping
        var content = node_fs_1.default.readFileSync(logPath, "utf-8");
        (0, vitest_1.expect)(content.length).toBeGreaterThan(0);
        cleanup(logPath);
    });
    (0, vitest_1.it)("filters messages below configured level", function () {
        var logPath = pathForTest();
        cleanup(logPath);
        (0, logging_js_1.setLoggerOverride)({ level: "warn", file: logPath });
        (0, logger_js_1.logInfo)("info-only");
        (0, logger_js_1.logWarn)("warn-only");
        var content = node_fs_1.default.readFileSync(logPath, "utf-8");
        (0, vitest_1.expect)(content).toContain("warn-only");
        cleanup(logPath);
    });
    (0, vitest_1.it)("uses daily rolling default log file and prunes old ones", function () {
        (0, logging_js_1.resetLogger)();
        (0, logging_js_1.setLoggerOverride)({}); // force defaults regardless of user config
        var today = localDateString(new Date());
        var todayPath = node_path_1.default.join(logging_js_1.DEFAULT_LOG_DIR, "openclaw-".concat(today, ".log"));
        // create an old file to be pruned
        var oldPath = node_path_1.default.join(logging_js_1.DEFAULT_LOG_DIR, "openclaw-2000-01-01.log");
        node_fs_1.default.mkdirSync(logging_js_1.DEFAULT_LOG_DIR, { recursive: true });
        node_fs_1.default.writeFileSync(oldPath, "old");
        node_fs_1.default.utimesSync(oldPath, new Date(0), new Date(0));
        cleanup(todayPath);
        (0, logger_js_1.logInfo)("roll-me");
        (0, vitest_1.expect)(node_fs_1.default.existsSync(todayPath)).toBe(true);
        (0, vitest_1.expect)(node_fs_1.default.readFileSync(todayPath, "utf-8")).toContain("roll-me");
        (0, vitest_1.expect)(node_fs_1.default.existsSync(oldPath)).toBe(false);
        cleanup(todayPath);
    });
});
function pathForTest() {
    var file = node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-log-".concat(node_crypto_1.default.randomUUID(), ".log"));
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(file), { recursive: true });
    return file;
}
function cleanup(file) {
    try {
        node_fs_1.default.rmSync(file, { force: true });
    }
    catch (_a) {
        // ignore
    }
}
function localDateString(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return "".concat(year, "-").concat(month, "-").concat(day);
}
