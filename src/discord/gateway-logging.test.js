"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_events_1 = require("node:events");
var vitest_1 = require("vitest");
vitest_1.vi.mock("../globals.js", function () { return ({
    logVerbose: vitest_1.vi.fn(),
}); });
var globals_js_1 = require("../globals.js");
var gateway_logging_js_1 = require("./gateway-logging.js");
var makeRuntime = function () { return ({
    log: vitest_1.vi.fn(),
}); };
(0, vitest_1.describe)("attachDiscordGatewayLogging", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("logs debug events and promotes reconnect/close to info", function () {
        var emitter = new node_events_1.EventEmitter();
        var runtime = makeRuntime();
        var cleanup = (0, gateway_logging_js_1.attachDiscordGatewayLogging)({
            emitter: emitter,
            runtime: runtime,
        });
        emitter.emit("debug", "WebSocket connection opened");
        emitter.emit("debug", "WebSocket connection closed with code 1001");
        emitter.emit("debug", "Reconnecting with backoff: 1000ms after code 1001");
        var logVerboseMock = vitest_1.vi.mocked(globals_js_1.logVerbose);
        (0, vitest_1.expect)(logVerboseMock).toHaveBeenCalledTimes(3);
        (0, vitest_1.expect)(runtime.log).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(runtime.log).toHaveBeenNthCalledWith(1, "discord gateway: WebSocket connection closed with code 1001");
        (0, vitest_1.expect)(runtime.log).toHaveBeenNthCalledWith(2, "discord gateway: Reconnecting with backoff: 1000ms after code 1001");
        cleanup();
    });
    (0, vitest_1.it)("logs warnings and metrics only to verbose", function () {
        var emitter = new node_events_1.EventEmitter();
        var runtime = makeRuntime();
        var cleanup = (0, gateway_logging_js_1.attachDiscordGatewayLogging)({
            emitter: emitter,
            runtime: runtime,
        });
        emitter.emit("warning", "High latency detected: 1200ms");
        emitter.emit("metrics", { latency: 42, errors: 1 });
        var logVerboseMock = vitest_1.vi.mocked(globals_js_1.logVerbose);
        (0, vitest_1.expect)(logVerboseMock).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(runtime.log).not.toHaveBeenCalled();
        cleanup();
    });
    (0, vitest_1.it)("removes listeners on cleanup", function () {
        var emitter = new node_events_1.EventEmitter();
        var runtime = makeRuntime();
        var cleanup = (0, gateway_logging_js_1.attachDiscordGatewayLogging)({
            emitter: emitter,
            runtime: runtime,
        });
        cleanup();
        var logVerboseMock = vitest_1.vi.mocked(globals_js_1.logVerbose);
        logVerboseMock.mockClear();
        emitter.emit("debug", "WebSocket connection closed with code 1001");
        emitter.emit("warning", "High latency detected: 1200ms");
        emitter.emit("metrics", { latency: 42 });
        (0, vitest_1.expect)(logVerboseMock).not.toHaveBeenCalled();
        (0, vitest_1.expect)(runtime.log).not.toHaveBeenCalled();
    });
});
