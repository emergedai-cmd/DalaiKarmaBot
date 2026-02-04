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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var sessions_js_1 = require("./sessions.js");
(0, vitest_1.describe)("Session Store Cache", function () {
    var testDir;
    var storePath;
    (0, vitest_1.beforeEach)(function () {
        // Create a temporary directory for test
        testDir = node_path_1.default.join(node_os_1.default.tmpdir(), "session-cache-test-".concat(Date.now()));
        node_fs_1.default.mkdirSync(testDir, { recursive: true });
        storePath = node_path_1.default.join(testDir, "sessions.json");
        // Clear cache before each test
        (0, sessions_js_1.clearSessionStoreCacheForTest)();
        // Reset environment variable
        delete process.env.OPENCLAW_SESSION_CACHE_TTL_MS;
    });
    (0, vitest_1.afterEach)(function () {
        // Clean up test directory
        if (node_fs_1.default.existsSync(testDir)) {
            node_fs_1.default.rmSync(testDir, { recursive: true, force: true });
        }
        (0, sessions_js_1.clearSessionStoreCacheForTest)();
        delete process.env.OPENCLAW_SESSION_CACHE_TTL_MS;
    });
    (0, vitest_1.it)("should load session store from disk on first call", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, loaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            displayName: "Test Session 1",
                        },
                    };
                    // Write test data
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    // Write test data
                    _a.sent();
                    loaded = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded).toEqual(testStore);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should cache session store on first load when file is unchanged", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, readSpy, loaded1, loaded2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            displayName: "Test Session 1",
                        },
                    };
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    _a.sent();
                    readSpy = vitest_1.vi.spyOn(node_fs_1.default, "readFileSync");
                    loaded1 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded1).toEqual(testStore);
                    loaded2 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded2).toEqual(testStore);
                    (0, vitest_1.expect)(readSpy).toHaveBeenCalledTimes(1);
                    readSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should not allow cached session mutations to leak across loads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, loaded1, loaded2;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            cliSessionIds: { openai: "sess-1" },
                            skillsSnapshot: {
                                prompt: "skills",
                                skills: [{ name: "alpha" }],
                            },
                        },
                    };
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    _g.sent();
                    loaded1 = (0, sessions_js_1.loadSessionStore)(storePath);
                    loaded1["session:1"].cliSessionIds = { openai: "mutated" };
                    if ((_b = (_a = loaded1["session:1"].skillsSnapshot) === null || _a === void 0 ? void 0 : _a.skills) === null || _b === void 0 ? void 0 : _b.length) {
                        loaded1["session:1"].skillsSnapshot.skills[0].name = "mutated";
                    }
                    loaded2 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)((_c = loaded2["session:1"].cliSessionIds) === null || _c === void 0 ? void 0 : _c.openai).toBe("sess-1");
                    (0, vitest_1.expect)((_f = (_e = (_d = loaded2["session:1"].skillsSnapshot) === null || _d === void 0 ? void 0 : _d.skills) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.name).toBe("alpha");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should refresh cache when store file changes on disk", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, loaded1, modifiedStore, bump, loaded2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            displayName: "Test Session 1",
                        },
                    };
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    _a.sent();
                    loaded1 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded1).toEqual(testStore);
                    modifiedStore = {
                        "session:99": { sessionId: "id-99", updatedAt: Date.now() },
                    };
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify(modifiedStore, null, 2));
                    bump = new Date(Date.now() + 2000);
                    node_fs_1.default.utimesSync(storePath, bump, bump);
                    loaded2 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded2).toEqual(modifiedStore);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should invalidate cache on write", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, loaded1, updatedStore, loaded2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            displayName: "Test Session 1",
                        },
                    };
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    _a.sent();
                    loaded1 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded1).toEqual(testStore);
                    updatedStore = {
                        "session:1": __assign(__assign({}, testStore["session:1"]), { displayName: "Updated Session 1" }),
                    };
                    // Save - should invalidate cache
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, updatedStore)];
                case 2:
                    // Save - should invalidate cache
                    _a.sent();
                    loaded2 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded2["session:1"].displayName).toBe("Updated Session 1");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should respect OPENCLAW_SESSION_CACHE_TTL_MS=0 to disable cache", function () { return __awaiter(void 0, void 0, void 0, function () {
        var testStore, loaded1, modifiedStore, loaded2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.OPENCLAW_SESSION_CACHE_TTL_MS = "0";
                    (0, sessions_js_1.clearSessionStoreCacheForTest)();
                    testStore = {
                        "session:1": {
                            sessionId: "id-1",
                            updatedAt: Date.now(),
                            displayName: "Test Session 1",
                        },
                    };
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(storePath, testStore)];
                case 1:
                    _a.sent();
                    loaded1 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded1).toEqual(testStore);
                    modifiedStore = {
                        "session:2": {
                            sessionId: "id-2",
                            updatedAt: Date.now(),
                            displayName: "Test Session 2",
                        },
                    };
                    node_fs_1.default.writeFileSync(storePath, JSON.stringify(modifiedStore, null, 2));
                    loaded2 = (0, sessions_js_1.loadSessionStore)(storePath);
                    (0, vitest_1.expect)(loaded2).toEqual(modifiedStore); // Should be modified, not cached
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should handle non-existent store gracefully", function () {
        var nonExistentPath = node_path_1.default.join(testDir, "non-existent.json");
        // Should return empty store
        var loaded = (0, sessions_js_1.loadSessionStore)(nonExistentPath);
        (0, vitest_1.expect)(loaded).toEqual({});
    });
    (0, vitest_1.it)("should handle invalid JSON gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaded;
        return __generator(this, function (_a) {
            // Write invalid JSON
            node_fs_1.default.writeFileSync(storePath, "not valid json {");
            loaded = (0, sessions_js_1.loadSessionStore)(storePath);
            (0, vitest_1.expect)(loaded).toEqual({});
            return [2 /*return*/];
        });
    }); });
});
