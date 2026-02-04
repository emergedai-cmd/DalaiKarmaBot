"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachChildProcessBridge = attachChildProcessBridge;
var node_process_1 = require("node:process");
var defaultSignals = node_process_1.default.platform === "win32"
    ? ["SIGTERM", "SIGINT", "SIGBREAK"]
    : ["SIGTERM", "SIGINT", "SIGHUP", "SIGQUIT"];
function attachChildProcessBridge(child, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.signals, signals = _c === void 0 ? defaultSignals : _c, onSignal = _b.onSignal;
    var listeners = new Map();
    var _loop_1 = function (signal) {
        var listener = function () {
            onSignal === null || onSignal === void 0 ? void 0 : onSignal(signal);
            try {
                child.kill(signal);
            }
            catch (_a) {
                // ignore
            }
        };
        try {
            node_process_1.default.on(signal, listener);
            listeners.set(signal, listener);
        }
        catch (_d) {
            // Unsupported signal on this platform.
        }
    };
    for (var _i = 0, signals_1 = signals; _i < signals_1.length; _i++) {
        var signal = signals_1[_i];
        _loop_1(signal);
    }
    var detach = function () {
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var _a = listeners_1[_i], signal = _a[0], listener = _a[1];
            node_process_1.default.off(signal, listener);
        }
        listeners.clear();
    };
    child.once("exit", detach);
    child.once("error", detach);
    return { detach: detach };
}
