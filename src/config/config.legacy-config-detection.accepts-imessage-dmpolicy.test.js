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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var test_helpers_js_1 = require("./test-helpers.js");
(0, vitest_1.describe)("legacy config detection", function () {
    (0, vitest_1.it)('accepts imessage.dmPolicy="open" with allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { imessage: { dmPolicy: "open", allowFrom: ["*"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("open");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults imessage.dmPolicy to pairing when imessage section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { imessage: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("pairing");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults imessage.groupPolicy to allowlist when imessage section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { imessage: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults discord.groupPolicy to allowlist when discord section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { discord: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.discord) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults slack.groupPolicy to allowlist when slack section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { slack: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.slack) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults msteams.groupPolicy to allowlist when msteams section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { msteams: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unsafe executable config values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { imessage: { cliPath: "imsg; rm -rf /" } },
                        audio: { transcription: { command: ["whisper", "--model", "base"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)(res.issues.some(function (i) { return i.path === "channels.imessage.cliPath"; })).toBe(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts tools audio transcription without cli", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        audio: { transcription: { command: ["whisper", "--model", "base"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts path-like executable values with spaces", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { imessage: { cliPath: "/Applications/Imsg Tools/imsg" } },
                        audio: {
                            transcription: {
                                command: ["whisper", "--model"],
                            },
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects discord.dm.policy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_b.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { discord: { dm: { policy: "open", allowFrom: ["123"] } } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.discord.dm.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects slack.dm.policy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_b.sent()).validateConfigObject;
                    res = validateConfigObject({
                        channels: { slack: { dm: { policy: "open", allowFrom: ["U123"] } } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.slack.dm.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects legacy agent.model string", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        agent: { model: "anthropic/claude-opus-4-5" },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)(res.issues.some(function (i) { return i.path === "agent.model"; })).toBe(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates telegram.requireMention to channels.telegram.groups.*.requireMention", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_j.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        telegram: { requireMention: false },
                    });
                    (0, vitest_1.expect)(res.changes).toContain('Moved telegram.requireMention → channels.telegram.groups."*".requireMention.');
                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d["*"]) === null || _e === void 0 ? void 0 : _e.requireMention).toBe(false);
                    (0, vitest_1.expect)((_h = (_g = (_f = res.config) === null || _f === void 0 ? void 0 : _f.channels) === null || _g === void 0 ? void 0 : _g.telegram) === null || _h === void 0 ? void 0 : _h.requireMention).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates messages.tts.enabled to messages.tts.auto", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_g.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        messages: { tts: { enabled: true } },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved messages.tts.enabled → messages.tts.auto (always).");
                    (0, vitest_1.expect)((_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.tts) === null || _c === void 0 ? void 0 : _c.auto).toBe("always");
                    (0, vitest_1.expect)((_f = (_e = (_d = res.config) === null || _d === void 0 ? void 0 : _d.messages) === null || _e === void 0 ? void 0 : _e.tts) === null || _f === void 0 ? void 0 : _f.enabled).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates legacy model config to agent.models + model lists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_1.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        agent: {
                            model: "anthropic/claude-opus-4-5",
                            modelFallbacks: ["openai/gpt-4.1-mini"],
                            imageModel: "openai/gpt-4.1-mini",
                            imageModelFallbacks: ["anthropic/claude-opus-4-5"],
                            allowedModels: ["anthropic/claude-opus-4-5", "openai/gpt-4.1-mini"],
                            modelAliases: { Opus: "anthropic/claude-opus-4-5" },
                        },
                    });
                    (0, vitest_1.expect)((_d = (_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model) === null || _d === void 0 ? void 0 : _d.primary).toBe("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)((_h = (_g = (_f = (_e = res.config) === null || _e === void 0 ? void 0 : _e.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.model) === null || _h === void 0 ? void 0 : _h.fallbacks).toEqual(["openai/gpt-4.1-mini"]);
                    (0, vitest_1.expect)((_m = (_l = (_k = (_j = res.config) === null || _j === void 0 ? void 0 : _j.agents) === null || _k === void 0 ? void 0 : _k.defaults) === null || _l === void 0 ? void 0 : _l.imageModel) === null || _m === void 0 ? void 0 : _m.primary).toBe("openai/gpt-4.1-mini");
                    (0, vitest_1.expect)((_r = (_q = (_p = (_o = res.config) === null || _o === void 0 ? void 0 : _o.agents) === null || _p === void 0 ? void 0 : _p.defaults) === null || _q === void 0 ? void 0 : _q.imageModel) === null || _r === void 0 ? void 0 : _r.fallbacks).toEqual([
                        "anthropic/claude-opus-4-5",
                    ]);
                    (0, vitest_1.expect)((_v = (_u = (_t = (_s = res.config) === null || _s === void 0 ? void 0 : _s.agents) === null || _t === void 0 ? void 0 : _t.defaults) === null || _u === void 0 ? void 0 : _u.models) === null || _v === void 0 ? void 0 : _v["anthropic/claude-opus-4-5"]).toMatchObject({
                        alias: "Opus",
                    });
                    (0, vitest_1.expect)((_z = (_y = (_x = (_w = res.config) === null || _w === void 0 ? void 0 : _w.agents) === null || _x === void 0 ? void 0 : _x.defaults) === null || _y === void 0 ? void 0 : _y.models) === null || _z === void 0 ? void 0 : _z["openai/gpt-4.1-mini"]).toBeTruthy();
                    (0, vitest_1.expect)((_0 = res.config) === null || _0 === void 0 ? void 0 : _0.agent).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags legacy config in snapshot", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({ routing: { allowFrom: ["+15555550123"] } }), "utf-8")];
                                case 2:
                                    _b.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_b.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _b.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.legacyIssues.some(function (issue) { return issue.path === "routing.allowFrom"; })).toBe(true);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _b.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_a = parsed.routing) === null || _a === void 0 ? void 0 : _a.allowFrom).toEqual(["+15555550123"]);
                                    (0, vitest_1.expect)(parsed.channels).toBeUndefined();
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
    (0, vitest_1.it)("does not auto-migrate claude-cli auth profile mode on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, loadConfig, cfg, raw, parsed;
                        var _a, _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _g.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({
                                            auth: {
                                                profiles: {
                                                    "anthropic:claude-cli": { provider: "anthropic", mode: "token" },
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _g.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    loadConfig = (_g.sent()).loadConfig;
                                    cfg = loadConfig();
                                    (0, vitest_1.expect)((_c = (_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b["anthropic:claude-cli"]) === null || _c === void 0 ? void 0 : _c.mode).toBe("token");
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 4:
                                    raw = _g.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_f = (_e = (_d = parsed.auth) === null || _d === void 0 ? void 0 : _d.profiles) === null || _e === void 0 ? void 0 : _e["anthropic:claude-cli"]) === null || _f === void 0 ? void 0 : _f.mode).toBe("token");
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
    (0, vitest_1.it)("flags legacy provider sections in snapshot", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({ whatsapp: { allowFrom: ["+1555"] } }, null, 2), "utf-8")];
                                case 2:
                                    _a.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_a.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _a.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.legacyIssues.some(function (issue) { return issue.path === "whatsapp"; })).toBe(true);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _a.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)(parsed.channels).toBeUndefined();
                                    (0, vitest_1.expect)(parsed.whatsapp).toBeTruthy();
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
    (0, vitest_1.it)("flags routing.allowFrom in snapshot", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({ routing: { allowFrom: ["+1666"] } }, null, 2), "utf-8")];
                                case 2:
                                    _b.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_b.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _b.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.legacyIssues.some(function (issue) { return issue.path === "routing.allowFrom"; })).toBe(true);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _b.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)(parsed.channels).toBeUndefined();
                                    (0, vitest_1.expect)((_a = parsed.routing) === null || _a === void 0 ? void 0 : _a.allowFrom).toEqual(["+1666"]);
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
    (0, vitest_1.it)("rejects bindings[].match.provider on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({
                                            bindings: [{ agentId: "main", match: { provider: "slack" } }],
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _d.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_d.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _d.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.issues.length).toBeGreaterThan(0);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _d.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_c = (_b = (_a = parsed.bindings) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.match) === null || _c === void 0 ? void 0 : _c.provider).toBe("slack");
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
    (0, vitest_1.it)("rejects bindings[].match.accountID on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({
                                            bindings: [{ agentId: "main", match: { channel: "telegram", accountID: "work" } }],
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _d.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_d.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _d.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.issues.length).toBeGreaterThan(0);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _d.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_c = (_b = (_a = parsed.bindings) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.match) === null || _c === void 0 ? void 0 : _c.accountID).toBe("work");
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
    (0, vitest_1.it)("rejects session.sendPolicy.rules[].match.provider on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a, _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _f.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({
                                            session: {
                                                sendPolicy: {
                                                    rules: [{ action: "deny", match: { provider: "telegram" } }],
                                                },
                                            },
                                        }, null, 2), "utf-8")];
                                case 2:
                                    _f.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_f.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _f.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.issues.length).toBeGreaterThan(0);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _f.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = (_a = parsed.session) === null || _a === void 0 ? void 0 : _a.sendPolicy) === null || _b === void 0 ? void 0 : _b.rules) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.match) === null || _e === void 0 ? void 0 : _e.provider).toBe("telegram");
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
    (0, vitest_1.it)("rejects messages.queue.byProvider on load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, readConfigFileSnapshot, snap, raw, parsed;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    configPath = node_path_1.default.join(home, ".openclaw", "openclaw.json");
                                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(configPath), { recursive: true })];
                                case 1:
                                    _d.sent();
                                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({ messages: { queue: { byProvider: { whatsapp: "queue" } } } }, null, 2), "utf-8")];
                                case 2:
                                    _d.sent();
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 3:
                                    readConfigFileSnapshot = (_d.sent()).readConfigFileSnapshot;
                                    return [4 /*yield*/, readConfigFileSnapshot()];
                                case 4:
                                    snap = _d.sent();
                                    (0, vitest_1.expect)(snap.valid).toBe(false);
                                    (0, vitest_1.expect)(snap.issues.length).toBeGreaterThan(0);
                                    return [4 /*yield*/, promises_1.default.readFile(configPath, "utf-8")];
                                case 5:
                                    raw = _d.sent();
                                    parsed = JSON.parse(raw);
                                    (0, vitest_1.expect)((_c = (_b = (_a = parsed.messages) === null || _a === void 0 ? void 0 : _a.queue) === null || _b === void 0 ? void 0 : _b.byProvider) === null || _c === void 0 ? void 0 : _c.whatsapp).toBe("queue");
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
