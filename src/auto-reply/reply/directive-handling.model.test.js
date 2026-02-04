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
var directive_handling_impl_js_1 = require("./directive-handling.impl.js");
var directive_handling_js_1 = require("./directive-handling.js");
var directive_handling_model_js_1 = require("./directive-handling.model.js");
// Mock dependencies for directive handling persistence.
vitest_1.vi.mock("../../agents/agent-scope.js", function () { return ({
    resolveAgentConfig: vitest_1.vi.fn(function () { return ({}); }),
    resolveAgentDir: vitest_1.vi.fn(function () { return "/tmp/agent"; }),
    resolveSessionAgentId: vitest_1.vi.fn(function () { return "main"; }),
}); });
vitest_1.vi.mock("../../agents/sandbox.js", function () { return ({
    resolveSandboxRuntimeStatus: vitest_1.vi.fn(function () { return ({ sandboxed: false }); }),
}); });
vitest_1.vi.mock("../../config/sessions.js", function () { return ({
    updateSessionStore: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
vitest_1.vi.mock("../../infra/system-events.js", function () { return ({
    enqueueSystemEvent: vitest_1.vi.fn(),
}); });
function baseAliasIndex() {
    return { byAlias: new Map(), byKey: new Map() };
}
function baseConfig() {
    return {
        commands: { text: true },
        agents: { defaults: {} },
    };
}
(0, vitest_1.describe)("/model chat UX", function () {
    (0, vitest_1.it)("shows summary for /model with no args", function () { return __awaiter(void 0, void 0, void 0, function () {
        var directives, cfg, reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    directives = (0, directive_handling_js_1.parseInlineDirectives)("/model");
                    cfg = { commands: { text: true } };
                    return [4 /*yield*/, (0, directive_handling_model_js_1.maybeHandleModelDirectiveInfo)({
                            directives: directives,
                            cfg: cfg,
                            agentDir: "/tmp/agent",
                            activeAgentId: "main",
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            defaultProvider: "anthropic",
                            defaultModel: "claude-opus-4-5",
                            aliasIndex: baseAliasIndex(),
                            allowedModelCatalog: [],
                            resetModelOverride: false,
                        })];
                case 1:
                    reply = _a.sent();
                    (0, vitest_1.expect)(reply === null || reply === void 0 ? void 0 : reply.text).toContain("Current:");
                    (0, vitest_1.expect)(reply === null || reply === void 0 ? void 0 : reply.text).toContain("Browse: /models");
                    (0, vitest_1.expect)(reply === null || reply === void 0 ? void 0 : reply.text).toContain("Switch: /model <provider/model>");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("auto-applies closest match for typos", function () {
        var directives = (0, directive_handling_js_1.parseInlineDirectives)("/model anthropic/claud-opus-4-5");
        var cfg = { commands: { text: true } };
        var resolved = (0, directive_handling_model_js_1.resolveModelSelectionFromDirective)({
            directives: directives,
            cfg: cfg,
            agentDir: "/tmp/agent",
            defaultProvider: "anthropic",
            defaultModel: "claude-opus-4-5",
            aliasIndex: baseAliasIndex(),
            allowedModelKeys: new Set(["anthropic/claude-opus-4-5"]),
            allowedModelCatalog: [{ provider: "anthropic", id: "claude-opus-4-5" }],
            provider: "anthropic",
        });
        (0, vitest_1.expect)(resolved.modelSelection).toEqual({
            provider: "anthropic",
            model: "claude-opus-4-5",
            isDefault: true,
        });
        (0, vitest_1.expect)(resolved.errorText).toBeUndefined();
    });
});
(0, vitest_1.describe)("handleDirectiveOnly model persist behavior (fixes #1435)", function () {
    var allowedModelKeys = new Set(["anthropic/claude-opus-4-5", "openai/gpt-4o"]);
    var allowedModelCatalog = [
        { provider: "anthropic", id: "claude-opus-4-5" },
        { provider: "openai", id: "gpt-4o" },
    ];
    (0, vitest_1.it)("shows success message when session state is available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var directives, sessionEntry, sessionStore, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    directives = (0, directive_handling_js_1.parseInlineDirectives)("/model openai/gpt-4o");
                    sessionEntry = {
                        sessionId: "s1",
                        updatedAt: Date.now(),
                    };
                    sessionStore = { "agent:main:dm:1": sessionEntry };
                    return [4 /*yield*/, (0, directive_handling_impl_js_1.handleDirectiveOnly)({
                            cfg: baseConfig(),
                            directives: directives,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: "agent:main:dm:1",
                            storePath: "/tmp/sessions.json",
                            elevatedEnabled: false,
                            elevatedAllowed: false,
                            defaultProvider: "anthropic",
                            defaultModel: "claude-opus-4-5",
                            aliasIndex: baseAliasIndex(),
                            allowedModelKeys: allowedModelKeys,
                            allowedModelCatalog: allowedModelCatalog,
                            resetModelOverride: false,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            initialModelLabel: "anthropic/claude-opus-4-5",
                            formatModelSwitchEvent: function (label) { return "Switched to ".concat(label); },
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toContain("Model set to");
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).toContain("openai/gpt-4o");
                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.text).not.toContain("failed");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows no model message when no /model directive", function () { return __awaiter(void 0, void 0, void 0, function () {
        var directives, sessionEntry, sessionStore, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    directives = (0, directive_handling_js_1.parseInlineDirectives)("hello world");
                    sessionEntry = {
                        sessionId: "s1",
                        updatedAt: Date.now(),
                    };
                    sessionStore = { "agent:main:dm:1": sessionEntry };
                    return [4 /*yield*/, (0, directive_handling_impl_js_1.handleDirectiveOnly)({
                            cfg: baseConfig(),
                            directives: directives,
                            sessionEntry: sessionEntry,
                            sessionStore: sessionStore,
                            sessionKey: "agent:main:dm:1",
                            storePath: "/tmp/sessions.json",
                            elevatedEnabled: false,
                            elevatedAllowed: false,
                            defaultProvider: "anthropic",
                            defaultModel: "claude-opus-4-5",
                            aliasIndex: baseAliasIndex(),
                            allowedModelKeys: allowedModelKeys,
                            allowedModelCatalog: allowedModelCatalog,
                            resetModelOverride: false,
                            provider: "anthropic",
                            model: "claude-opus-4-5",
                            initialModelLabel: "anthropic/claude-opus-4-5",
                            formatModelSwitchEvent: function (label) { return "Switched to ".concat(label); },
                        })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)((_a = result === null || result === void 0 ? void 0 : result.text) !== null && _a !== void 0 ? _a : "").not.toContain("Model set to");
                    (0, vitest_1.expect)((_b = result === null || result === void 0 ? void 0 : result.text) !== null && _b !== void 0 ? _b : "").not.toContain("failed");
                    return [2 /*return*/];
            }
        });
    }); });
});
