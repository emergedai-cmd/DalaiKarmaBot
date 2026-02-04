"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.GatewayLockError = void 0;
exports.acquireGatewayLock = acquireGatewayLock;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var DEFAULT_TIMEOUT_MS = 5000;
var DEFAULT_POLL_INTERVAL_MS = 100;
var DEFAULT_STALE_MS = 30000;
var GatewayLockError = /** @class */ (function (_super) {
    __extends(GatewayLockError, _super);
    function GatewayLockError(message, cause) {
        var _this = _super.call(this, message) || this;
        _this.cause = cause;
        _this.name = "GatewayLockError";
        return _this;
    }
    return GatewayLockError;
}(Error));
exports.GatewayLockError = GatewayLockError;
function isAlive(pid) {
    if (!Number.isFinite(pid) || pid <= 0) {
        return false;
    }
    try {
        process.kill(pid, 0);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function normalizeProcArg(arg) {
    return arg.replaceAll("\\", "/").toLowerCase();
}
function parseProcCmdline(raw) {
    return raw
        .split("\0")
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function isGatewayArgv(args) {
    var _a;
    var normalized = args.map(normalizeProcArg);
    if (!normalized.includes("gateway")) {
        return false;
    }
    var entryCandidates = [
        "dist/index.js",
        "dist/entry.js",
        "openclaw.mjs",
        "scripts/run-node.mjs",
        "src/index.ts",
    ];
    if (normalized.some(function (arg) { return entryCandidates.some(function (entry) { return arg.endsWith(entry); }); })) {
        return true;
    }
    var exe = (_a = normalized[0]) !== null && _a !== void 0 ? _a : "";
    return exe.endsWith("/openclaw") || exe === "openclaw";
}
function readLinuxCmdline(pid) {
    try {
        var raw = node_fs_1.default.readFileSync("/proc/".concat(pid, "/cmdline"), "utf8");
        return parseProcCmdline(raw);
    }
    catch (_a) {
        return null;
    }
}
function readLinuxStartTime(pid) {
    var _a;
    try {
        var raw = node_fs_1.default.readFileSync("/proc/".concat(pid, "/stat"), "utf8").trim();
        var closeParen = raw.lastIndexOf(")");
        if (closeParen < 0) {
            return null;
        }
        var rest = raw.slice(closeParen + 1).trim();
        var fields = rest.split(/\s+/);
        var startTime = Number.parseInt((_a = fields[19]) !== null && _a !== void 0 ? _a : "", 10);
        return Number.isFinite(startTime) ? startTime : null;
    }
    catch (_b) {
        return null;
    }
}
function resolveGatewayOwnerStatus(pid, payload, platform) {
    if (!isAlive(pid)) {
        return "dead";
    }
    if (platform !== "linux") {
        return "alive";
    }
    var payloadStartTime = payload === null || payload === void 0 ? void 0 : payload.startTime;
    if (Number.isFinite(payloadStartTime)) {
        var currentStartTime = readLinuxStartTime(pid);
        if (currentStartTime == null) {
            return "unknown";
        }
        return currentStartTime === payloadStartTime ? "alive" : "dead";
    }
    var args = readLinuxCmdline(pid);
    if (!args) {
        return "unknown";
    }
    return isGatewayArgv(args) ? "alive" : "dead";
}
function readLockPayload(lockPath) {
    return __awaiter(this, void 0, void 0, function () {
        var raw, parsed, startTime, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(lockPath, "utf8")];
                case 1:
                    raw = _b.sent();
                    parsed = JSON.parse(raw);
                    if (typeof parsed.pid !== "number") {
                        return [2 /*return*/, null];
                    }
                    if (typeof parsed.createdAt !== "string") {
                        return [2 /*return*/, null];
                    }
                    if (typeof parsed.configPath !== "string") {
                        return [2 /*return*/, null];
                    }
                    startTime = typeof parsed.startTime === "number" ? parsed.startTime : undefined;
                    return [2 /*return*/, {
                            pid: parsed.pid,
                            createdAt: parsed.createdAt,
                            configPath: parsed.configPath,
                            startTime: startTime,
                        }];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveGatewayLockPath(env) {
    var stateDir = (0, paths_js_1.resolveStateDir)(env);
    var configPath = (0, paths_js_1.resolveConfigPath)(env, stateDir);
    var hash = (0, node_crypto_1.createHash)("sha1").update(configPath).digest("hex").slice(0, 8);
    var lockDir = (0, paths_js_1.resolveGatewayLockDir)();
    var lockPath = node_path_1.default.join(lockDir, "gateway.".concat(hash, ".lock"));
    return { lockPath: lockPath, configPath: configPath };
}
function acquireGatewayLock() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var env, allowInTests, timeoutMs, pollIntervalMs, staleMs, platform, _a, lockPath, configPath, startedAt, lastPayload, _loop_1, state_1, owner;
        var _this = this;
        var _b, _c, _d, _e, _f;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    env = (_b = opts.env) !== null && _b !== void 0 ? _b : process.env;
                    allowInTests = opts.allowInTests === true;
                    if (env.OPENCLAW_ALLOW_MULTI_GATEWAY === "1" ||
                        (!allowInTests && (env.VITEST || env.NODE_ENV === "test"))) {
                        return [2 /*return*/, null];
                    }
                    timeoutMs = (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : DEFAULT_TIMEOUT_MS;
                    pollIntervalMs = (_d = opts.pollIntervalMs) !== null && _d !== void 0 ? _d : DEFAULT_POLL_INTERVAL_MS;
                    staleMs = (_e = opts.staleMs) !== null && _e !== void 0 ? _e : DEFAULT_STALE_MS;
                    platform = (_f = opts.platform) !== null && _f !== void 0 ? _f : process.platform;
                    _a = resolveGatewayLockPath(env), lockPath = _a.lockPath, configPath = _a.configPath;
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(lockPath), { recursive: true })];
                case 1:
                    _g.sent();
                    startedAt = Date.now();
                    lastPayload = null;
                    _loop_1 = function () {
                        var handle_1, startTime, payload, err_1, code, ownerPid, ownerStatus, stale, createdAt, st, _h;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    _j.trys.push([0, 3, , 14]);
                                    return [4 /*yield*/, promises_1.default.open(lockPath, "wx")];
                                case 1:
                                    handle_1 = _j.sent();
                                    startTime = platform === "linux" ? readLinuxStartTime(process.pid) : null;
                                    payload = {
                                        pid: process.pid,
                                        createdAt: new Date().toISOString(),
                                        configPath: configPath,
                                    };
                                    if (typeof startTime === "number" && Number.isFinite(startTime)) {
                                        payload.startTime = startTime;
                                    }
                                    return [4 /*yield*/, handle_1.writeFile(JSON.stringify(payload), "utf8")];
                                case 2:
                                    _j.sent();
                                    return [2 /*return*/, { value: {
                                                lockPath: lockPath,
                                                configPath: configPath,
                                                release: function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, handle_1.close().catch(function () { return undefined; })];
                                                            case 1:
                                                                _a.sent();
                                                                return [4 /*yield*/, promises_1.default.rm(lockPath, { force: true })];
                                                            case 2:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); },
                                            } }];
                                case 3:
                                    err_1 = _j.sent();
                                    code = err_1.code;
                                    if (code !== "EEXIST") {
                                        throw new GatewayLockError("failed to acquire gateway lock at ".concat(lockPath), err_1);
                                    }
                                    return [4 /*yield*/, readLockPayload(lockPath)];
                                case 4:
                                    lastPayload = _j.sent();
                                    ownerPid = lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.pid;
                                    ownerStatus = ownerPid
                                        ? resolveGatewayOwnerStatus(ownerPid, lastPayload, platform)
                                        : "unknown";
                                    if (!(ownerStatus === "dead" && ownerPid)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, promises_1.default.rm(lockPath, { force: true })];
                                case 5:
                                    _j.sent();
                                    return [2 /*return*/, "continue"];
                                case 6:
                                    if (!(ownerStatus !== "alive")) return [3 /*break*/, 12];
                                    stale = false;
                                    if (lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.createdAt) {
                                        createdAt = Date.parse(lastPayload.createdAt);
                                        stale = Number.isFinite(createdAt) ? Date.now() - createdAt > staleMs : false;
                                    }
                                    if (!!stale) return [3 /*break*/, 10];
                                    _j.label = 7;
                                case 7:
                                    _j.trys.push([7, 9, , 10]);
                                    return [4 /*yield*/, promises_1.default.stat(lockPath)];
                                case 8:
                                    st = _j.sent();
                                    stale = Date.now() - st.mtimeMs > staleMs;
                                    return [3 /*break*/, 10];
                                case 9:
                                    _h = _j.sent();
                                    stale = true;
                                    return [3 /*break*/, 10];
                                case 10:
                                    if (!stale) return [3 /*break*/, 12];
                                    return [4 /*yield*/, promises_1.default.rm(lockPath, { force: true })];
                                case 11:
                                    _j.sent();
                                    return [2 /*return*/, "continue"];
                                case 12: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, pollIntervalMs); })];
                                case 13:
                                    _j.sent();
                                    return [3 /*break*/, 14];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _g.label = 2;
                case 2:
                    if (!(Date.now() - startedAt < timeoutMs)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _g.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 2];
                case 4:
                    owner = (lastPayload === null || lastPayload === void 0 ? void 0 : lastPayload.pid) ? " (pid ".concat(lastPayload.pid, ")") : "";
                    throw new GatewayLockError("gateway already running".concat(owner, "; lock timeout after ").concat(timeoutMs, "ms"));
            }
        });
    });
}
