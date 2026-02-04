"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_process_1 = require("node:process");
var vitest_1 = require("vitest");
var unhandled_rejections_js_1 = require("./unhandled-rejections.js");
(0, vitest_1.describe)("installUnhandledRejectionHandler - fatal detection", function () {
    var exitCalls = [];
    var consoleErrorSpy;
    var consoleWarnSpy;
    var originalExit;
    (0, vitest_1.beforeAll)(function () {
        originalExit = node_process_1.default.exit.bind(node_process_1.default);
        (0, unhandled_rejections_js_1.installUnhandledRejectionHandler)();
    });
    (0, vitest_1.beforeEach)(function () {
        exitCalls = [];
        vitest_1.vi.spyOn(node_process_1.default, "exit").mockImplementation(function (code) {
            if (code !== undefined && code !== null) {
                exitCalls.push(code);
            }
        });
        consoleErrorSpy = vitest_1.vi.spyOn(console, "error").mockImplementation(function () { });
        consoleWarnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { });
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });
    (0, vitest_1.afterAll)(function () {
        node_process_1.default.exit = originalExit;
    });
    (0, vitest_1.describe)("fatal errors", function () {
        (0, vitest_1.it)("exits on ERR_OUT_OF_MEMORY", function () {
            var oomErr = Object.assign(new Error("Out of memory"), {
                code: "ERR_OUT_OF_MEMORY",
            });
            node_process_1.default.emit("unhandledRejection", oomErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
            (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith("[openclaw] FATAL unhandled rejection:", vitest_1.expect.stringContaining("Out of memory"));
        });
        (0, vitest_1.it)("exits on ERR_SCRIPT_EXECUTION_TIMEOUT", function () {
            var timeoutErr = Object.assign(new Error("Script execution timeout"), {
                code: "ERR_SCRIPT_EXECUTION_TIMEOUT",
            });
            node_process_1.default.emit("unhandledRejection", timeoutErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
        });
        (0, vitest_1.it)("exits on ERR_WORKER_OUT_OF_MEMORY", function () {
            var workerOomErr = Object.assign(new Error("Worker out of memory"), {
                code: "ERR_WORKER_OUT_OF_MEMORY",
            });
            node_process_1.default.emit("unhandledRejection", workerOomErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
        });
    });
    (0, vitest_1.describe)("configuration errors", function () {
        (0, vitest_1.it)("exits on INVALID_CONFIG", function () {
            var configErr = Object.assign(new Error("Invalid config"), {
                code: "INVALID_CONFIG",
            });
            node_process_1.default.emit("unhandledRejection", configErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
            (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith("[openclaw] CONFIGURATION ERROR - requires fix:", vitest_1.expect.stringContaining("Invalid config"));
        });
        (0, vitest_1.it)("exits on MISSING_API_KEY", function () {
            var missingKeyErr = Object.assign(new Error("Missing API key"), {
                code: "MISSING_API_KEY",
            });
            node_process_1.default.emit("unhandledRejection", missingKeyErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
        });
    });
    (0, vitest_1.describe)("non-fatal errors", function () {
        (0, vitest_1.it)("does NOT exit on undici fetch failures", function () {
            var fetchErr = Object.assign(new TypeError("fetch failed"), {
                cause: { code: "UND_ERR_CONNECT_TIMEOUT", syscall: "connect" },
            });
            node_process_1.default.emit("unhandledRejection", fetchErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([]);
            (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalledWith("[openclaw] Non-fatal unhandled rejection (continuing):", vitest_1.expect.stringContaining("fetch failed"));
        });
        (0, vitest_1.it)("does NOT exit on DNS resolution failures", function () {
            var dnsErr = Object.assign(new Error("DNS resolve failed"), {
                code: "UND_ERR_DNS_RESOLVE_FAILED",
            });
            node_process_1.default.emit("unhandledRejection", dnsErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([]);
            (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalled();
        });
        (0, vitest_1.it)("exits on generic errors without code", function () {
            var genericErr = new Error("Something went wrong");
            node_process_1.default.emit("unhandledRejection", genericErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([1]);
            (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith("[openclaw] Unhandled promise rejection:", vitest_1.expect.stringContaining("Something went wrong"));
        });
        (0, vitest_1.it)("does NOT exit on connection reset errors", function () {
            var connResetErr = Object.assign(new Error("Connection reset"), {
                code: "ECONNRESET",
            });
            node_process_1.default.emit("unhandledRejection", connResetErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([]);
            (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalled();
        });
        (0, vitest_1.it)("does NOT exit on timeout errors", function () {
            var timeoutErr = Object.assign(new Error("Timeout"), {
                code: "ETIMEDOUT",
            });
            node_process_1.default.emit("unhandledRejection", timeoutErr, Promise.resolve());
            (0, vitest_1.expect)(exitCalls).toEqual([]);
            (0, vitest_1.expect)(consoleWarnSpy).toHaveBeenCalled();
        });
    });
});
