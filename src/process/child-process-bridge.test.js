"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_net_1 = require("node:net");
var node_path_1 = require("node:path");
var node_process_1 = require("node:process");
var vitest_1 = require("vitest");
var child_process_bridge_js_1 = require("./child-process-bridge.js");
function waitForLine(stream, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 10000; }
    return new Promise(function (resolve, reject) {
        var buffer = "";
        var timeout = setTimeout(function () {
            cleanup();
            reject(new Error("timeout waiting for line"));
        }, timeoutMs);
        var onData = function (chunk) {
            buffer += chunk.toString();
            var idx = buffer.indexOf("\n");
            if (idx >= 0) {
                var line = buffer.slice(0, idx).trim();
                cleanup();
                resolve(line);
            }
        };
        var onError = function (err) {
            cleanup();
            reject(err);
        };
        var cleanup = function () {
            clearTimeout(timeout);
            stream.off("data", onData);
            stream.off("error", onError);
        };
        stream.on("data", onData);
        stream.on("error", onError);
    });
}
function canConnect(port) {
    return new Promise(function (resolve) {
        var socket = node_net_1.default.createConnection({ host: "127.0.0.1", port: port });
        socket.once("connect", function () {
            socket.end();
            resolve(true);
        });
        socket.once("error", function () { return resolve(false); });
    });
}
(0, vitest_1.describe)("attachChildProcessBridge", function () {
    var children = [];
    var detachments = [];
    (0, vitest_1.afterEach)(function () {
        for (var _i = 0, detachments_1 = detachments; _i < detachments_1.length; _i++) {
            var detach = detachments_1[_i];
            try {
                detach();
            }
            catch (_a) {
                // ignore
            }
        }
        detachments.length = 0;
        for (var _b = 0, children_1 = children; _b < children_1.length; _b++) {
            var child = children_1[_b];
            try {
                child.kill("SIGKILL");
            }
            catch (_c) {
                // ignore
            }
        }
        children.length = 0;
    });
    (0, vitest_1.it)("forwards SIGTERM to the wrapped child", function () { return __awaiter(void 0, void 0, void 0, function () {
        var childPath, beforeSigterm, child, detach, afterSigterm, addedSigterm, portLine, port, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    childPath = node_path_1.default.resolve(node_process_1.default.cwd(), "test/fixtures/child-process-bridge/child.js");
                    beforeSigterm = new Set(node_process_1.default.listeners("SIGTERM"));
                    child = (0, node_child_process_1.spawn)(node_process_1.default.execPath, [childPath], {
                        stdio: ["ignore", "pipe", "inherit"],
                        env: node_process_1.default.env,
                    });
                    detach = (0, child_process_bridge_js_1.attachChildProcessBridge)(child).detach;
                    detachments.push(detach);
                    children.push(child);
                    afterSigterm = node_process_1.default.listeners("SIGTERM");
                    addedSigterm = afterSigterm.find(function (listener) { return !beforeSigterm.has(listener); });
                    if (!child.stdout) {
                        throw new Error("expected stdout");
                    }
                    return [4 /*yield*/, waitForLine(child.stdout)];
                case 1:
                    portLine = _c.sent();
                    port = Number(portLine);
                    (0, vitest_1.expect)(Number.isFinite(port)).toBe(true);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, canConnect(port)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe(true);
                    // Simulate systemd sending SIGTERM to the parent process.
                    if (!addedSigterm) {
                        throw new Error("expected SIGTERM listener");
                    }
                    addedSigterm();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var timeout = setTimeout(function () { return reject(new Error("timeout waiting for child exit")); }, 10000);
                            child.once("exit", function () {
                                clearTimeout(timeout);
                                resolve();
                            });
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 250); })];
                case 4:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, canConnect(port)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
});
