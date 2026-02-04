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
var nostr_state_store_js_1 = require("./nostr-state-store.js");
var runtime_js_1 = require("./runtime.js");
function withTempStateDir(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var previous, dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    previous = process.env.OPENCLAW_STATE_DIR;
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-nostr-"))];
                case 1:
                    dir = _a.sent();
                    process.env.OPENCLAW_STATE_DIR = dir;
                    (0, runtime_js_1.setNostrRuntime)({
                        state: {
                            resolveStateDir: function (env, homedir) {
                                var _a, _b;
                                var override = ((_a = env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = env.OPENCLAW_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim());
                                if (override) {
                                    return override;
                                }
                                return node_path_1.default.join(homedir(), ".openclaw");
                            },
                        },
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, fn(dir)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (previous === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = previous;
                    }
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("nostr bus state store", function () {
    (0, vitest_1.it)("persists and reloads state across restarts", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, state;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    // Fresh start - no state
                                    _a = vitest_1.expect;
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrBusState)({ accountId: "test-bot" })];
                                case 1:
                                    // Fresh start - no state
                                    _a.apply(void 0, [_b.sent()]).toBeNull();
                                    // Write state
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.writeNostrBusState)({
                                            accountId: "test-bot",
                                            lastProcessedAt: 1700000000,
                                            gatewayStartedAt: 1700000100,
                                        })];
                                case 2:
                                    // Write state
                                    _b.sent();
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrBusState)({ accountId: "test-bot" })];
                                case 3:
                                    state = _b.sent();
                                    (0, vitest_1.expect)(state).toEqual({
                                        version: 2,
                                        lastProcessedAt: 1700000000,
                                        gatewayStartedAt: 1700000100,
                                        recentEventIds: [],
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("isolates state by accountId", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempStateDir(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var stateA, stateB;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, nostr_state_store_js_1.writeNostrBusState)({
                                        accountId: "bot-a",
                                        lastProcessedAt: 1000,
                                        gatewayStartedAt: 1000,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.writeNostrBusState)({
                                            accountId: "bot-b",
                                            lastProcessedAt: 2000,
                                            gatewayStartedAt: 2000,
                                        })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrBusState)({ accountId: "bot-a" })];
                                case 3:
                                    stateA = _a.sent();
                                    return [4 /*yield*/, (0, nostr_state_store_js_1.readNostrBusState)({ accountId: "bot-b" })];
                                case 4:
                                    stateB = _a.sent();
                                    (0, vitest_1.expect)(stateA === null || stateA === void 0 ? void 0 : stateA.lastProcessedAt).toBe(1000);
                                    (0, vitest_1.expect)(stateB === null || stateB === void 0 ? void 0 : stateB.lastProcessedAt).toBe(2000);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("computeSinceTimestamp", function () {
    (0, vitest_1.it)("returns now for null state (fresh start)", function () {
        var now = 1700000000;
        (0, vitest_1.expect)((0, nostr_state_store_js_1.computeSinceTimestamp)(null, now)).toBe(now);
    });
    (0, vitest_1.it)("uses lastProcessedAt when available", function () {
        var state = {
            version: 2,
            lastProcessedAt: 1699999000,
            gatewayStartedAt: null,
            recentEventIds: [],
        };
        (0, vitest_1.expect)((0, nostr_state_store_js_1.computeSinceTimestamp)(state, 1700000000)).toBe(1699999000);
    });
    (0, vitest_1.it)("uses gatewayStartedAt when lastProcessedAt is null", function () {
        var state = {
            version: 2,
            lastProcessedAt: null,
            gatewayStartedAt: 1699998000,
            recentEventIds: [],
        };
        (0, vitest_1.expect)((0, nostr_state_store_js_1.computeSinceTimestamp)(state, 1700000000)).toBe(1699998000);
    });
    (0, vitest_1.it)("uses the max of both timestamps", function () {
        var state = {
            version: 2,
            lastProcessedAt: 1699999000,
            gatewayStartedAt: 1699998000,
            recentEventIds: [],
        };
        (0, vitest_1.expect)((0, nostr_state_store_js_1.computeSinceTimestamp)(state, 1700000000)).toBe(1699999000);
    });
    (0, vitest_1.it)("falls back to now if both are null", function () {
        var state = {
            version: 2,
            lastProcessedAt: null,
            gatewayStartedAt: null,
            recentEventIds: [],
        };
        (0, vitest_1.expect)((0, nostr_state_store_js_1.computeSinceTimestamp)(state, 1700000000)).toBe(1700000000);
    });
});
