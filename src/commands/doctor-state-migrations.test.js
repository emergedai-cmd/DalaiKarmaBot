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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var doctor_state_migrations_js_1 = require("./doctor-state-migrations.js");
var tempRoot = null;
function makeTempRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fs_1.default.promises.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-doctor-"))];
                case 1:
                    root = _a.sent();
                    tempRoot = root;
                    return [2 /*return*/, root];
            }
        });
    });
}
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, doctor_state_migrations_js_1.resetAutoMigrateLegacyStateForTest)();
                (0, doctor_state_migrations_js_1.resetAutoMigrateLegacyStateDirForTest)();
                if (!tempRoot) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, node_fs_1.default.promises.rm(tempRoot, { recursive: true, force: true })];
            case 1:
                _a.sent();
                tempRoot = null;
                return [2 /*return*/];
        }
    });
}); });
function writeJson5(filePath, value) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
    node_fs_1.default.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}
(0, vitest_1.describe)("doctor legacy state migrations", function () {
    (0, vitest_1.it)("migrates legacy sessions into agents/<id>/sessions", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacySessionsDir, detected, result, targetDir, store;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _g.sent();
                    cfg = {};
                    legacySessionsDir = node_path_1.default.join(root, "sessions");
                    node_fs_1.default.mkdirSync(legacySessionsDir, { recursive: true });
                    writeJson5(node_path_1.default.join(legacySessionsDir, "sessions.json"), {
                        "+1555": { sessionId: "a", updatedAt: 10 },
                        "+1666": { sessionId: "b", updatedAt: 20 },
                        "slack:channel:C123": { sessionId: "c", updatedAt: 30 },
                        "group:abc": { sessionId: "d", updatedAt: 40 },
                        "subagent:xyz": { sessionId: "e", updatedAt: 50 },
                    });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacySessionsDir, "a.jsonl"), "a", "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacySessionsDir, "b.jsonl"), "b", "utf-8");
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _g.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({
                            detected: detected,
                            now: function () { return 123; },
                        })];
                case 3:
                    result = _g.sent();
                    (0, vitest_1.expect)(result.warnings).toEqual([]);
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(targetDir, "a.jsonl"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(targetDir, "b.jsonl"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(legacySessionsDir, "a.jsonl"))).toBe(false);
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)((_a = store["agent:main:main"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("b");
                    (0, vitest_1.expect)((_b = store["agent:main:+1555"]) === null || _b === void 0 ? void 0 : _b.sessionId).toBe("a");
                    (0, vitest_1.expect)((_c = store["agent:main:+1666"]) === null || _c === void 0 ? void 0 : _c.sessionId).toBe("b");
                    (0, vitest_1.expect)(store["+1555"]).toBeUndefined();
                    (0, vitest_1.expect)(store["+1666"]).toBeUndefined();
                    (0, vitest_1.expect)((_d = store["agent:main:slack:channel:c123"]) === null || _d === void 0 ? void 0 : _d.sessionId).toBe("c");
                    (0, vitest_1.expect)((_e = store["agent:main:unknown:group:abc"]) === null || _e === void 0 ? void 0 : _e.sessionId).toBe("d");
                    (0, vitest_1.expect)((_f = store["agent:main:subagent:xyz"]) === null || _f === void 0 ? void 0 : _f.sessionId).toBe("e");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates legacy agent dir with conflict fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacyAgentDir, targetAgentDir, detected, backupDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    cfg = {};
                    legacyAgentDir = node_path_1.default.join(root, "agent");
                    node_fs_1.default.mkdirSync(legacyAgentDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacyAgentDir, "foo.txt"), "legacy", "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacyAgentDir, "baz.txt"), "legacy2", "utf-8");
                    targetAgentDir = node_path_1.default.join(root, "agents", "main", "agent");
                    node_fs_1.default.mkdirSync(targetAgentDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(targetAgentDir, "foo.txt"), "new", "utf-8");
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _a.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(node_fs_1.default.readFileSync(node_path_1.default.join(targetAgentDir, "baz.txt"), "utf-8")).toBe("legacy2");
                    backupDir = node_path_1.default.join(root, "agents", "main", "agent.legacy-123");
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(backupDir, "foo.txt"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-migrates legacy agent dir on startup", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacyAgentDir, log, result, targetAgentDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    cfg = {};
                    legacyAgentDir = node_path_1.default.join(root, "agent");
                    node_fs_1.default.mkdirSync(legacyAgentDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacyAgentDir, "auth.json"), "{}", "utf-8");
                    log = { info: vitest_1.vi.fn(), warn: vitest_1.vi.fn() };
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyState)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                            log: log,
                        })];
                case 2:
                    result = _a.sent();
                    targetAgentDir = node_path_1.default.join(root, "agents", "main", "agent");
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(targetAgentDir, "auth.json"))).toBe(true);
                    (0, vitest_1.expect)(result.migrated).toBe(true);
                    (0, vitest_1.expect)(log.info).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-migrates legacy sessions on startup", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacySessionsDir, log, result, targetDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    cfg = {};
                    legacySessionsDir = node_path_1.default.join(root, "sessions");
                    node_fs_1.default.mkdirSync(legacySessionsDir, { recursive: true });
                    writeJson5(node_path_1.default.join(legacySessionsDir, "sessions.json"), {
                        "+1555": { sessionId: "a", updatedAt: 10 },
                    });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(legacySessionsDir, "a.jsonl"), "a", "utf-8");
                    log = { info: vitest_1.vi.fn(), warn: vitest_1.vi.fn() };
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyState)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                            log: log,
                            now: function () { return 123; },
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.migrated).toBe(true);
                    (0, vitest_1.expect)(log.info).toHaveBeenCalled();
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(targetDir, "a.jsonl"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(legacySessionsDir, "a.jsonl"))).toBe(false);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(targetDir, "sessions.json"))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates legacy WhatsApp auth files without touching oauth.json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, oauthDir, detected, target;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    cfg = {};
                    oauthDir = node_path_1.default.join(root, "credentials");
                    node_fs_1.default.mkdirSync(oauthDir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(oauthDir, "oauth.json"), "{}", "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(oauthDir, "creds.json"), "{}", "utf-8");
                    node_fs_1.default.writeFileSync(node_path_1.default.join(oauthDir, "session-abc.json"), "{}", "utf-8");
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _a.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _a.sent();
                    target = node_path_1.default.join(oauthDir, "whatsapp", "default");
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(target, "creds.json"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(target, "session-abc.json"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(oauthDir, "oauth.json"))).toBe(true);
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(oauthDir, "creds.json"))).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("no-ops when nothing detected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, detected, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    cfg = {};
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _a.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.changes).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("routes legacy state to the default agent entry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacySessionsDir, detected, targetDir, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = {
                        agents: { list: [{ id: "alpha", default: true }] },
                    };
                    legacySessionsDir = node_path_1.default.join(root, "sessions");
                    node_fs_1.default.mkdirSync(legacySessionsDir, { recursive: true });
                    writeJson5(node_path_1.default.join(legacySessionsDir, "sessions.json"), {
                        "+1555": { sessionId: "a", updatedAt: 10 },
                    });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _b.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _b.sent();
                    targetDir = node_path_1.default.join(root, "agents", "alpha", "sessions");
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)((_a = store["agent:alpha:main"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("a");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors session.mainKey when seeding the direct-chat bucket", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, legacySessionsDir, detected, targetDir, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = { session: { mainKey: "work" } };
                    legacySessionsDir = node_path_1.default.join(root, "sessions");
                    node_fs_1.default.mkdirSync(legacySessionsDir, { recursive: true });
                    writeJson5(node_path_1.default.join(legacySessionsDir, "sessions.json"), {
                        "+1555": { sessionId: "a", updatedAt: 10 },
                        "+1666": { sessionId: "b", updatedAt: 20 },
                    });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _b.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _b.sent();
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)((_a = store["agent:main:work"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("b");
                    (0, vitest_1.expect)(store["agent:main:main"]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("canonicalizes legacy main keys inside the target sessions store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, targetDir, detected, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = {};
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    writeJson5(node_path_1.default.join(targetDir, "sessions.json"), {
                        main: { sessionId: "legacy", updatedAt: 10 },
                        "agent:main:main": { sessionId: "fresh", updatedAt: 20 },
                    });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _b.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _b.sent();
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)(store["main"]).toBeUndefined();
                    (0, vitest_1.expect)((_a = store["agent:main:main"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("fresh");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prefers the newest entry when collapsing main aliases", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, targetDir, detected, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = { session: { mainKey: "work" } };
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    writeJson5(node_path_1.default.join(targetDir, "sessions.json"), {
                        "agent:main:main": { sessionId: "legacy", updatedAt: 50 },
                        "agent:main:work": { sessionId: "canonical", updatedAt: 10 },
                    });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _b.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _b.sent();
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)((_a = store["agent:main:work"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("legacy");
                    (0, vitest_1.expect)(store["agent:main:main"]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lowercases agent session keys during canonicalization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, targetDir, detected, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = {};
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    writeJson5(node_path_1.default.join(targetDir, "sessions.json"), {
                        "agent:main:slack:channel:C123": { sessionId: "legacy", updatedAt: 10 },
                    });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.detectLegacyStateMigrations)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                        })];
                case 2:
                    detected = _b.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.runLegacyStateMigrations)({ detected: detected, now: function () { return 123; } })];
                case 3:
                    _b.sent();
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)((_a = store["agent:main:slack:channel:c123"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("legacy");
                    (0, vitest_1.expect)(store["agent:main:slack:channel:C123"]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-migrates when only target sessions contain legacy keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, cfg, targetDir, log, result, store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _b.sent();
                    cfg = {};
                    targetDir = node_path_1.default.join(root, "agents", "main", "sessions");
                    writeJson5(node_path_1.default.join(targetDir, "sessions.json"), {
                        main: { sessionId: "legacy", updatedAt: 10 },
                    });
                    log = { info: vitest_1.vi.fn(), warn: vitest_1.vi.fn() };
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyState)({
                            cfg: cfg,
                            env: { OPENCLAW_STATE_DIR: root },
                            log: log,
                        })];
                case 2:
                    result = _b.sent();
                    store = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(targetDir, "sessions.json"), "utf-8"));
                    (0, vitest_1.expect)(result.migrated).toBe(true);
                    (0, vitest_1.expect)(log.info).toHaveBeenCalled();
                    (0, vitest_1.expect)(store["main"]).toBeUndefined();
                    (0, vitest_1.expect)((_a = store["agent:main:main"]) === null || _a === void 0 ? void 0 : _a.sessionId).toBe("legacy");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does nothing when no legacy state dir exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyStateDir)({
                            env: {},
                            homedir: function () { return root; },
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.migrated).toBe(false);
                    (0, vitest_1.expect)(result.skipped).toBe(false);
                    (0, vitest_1.expect)(result.warnings).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips state dir migration when env override is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, legacyDir, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempRoot()];
                case 1:
                    root = _a.sent();
                    legacyDir = node_path_1.default.join(root, ".openclaw");
                    node_fs_1.default.mkdirSync(legacyDir, { recursive: true });
                    return [4 /*yield*/, (0, doctor_state_migrations_js_1.autoMigrateLegacyStateDir)({
                            env: { OPENCLAW_STATE_DIR: "/custom/state" },
                            homedir: function () { return root; },
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.skipped).toBe(true);
                    (0, vitest_1.expect)(result.migrated).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
