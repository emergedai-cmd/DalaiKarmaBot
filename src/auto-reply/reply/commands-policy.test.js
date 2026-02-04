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
var vitest_1 = require("vitest");
var commands_js_1 = require("./commands.js");
var directive_handling_js_1 = require("./directive-handling.js");
var readConfigFileSnapshotMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var validateConfigObjectWithPluginsMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var writeConfigFileMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../../config/config.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../config/config.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readConfigFileSnapshot: readConfigFileSnapshotMock, validateConfigObjectWithPlugins: validateConfigObjectWithPluginsMock, writeConfigFile: writeConfigFileMock })];
        }
    });
}); });
var readChannelAllowFromStoreMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var addChannelAllowFromStoreEntryMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
var removeChannelAllowFromStoreEntryMock = vitest_1.vi.hoisted(function () { return vitest_1.vi.fn(); });
vitest_1.vi.mock("../../pairing/pairing-store.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../pairing/pairing-store.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { readChannelAllowFromStore: readChannelAllowFromStoreMock, addChannelAllowFromStoreEntry: addChannelAllowFromStoreEntryMock, removeChannelAllowFromStoreEntry: removeChannelAllowFromStoreEntryMock })];
        }
    });
}); });
vitest_1.vi.mock("../../channels/plugins/pairing.js", function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual("../../channels/plugins/pairing.js")];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { listPairingChannels: function () { return ["telegram"]; } })];
        }
    });
}); });
vitest_1.vi.mock("../../agents/model-catalog.js", function () { return ({
    loadModelCatalog: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, [
                    { provider: "anthropic", id: "claude-opus-4-5", name: "Claude Opus" },
                    { provider: "anthropic", id: "claude-sonnet-4-5", name: "Claude Sonnet" },
                    { provider: "openai", id: "gpt-4.1", name: "GPT-4.1" },
                    { provider: "openai", id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
                    { provider: "google", id: "gemini-2.0-flash", name: "Gemini Flash" },
                ]];
        });
    }); }),
}); });
function buildParams(commandBody, cfg, ctxOverrides) {
    var _this = this;
    var ctx = __assign({ Body: commandBody, CommandBody: commandBody, CommandSource: "text", CommandAuthorized: true, Provider: "telegram", Surface: "telegram" }, ctxOverrides);
    var command = (0, commands_js_1.buildCommandContext)({
        ctx: ctx,
        cfg: cfg,
        isGroup: false,
        triggerBodyNormalized: commandBody.trim().toLowerCase(),
        commandAuthorized: true,
    });
    return {
        ctx: ctx,
        cfg: cfg,
        command: command,
        directives: (0, directive_handling_js_1.parseInlineDirectives)(commandBody),
        elevated: { enabled: true, allowed: true, failures: [] },
        sessionKey: "agent:main:main",
        workspaceDir: "/tmp",
        defaultGroupActivation: function () { return "mention"; },
        resolvedVerboseLevel: "off",
        resolvedReasoningLevel: "off",
        resolveDefaultThinkingLevel: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); }); },
        provider: "telegram",
        model: "test-model",
        contextTokens: 0,
        isGroup: false,
    };
}
(0, vitest_1.describe)("handleCommands /allowlist", function () {
    (0, vitest_1.it)("lists config + store allowFrom entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    readChannelAllowFromStoreMock.mockResolvedValueOnce(["456"]);
                    cfg = {
                        commands: { text: true },
                        channels: { telegram: { allowFrom: ["123", "@Alice"] } },
                    };
                    params = buildParams("/allowlist list dm", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Channel: telegram");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("DM allowFrom (config): 123, @alice");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("Paired allowFrom (store): 456");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds entries to config and pairing store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, params, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readConfigFileSnapshotMock.mockResolvedValueOnce({
                        valid: true,
                        parsed: {
                            channels: { telegram: { allowFrom: ["123"] } },
                        },
                    });
                    validateConfigObjectWithPluginsMock.mockImplementation(function (config) { return ({
                        ok: true,
                        config: config,
                    }); });
                    addChannelAllowFromStoreEntryMock.mockResolvedValueOnce({
                        changed: true,
                        allowFrom: ["123", "789"],
                    });
                    cfg = {
                        commands: { text: true, config: true },
                        channels: { telegram: { allowFrom: ["123"] } },
                    };
                    params = buildParams("/allowlist add dm 789", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _b.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)(writeConfigFileMock).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        channels: { telegram: { allowFrom: ["123", "789"] } },
                    }));
                    (0, vitest_1.expect)(addChannelAllowFromStoreEntryMock).toHaveBeenCalledWith({
                        channel: "telegram",
                        entry: "789",
                    });
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("DM allowlist added");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("/models command", function () {
    var cfg = {
        commands: { text: true },
        agents: { defaults: { model: { primary: "anthropic/claude-opus-4-5" } } },
    };
    vitest_1.it.each(["telegram", "discord", "whatsapp"])("lists providers on %s", function (surface) { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    params = buildParams("/models", cfg, { Provider: surface, Surface: surface });
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Providers:");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("anthropic");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("Use: /models <provider>");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists provider models with pagination hints", function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    params = buildParams("/models anthropic", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _f.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Models (anthropic)");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("page 1/");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)((_d = result.reply) === null || _d === void 0 ? void 0 : _d.text).toContain("Switch: /model <provider/model>");
                    (0, vitest_1.expect)((_e = result.reply) === null || _e === void 0 ? void 0 : _e.text).toContain("All: /models anthropic all");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores page argument when all flag is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    params = buildParams("/models anthropic 3 all", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _e.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Models (anthropic)");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("page 1/1");
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("anthropic/claude-opus-4-5");
                    (0, vitest_1.expect)((_d = result.reply) === null || _d === void 0 ? void 0 : _d.text).not.toContain("Page out of range");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("errors on out-of-range pages", function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    params = buildParams("/models anthropic 4", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Page out of range");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("valid: 1-");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("handles unknown providers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    params = buildParams("/models not-a-provider", cfg);
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(params)];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_a = result.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("Unknown provider");
                    (0, vitest_1.expect)((_b = result.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("Available providers");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists configured models outside the curated catalog", function () { return __awaiter(void 0, void 0, void 0, function () {
        var customCfg, providerList, result;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    customCfg = {
                        commands: { text: true },
                        agents: {
                            defaults: {
                                model: {
                                    primary: "localai/ultra-chat",
                                    fallbacks: ["anthropic/claude-opus-4-5"],
                                },
                                imageModel: "visionpro/studio-v1",
                            },
                        },
                    };
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(buildParams("/models", customCfg))];
                case 1:
                    providerList = _f.sent();
                    (0, vitest_1.expect)((_a = providerList.reply) === null || _a === void 0 ? void 0 : _a.text).toContain("localai");
                    (0, vitest_1.expect)((_b = providerList.reply) === null || _b === void 0 ? void 0 : _b.text).toContain("visionpro");
                    return [4 /*yield*/, (0, commands_js_1.handleCommands)(buildParams("/models localai", customCfg))];
                case 2:
                    result = _f.sent();
                    (0, vitest_1.expect)(result.shouldContinue).toBe(false);
                    (0, vitest_1.expect)((_c = result.reply) === null || _c === void 0 ? void 0 : _c.text).toContain("Models (localai)");
                    (0, vitest_1.expect)((_d = result.reply) === null || _d === void 0 ? void 0 : _d.text).toContain("localai/ultra-chat");
                    (0, vitest_1.expect)((_e = result.reply) === null || _e === void 0 ? void 0 : _e.text).not.toContain("Unknown provider");
                    return [2 /*return*/];
            }
        });
    }); });
});
