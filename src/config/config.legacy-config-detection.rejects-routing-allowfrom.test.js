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
var vitest_1 = require("vitest");
(0, vitest_1.describe)("legacy config detection", function () {
    (0, vitest_1.it)("rejects routing.allowFrom", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        routing: { allowFrom: ["+15555550123"] },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("routing.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects routing.groupChat.requireMention", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        routing: { groupChat: { requireMention: false } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("routing.groupChat.requireMention");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates routing.allowFrom to channels.whatsapp.allowFrom when whatsapp configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_f.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        routing: { allowFrom: ["+15555550123"] },
                        channels: { whatsapp: {} },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved routing.allowFrom → channels.whatsapp.allowFrom.");
                    (0, vitest_1.expect)((_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.allowFrom).toEqual(["+15555550123"]);
                    (0, vitest_1.expect)((_e = (_d = res.config) === null || _d === void 0 ? void 0 : _d.routing) === null || _e === void 0 ? void 0 : _e.allowFrom).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("drops routing.allowFrom when whatsapp missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_e.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        routing: { allowFrom: ["+15555550123"] },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Removed routing.allowFrom (channels.whatsapp not configured).");
                    (0, vitest_1.expect)((_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.whatsapp).toBeUndefined();
                    (0, vitest_1.expect)((_d = (_c = res.config) === null || _c === void 0 ? void 0 : _c.routing) === null || _d === void 0 ? void 0 : _d.allowFrom).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates routing.groupChat.requireMention to channels whatsapp/telegram/imessage groups when whatsapp configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_u.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        routing: { groupChat: { requireMention: false } },
                        channels: { whatsapp: {} },
                    });
                    (0, vitest_1.expect)(res.changes).toContain('Moved routing.groupChat.requireMention → channels.whatsapp.groups."*".requireMention.');
                    (0, vitest_1.expect)(res.changes).toContain('Moved routing.groupChat.requireMention → channels.telegram.groups."*".requireMention.');
                    (0, vitest_1.expect)(res.changes).toContain('Moved routing.groupChat.requireMention → channels.imessage.groups."*".requireMention.');
                    (0, vitest_1.expect)((_e = (_d = (_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.whatsapp) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d["*"]) === null || _e === void 0 ? void 0 : _e.requireMention).toBe(false);
                    (0, vitest_1.expect)((_k = (_j = (_h = (_g = (_f = res.config) === null || _f === void 0 ? void 0 : _f.channels) === null || _g === void 0 ? void 0 : _g.telegram) === null || _h === void 0 ? void 0 : _h.groups) === null || _j === void 0 ? void 0 : _j["*"]) === null || _k === void 0 ? void 0 : _k.requireMention).toBe(false);
                    (0, vitest_1.expect)((_q = (_p = (_o = (_m = (_l = res.config) === null || _l === void 0 ? void 0 : _l.channels) === null || _m === void 0 ? void 0 : _m.imessage) === null || _o === void 0 ? void 0 : _o.groups) === null || _p === void 0 ? void 0 : _p["*"]) === null || _q === void 0 ? void 0 : _q.requireMention).toBe(false);
                    (0, vitest_1.expect)((_t = (_s = (_r = res.config) === null || _r === void 0 ? void 0 : _r.routing) === null || _s === void 0 ? void 0 : _s.groupChat) === null || _t === void 0 ? void 0 : _t.requireMention).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates routing.groupChat.requireMention to telegram/imessage when whatsapp missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_r.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        routing: { groupChat: { requireMention: false } },
                    });
                    (0, vitest_1.expect)(res.changes).toContain('Moved routing.groupChat.requireMention → channels.telegram.groups."*".requireMention.');
                    (0, vitest_1.expect)(res.changes).toContain('Moved routing.groupChat.requireMention → channels.imessage.groups."*".requireMention.');
                    (0, vitest_1.expect)(res.changes).not.toContain('Moved routing.groupChat.requireMention → channels.whatsapp.groups."*".requireMention.');
                    (0, vitest_1.expect)((_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.whatsapp).toBeUndefined();
                    (0, vitest_1.expect)((_g = (_f = (_e = (_d = (_c = res.config) === null || _c === void 0 ? void 0 : _c.channels) === null || _d === void 0 ? void 0 : _d.telegram) === null || _e === void 0 ? void 0 : _e.groups) === null || _f === void 0 ? void 0 : _f["*"]) === null || _g === void 0 ? void 0 : _g.requireMention).toBe(false);
                    (0, vitest_1.expect)((_m = (_l = (_k = (_j = (_h = res.config) === null || _h === void 0 ? void 0 : _h.channels) === null || _j === void 0 ? void 0 : _j.imessage) === null || _k === void 0 ? void 0 : _k.groups) === null || _l === void 0 ? void 0 : _l["*"]) === null || _m === void 0 ? void 0 : _m.requireMention).toBe(false);
                    (0, vitest_1.expect)((_q = (_p = (_o = res.config) === null || _o === void 0 ? void 0 : _o.routing) === null || _p === void 0 ? void 0 : _p.groupChat) === null || _q === void 0 ? void 0 : _q.requireMention).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates routing.groupChat.mentionPatterns to messages.groupChat.mentionPatterns", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        routing: { groupChat: { mentionPatterns: ["@openclaw"] } },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved routing.groupChat.mentionPatterns → messages.groupChat.mentionPatterns.");
                    (0, vitest_1.expect)((_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.groupChat) === null || _c === void 0 ? void 0 : _c.mentionPatterns).toEqual(["@openclaw"]);
                    (0, vitest_1.expect)((_f = (_e = (_d = res.config) === null || _d === void 0 ? void 0 : _d.routing) === null || _e === void 0 ? void 0 : _e.groupChat) === null || _f === void 0 ? void 0 : _f.mentionPatterns).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates routing agentToAgent/queue/transcribeAudio to tools/messages/media", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        routing: {
                            agentToAgent: { enabled: true, allow: ["main"] },
                            queue: { mode: "queue", cap: 3 },
                            transcribeAudio: {
                                command: ["whisper", "--model", "base"],
                                timeoutSeconds: 2,
                            },
                        },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved routing.agentToAgent → tools.agentToAgent.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved routing.queue → messages.queue.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved routing.transcribeAudio → tools.media.audio.models.");
                    (0, vitest_1.expect)((_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.tools) === null || _b === void 0 ? void 0 : _b.agentToAgent).toEqual({
                        enabled: true,
                        allow: ["main"],
                    });
                    (0, vitest_1.expect)((_d = (_c = res.config) === null || _c === void 0 ? void 0 : _c.messages) === null || _d === void 0 ? void 0 : _d.queue).toEqual({
                        mode: "queue",
                        cap: 3,
                    });
                    (0, vitest_1.expect)((_g = (_f = (_e = res.config) === null || _e === void 0 ? void 0 : _e.tools) === null || _f === void 0 ? void 0 : _f.media) === null || _g === void 0 ? void 0 : _g.audio).toEqual({
                        enabled: true,
                        models: [
                            {
                                command: "whisper",
                                type: "cli",
                                args: ["--model", "base"],
                                timeoutSeconds: 2,
                            },
                        ],
                    });
                    (0, vitest_1.expect)((_h = res.config) === null || _h === void 0 ? void 0 : _h.routing).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates agent config into agents.defaults and tools", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_t.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        agent: {
                            model: "openai/gpt-5.2",
                            tools: { allow: ["sessions.list"], deny: ["danger"] },
                            elevated: { enabled: true, allowFrom: { discord: ["user:1"] } },
                            bash: { timeoutSec: 12 },
                            sandbox: { tools: { allow: ["browser.open"] } },
                            subagents: { tools: { deny: ["sandbox"] } },
                        },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.tools.allow → tools.allow.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.tools.deny → tools.deny.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.elevated → tools.elevated.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.bash → tools.exec.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.sandbox.tools → tools.sandbox.tools.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent.subagents.tools → tools.subagents.tools.");
                    (0, vitest_1.expect)(res.changes).toContain("Moved agent → agents.defaults.");
                    (0, vitest_1.expect)((_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.model).toEqual({
                        primary: "openai/gpt-5.2",
                        fallbacks: [],
                    });
                    (0, vitest_1.expect)((_e = (_d = res.config) === null || _d === void 0 ? void 0 : _d.tools) === null || _e === void 0 ? void 0 : _e.allow).toEqual(["sessions.list"]);
                    (0, vitest_1.expect)((_g = (_f = res.config) === null || _f === void 0 ? void 0 : _f.tools) === null || _g === void 0 ? void 0 : _g.deny).toEqual(["danger"]);
                    (0, vitest_1.expect)((_j = (_h = res.config) === null || _h === void 0 ? void 0 : _h.tools) === null || _j === void 0 ? void 0 : _j.elevated).toEqual({
                        enabled: true,
                        allowFrom: { discord: ["user:1"] },
                    });
                    (0, vitest_1.expect)((_l = (_k = res.config) === null || _k === void 0 ? void 0 : _k.tools) === null || _l === void 0 ? void 0 : _l.exec).toEqual({ timeoutSec: 12 });
                    (0, vitest_1.expect)((_p = (_o = (_m = res.config) === null || _m === void 0 ? void 0 : _m.tools) === null || _o === void 0 ? void 0 : _o.sandbox) === null || _p === void 0 ? void 0 : _p.tools).toEqual({
                        allow: ["browser.open"],
                    });
                    (0, vitest_1.expect)((_s = (_r = (_q = res.config) === null || _q === void 0 ? void 0 : _q.tools) === null || _r === void 0 ? void 0 : _r.subagents) === null || _s === void 0 ? void 0 : _s.tools).toEqual({
                        deny: ["sandbox"],
                    });
                    (0, vitest_1.expect)(res.config.agent).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates tools.bash to tools.exec", function () { return __awaiter(void 0, void 0, void 0, function () {
        var migrateLegacyConfig, res;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    migrateLegacyConfig = (_e.sent()).migrateLegacyConfig;
                    res = migrateLegacyConfig({
                        tools: {
                            bash: { timeoutSec: 12 },
                        },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved tools.bash → tools.exec.");
                    (0, vitest_1.expect)((_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.tools) === null || _b === void 0 ? void 0 : _b.exec).toEqual({ timeoutSec: 12 });
                    (0, vitest_1.expect)((_d = (_c = res.config) === null || _c === void 0 ? void 0 : _c.tools) === null || _d === void 0 ? void 0 : _d.bash).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts per-agent tools.elevated overrides", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_f.sent()).validateConfigObject;
                    res = validateConfigObject({
                        tools: {
                            elevated: {
                                allowFrom: { whatsapp: ["+15555550123"] },
                            },
                        },
                        agents: {
                            list: [
                                {
                                    id: "work",
                                    workspace: "~/openclaw-work",
                                    tools: {
                                        elevated: {
                                            enabled: false,
                                            allowFrom: { whatsapp: ["+15555550123"] },
                                        },
                                    },
                                },
                            ],
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_e = (_d = (_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.agents) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.tools) === null || _e === void 0 ? void 0 : _e.elevated).toEqual({
                            enabled: false,
                            allowFrom: { whatsapp: ["+15555550123"] },
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects telegram.requireMention", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_a.sent()).validateConfigObject;
                    res = validateConfigObject({
                        telegram: { requireMention: true },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)(res.issues.some(function (issue) { return issue.path === "telegram.requireMention"; })).toBe(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects gateway.token", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        gateway: { token: "legacy-token" },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("gateway.token");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("migrates gateway.token to gateway.auth.token", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        gateway: { token: "legacy-token" },
                    });
                    (0, vitest_1.expect)(res.changes).toContain("Moved gateway.token → gateway.auth.token.");
                    (0, vitest_1.expect)((_c = (_b = (_a = res.config) === null || _a === void 0 ? void 0 : _a.gateway) === null || _b === void 0 ? void 0 : _b.auth) === null || _c === void 0 ? void 0 : _c.token).toBe("legacy-token");
                    (0, vitest_1.expect)((_f = (_e = (_d = res.config) === null || _d === void 0 ? void 0 : _d.gateway) === null || _e === void 0 ? void 0 : _e.auth) === null || _f === void 0 ? void 0 : _f.mode).toBe("token");
                    (0, vitest_1.expect)((_h = (_g = res.config) === null || _g === void 0 ? void 0 : _g.gateway) === null || _h === void 0 ? void 0 : _h.token).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps gateway.bind tailnet", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, migrateLegacyConfig, validateConfigObject, res, validated;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    _a = _c.sent(), migrateLegacyConfig = _a.migrateLegacyConfig, validateConfigObject = _a.validateConfigObject;
                    res = migrateLegacyConfig({
                        gateway: { bind: "tailnet" },
                    });
                    (0, vitest_1.expect)(res.changes).not.toContain("Migrated gateway.bind from 'tailnet' to 'auto'.");
                    (0, vitest_1.expect)(res.config).toBeNull();
                    validated = validateConfigObject({ gateway: { bind: "tailnet" } });
                    (0, vitest_1.expect)(validated.ok).toBe(true);
                    if (validated.ok) {
                        (0, vitest_1.expect)((_b = validated.config.gateway) === null || _b === void 0 ? void 0 : _b.bind).toBe("tailnet");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects telegram.dmPolicy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: { telegram: { dmPolicy: "open", allowFrom: ["123456789"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.telegram.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('accepts telegram.dmPolicy="open" with allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: { telegram: { dmPolicy: "open", allowFrom: ["*"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("open");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults telegram.dmPolicy to pairing when telegram section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { telegram: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("pairing");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults telegram.groupPolicy to allowlist when telegram section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { telegram: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults telegram.streamMode to partial when telegram section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { telegram: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.telegram) === null || _b === void 0 ? void 0 : _b.streamMode).toBe("partial");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects whatsapp.dmPolicy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: {
                            whatsapp: { dmPolicy: "open", allowFrom: ["+15555550123"] },
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.whatsapp.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('accepts whatsapp.dmPolicy="open" with allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: { whatsapp: { dmPolicy: "open", allowFrom: ["*"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("open");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults whatsapp.dmPolicy to pairing when whatsapp section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { whatsapp: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("pairing");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults whatsapp.groupPolicy to allowlist when whatsapp section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { whatsapp: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects signal.dmPolicy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: { signal: { dmPolicy: "open", allowFrom: ["+15555550123"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.signal.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('accepts signal.dmPolicy="open" with allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: { signal: { dmPolicy: "open", allowFrom: ["*"] } },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.signal) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("open");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults signal.dmPolicy to pairing when signal section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { signal: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.signal) === null || _b === void 0 ? void 0 : _b.dmPolicy).toBe("pairing");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("defaults signal.groupPolicy to allowlist when signal section exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_c.sent()).validateConfigObject;
                    res = validateConfigObject({ channels: { signal: {} } });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.signal) === null || _b === void 0 ? void 0 : _b.groupPolicy).toBe("allowlist");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts historyLimit overrides per provider and account", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validateConfigObject, res;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0:
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                case 1:
                    validateConfigObject = (_2.sent()).validateConfigObject;
                    res = validateConfigObject({
                        messages: { groupChat: { historyLimit: 12 } },
                        channels: {
                            whatsapp: { historyLimit: 9, accounts: { work: { historyLimit: 4 } } },
                            telegram: { historyLimit: 8, accounts: { ops: { historyLimit: 3 } } },
                            slack: { historyLimit: 7, accounts: { ops: { historyLimit: 2 } } },
                            signal: { historyLimit: 6 },
                            imessage: { historyLimit: 5 },
                            msteams: { historyLimit: 4 },
                            discord: { historyLimit: 3 },
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(true);
                    if (res.ok) {
                        (0, vitest_1.expect)((_b = (_a = res.config.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.historyLimit).toBe(9);
                        (0, vitest_1.expect)((_f = (_e = (_d = (_c = res.config.channels) === null || _c === void 0 ? void 0 : _c.whatsapp) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.work) === null || _f === void 0 ? void 0 : _f.historyLimit).toBe(4);
                        (0, vitest_1.expect)((_h = (_g = res.config.channels) === null || _g === void 0 ? void 0 : _g.telegram) === null || _h === void 0 ? void 0 : _h.historyLimit).toBe(8);
                        (0, vitest_1.expect)((_m = (_l = (_k = (_j = res.config.channels) === null || _j === void 0 ? void 0 : _j.telegram) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l.ops) === null || _m === void 0 ? void 0 : _m.historyLimit).toBe(3);
                        (0, vitest_1.expect)((_p = (_o = res.config.channels) === null || _o === void 0 ? void 0 : _o.slack) === null || _p === void 0 ? void 0 : _p.historyLimit).toBe(7);
                        (0, vitest_1.expect)((_t = (_s = (_r = (_q = res.config.channels) === null || _q === void 0 ? void 0 : _q.slack) === null || _r === void 0 ? void 0 : _r.accounts) === null || _s === void 0 ? void 0 : _s.ops) === null || _t === void 0 ? void 0 : _t.historyLimit).toBe(2);
                        (0, vitest_1.expect)((_v = (_u = res.config.channels) === null || _u === void 0 ? void 0 : _u.signal) === null || _v === void 0 ? void 0 : _v.historyLimit).toBe(6);
                        (0, vitest_1.expect)((_x = (_w = res.config.channels) === null || _w === void 0 ? void 0 : _w.imessage) === null || _x === void 0 ? void 0 : _x.historyLimit).toBe(5);
                        (0, vitest_1.expect)((_z = (_y = res.config.channels) === null || _y === void 0 ? void 0 : _y.msteams) === null || _z === void 0 ? void 0 : _z.historyLimit).toBe(4);
                        (0, vitest_1.expect)((_1 = (_0 = res.config.channels) === null || _0 === void 0 ? void 0 : _0.discord) === null || _1 === void 0 ? void 0 : _1.historyLimit).toBe(3);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects imessage.dmPolicy="open" without allowFrom "*"', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        channels: {
                            imessage: { dmPolicy: "open", allowFrom: ["+15555550123"] },
                        },
                    });
                    (0, vitest_1.expect)(res.ok).toBe(false);
                    if (!res.ok) {
                        (0, vitest_1.expect)((_a = res.issues[0]) === null || _a === void 0 ? void 0 : _a.path).toBe("channels.imessage.allowFrom");
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
