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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var session_write_lock_js_1 = require("./session-write-lock.js");
(0, vitest_1.describe)("acquireSessionWriteLock", function () {
    (0, vitest_1.it)("reuses locks across symlinked session paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, realDir, linkDir, sessionReal, sessionLink, lockA, lockB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.platform === "win32") {
                        (0, vitest_1.expect)(true).toBe(true);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 9, 11]);
                    realDir = node_path_1.default.join(root, "real");
                    linkDir = node_path_1.default.join(root, "link");
                    return [4 /*yield*/, promises_1.default.mkdir(realDir, { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.symlink(realDir, linkDir)];
                case 4:
                    _a.sent();
                    sessionReal = node_path_1.default.join(realDir, "sessions.json");
                    sessionLink = node_path_1.default.join(linkDir, "sessions.json");
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionReal, timeoutMs: 500 })];
                case 5:
                    lockA = _a.sent();
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionLink, timeoutMs: 500 })];
                case 6:
                    lockB = _a.sent();
                    return [4 /*yield*/, lockB.release()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, lockA.release()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps the lock file until the last release", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionFile, lockPath, lockA, lockB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 10, 12]);
                    sessionFile = node_path_1.default.join(root, "sessions.json");
                    lockPath = "".concat(sessionFile, ".lock");
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500 })];
                case 3:
                    lockA = _a.sent();
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500 })];
                case 4:
                    lockB = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(lockPath)).resolves.toBeUndefined()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, lockA.release()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(lockPath)).resolves.toBeUndefined()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, lockB.release()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(lockPath)).rejects.toThrow()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reclaims stale lock files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionFile, lockPath, lock, raw, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 7, 9]);
                    sessionFile = node_path_1.default.join(root, "sessions.json");
                    lockPath = "".concat(sessionFile, ".lock");
                    return [4 /*yield*/, promises_1.default.writeFile(lockPath, JSON.stringify({ pid: 123456, createdAt: new Date(Date.now() - 60000).toISOString() }), "utf8")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500, staleMs: 10 })];
                case 4:
                    lock = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(lockPath, "utf8")];
                case 5:
                    raw = _a.sent();
                    payload = JSON.parse(raw);
                    (0, vitest_1.expect)(payload.pid).toBe(process.pid);
                    return [4 /*yield*/, lock.release()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("removes held locks on termination signals", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signals, _i, signals_1, signal, root, sessionFile, lockPath, keepAlive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signals = ["SIGINT", "SIGTERM", "SIGQUIT", "SIGABRT"];
                    _i = 0, signals_1 = signals;
                    _a.label = 1;
                case 1:
                    if (!(_i < signals_1.length)) return [3 /*break*/, 9];
                    signal = signals_1[_i];
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-cleanup-"))];
                case 2:
                    root = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 8]);
                    sessionFile = node_path_1.default.join(root, "sessions.json");
                    lockPath = "".concat(sessionFile, ".lock");
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500 })];
                case 4:
                    _a.sent();
                    keepAlive = function () { };
                    if (signal === "SIGINT") {
                        process.on(signal, keepAlive);
                    }
                    session_write_lock_js_1.__testing.handleTerminationSignal(signal);
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(lockPath)).rejects.toThrow()];
                case 5:
                    _a.sent();
                    if (signal === "SIGINT") {
                        process.off(signal, keepAlive);
                    }
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registers cleanup for SIGQUIT and SIGABRT", function () {
        (0, vitest_1.expect)(session_write_lock_js_1.__testing.cleanupSignals).toContain("SIGQUIT");
        (0, vitest_1.expect)(session_write_lock_js_1.__testing.cleanupSignals).toContain("SIGABRT");
    });
    (0, vitest_1.it)("cleans up locks on SIGINT without removing other handlers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, originalKill, killCalls, otherHandlerCalled, otherHandler, sessionFile, lockPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-"))];
                case 1:
                    root = _a.sent();
                    originalKill = process.kill.bind(process);
                    killCalls = [];
                    otherHandlerCalled = false;
                    process.kill = (function (pid, signal) {
                        killCalls.push(signal);
                        return true;
                    });
                    otherHandler = function () {
                        otherHandlerCalled = true;
                    };
                    process.on("SIGINT", otherHandler);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 5, 7]);
                    sessionFile = node_path_1.default.join(root, "sessions.json");
                    lockPath = "".concat(sessionFile, ".lock");
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500 })];
                case 3:
                    _a.sent();
                    process.emit("SIGINT");
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(lockPath)).rejects.toThrow()];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(otherHandlerCalled).toBe(true);
                    (0, vitest_1.expect)(killCalls).toEqual([]);
                    return [3 /*break*/, 7];
                case 5:
                    process.off("SIGINT", otherHandler);
                    process.kill = originalKill;
                    return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("cleans up locks on exit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, sessionFile, lockPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-lock-"))];
                case 1:
                    root = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 5, 7]);
                    sessionFile = node_path_1.default.join(root, "sessions.json");
                    lockPath = "".concat(sessionFile, ".lock");
                    return [4 /*yield*/, (0, session_write_lock_js_1.acquireSessionWriteLock)({ sessionFile: sessionFile, timeoutMs: 500 })];
                case 3:
                    _a.sent();
                    process.emit("exit", 0);
                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.access(lockPath)).rejects.toThrow()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, promises_1.default.rm(root, { recursive: true, force: true })];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps other signal listeners registered", function () {
        var keepAlive = function () { };
        process.on("SIGINT", keepAlive);
        session_write_lock_js_1.__testing.handleTerminationSignal("SIGINT");
        (0, vitest_1.expect)(process.listeners("SIGINT")).toContain(keepAlive);
        process.off("SIGINT", keepAlive);
    });
});
