"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var paths_js_1 = require("../config/paths.js");
var gateway_lock_js_1 = require("./gateway-lock.js");
function makeEnv() {
    return __awaiter(this, void 0, void 0, function () {
        var dir, configPath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-gateway-lock-"))];
                case 1:
                    dir = _a.sent();
                    configPath = node_path_1.default.join(dir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, "{}", "utf8")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.mkdir((0, paths_js_1.resolveGatewayLockDir)(), { recursive: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {
                            env: __assign(__assign({}, process.env), { OPENCLAW_STATE_DIR: dir, OPENCLAW_CONFIG_PATH: configPath }),
                            cleanup: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
function resolveLockPath(env) {
    var stateDir = (0, paths_js_1.resolveStateDir)(env);
    var configPath = (0, paths_js_1.resolveConfigPath)(env, stateDir);
    var hash = (0, node_crypto_1.createHash)("sha1").update(configPath).digest("hex").slice(0, 8);
    var lockDir = (0, paths_js_1.resolveGatewayLockDir)();
    return { lockPath: node_path_1.default.join(lockDir, "gateway.".concat(hash, ".lock")), configPath: configPath };
}
function makeProcStat(pid, startTime) {
    var fields = [
        "R",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        String(startTime),
        "1",
        "1",
    ];
    return "".concat(pid, " (node) ").concat(fields.join(" "));
}
(0, vitest_1.describe)("gateway lock", function () {
    (0, vitest_1.it)("blocks concurrent acquisition until release", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, env, cleanup, lock, lock2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeEnv()];
                case 1:
                    _a = _b.sent(), env = _a.env, cleanup = _a.cleanup;
                    return [4 /*yield*/, (0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 200,
                            pollIntervalMs: 20,
                        })];
                case 2:
                    lock = _b.sent();
                    (0, vitest_1.expect)(lock).not.toBeNull();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 200,
                            pollIntervalMs: 20,
                        })).rejects.toBeInstanceOf(gateway_lock_js_1.GatewayLockError)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (lock === null || lock === void 0 ? void 0 : lock.release())];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 200,
                            pollIntervalMs: 20,
                        })];
                case 5:
                    lock2 = _b.sent();
                    return [4 /*yield*/, (lock2 === null || lock2 === void 0 ? void 0 : lock2.release())];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, cleanup()];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats recycled linux pid as stale when start time mismatches", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, env, cleanup, _b, lockPath, configPath, payload, readFileSync, statValue, spy, lock;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, makeEnv()];
                case 1:
                    _a = _c.sent(), env = _a.env, cleanup = _a.cleanup;
                    _b = resolveLockPath(env), lockPath = _b.lockPath, configPath = _b.configPath;
                    payload = {
                        pid: process.pid,
                        createdAt: new Date().toISOString(),
                        configPath: configPath,
                        startTime: 111,
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(lockPath, JSON.stringify(payload), "utf8")];
                case 2:
                    _c.sent();
                    readFileSync = node_fs_1.default.readFileSync;
                    statValue = makeProcStat(process.pid, 222);
                    spy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (filePath, encoding) {
                        if (filePath === "/proc/".concat(process.pid, "/stat")) {
                            return statValue;
                        }
                        return readFileSync(filePath, encoding);
                    });
                    return [4 /*yield*/, (0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 200,
                            pollIntervalMs: 20,
                            platform: "linux",
                        })];
                case 3:
                    lock = _c.sent();
                    (0, vitest_1.expect)(lock).not.toBeNull();
                    return [4 /*yield*/, (lock === null || lock === void 0 ? void 0 : lock.release())];
                case 4:
                    _c.sent();
                    spy.mockRestore();
                    return [4 /*yield*/, cleanup()];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps lock on linux when proc access fails unless stale", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, env, cleanup, _b, lockPath, configPath, payload, readFileSync, spy, stalePayload, staleSpy, lock;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, makeEnv()];
                case 1:
                    _a = _c.sent(), env = _a.env, cleanup = _a.cleanup;
                    _b = resolveLockPath(env), lockPath = _b.lockPath, configPath = _b.configPath;
                    payload = {
                        pid: process.pid,
                        createdAt: new Date().toISOString(),
                        configPath: configPath,
                        startTime: 111,
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(lockPath, JSON.stringify(payload), "utf8")];
                case 2:
                    _c.sent();
                    readFileSync = node_fs_1.default.readFileSync;
                    spy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (filePath, encoding) {
                        if (filePath === "/proc/".concat(process.pid, "/stat")) {
                            throw new Error("EACCES");
                        }
                        return readFileSync(filePath, encoding);
                    });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 120,
                            pollIntervalMs: 20,
                            staleMs: 10000,
                            platform: "linux",
                        })).rejects.toBeInstanceOf(gateway_lock_js_1.GatewayLockError)];
                case 3:
                    _c.sent();
                    spy.mockRestore();
                    stalePayload = __assign(__assign({}, payload), { createdAt: new Date(0).toISOString() });
                    return [4 /*yield*/, promises_1.default.writeFile(lockPath, JSON.stringify(stalePayload), "utf8")];
                case 4:
                    _c.sent();
                    staleSpy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync").mockImplementation(function (filePath, encoding) {
                        if (filePath === "/proc/".concat(process.pid, "/stat")) {
                            throw new Error("EACCES");
                        }
                        return readFileSync(filePath, encoding);
                    });
                    return [4 /*yield*/, (0, gateway_lock_js_1.acquireGatewayLock)({
                            env: env,
                            allowInTests: true,
                            timeoutMs: 200,
                            pollIntervalMs: 20,
                            staleMs: 1,
                            platform: "linux",
                        })];
                case 5:
                    lock = _c.sent();
                    (0, vitest_1.expect)(lock).not.toBeNull();
                    return [4 /*yield*/, (lock === null || lock === void 0 ? void 0 : lock.release())];
                case 6:
                    _c.sent();
                    staleSpy.mockRestore();
                    return [4 /*yield*/, cleanup()];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
