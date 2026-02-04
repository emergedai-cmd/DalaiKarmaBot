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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var normalize_text_js_1 = require("../../test/helpers/normalize-text.js");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var status_js_1 = require("./status.js");
var listPluginCommands = vitest_1.vi.hoisted(function () { return ({
    listPluginCommands: vitest_1.vi.fn(function () { return []; }),
}); }).listPluginCommands;
vitest_1.vi.mock("../plugins/commands.js", function () { return ({
    listPluginCommands: listPluginCommands,
}); });
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("buildStatusMessage", function () {
    (0, vitest_1.it)("summarizes agent readiness and context usage", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            config: {
                models: {
                    providers: {
                        anthropic: {
                            apiKey: "test-key",
                            models: [
                                {
                                    id: "pi:opus",
                                    cost: {
                                        input: 1,
                                        output: 1,
                                        cacheRead: 0,
                                        cacheWrite: 0,
                                    },
                                },
                            ],
                        },
                    },
                },
            },
            agent: {
                model: "anthropic/pi:opus",
                contextTokens: 32000,
            },
            sessionEntry: {
                sessionId: "abc",
                updatedAt: 0,
                inputTokens: 1200,
                outputTokens: 800,
                totalTokens: 16000,
                contextTokens: 32000,
                thinkingLevel: "low",
                verboseLevel: "on",
                compactionCount: 2,
            },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            resolvedThink: "medium",
            resolvedVerbose: "off",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "api-key",
            now: 10 * 60000, // 10 minutes later
        });
        var normalized = (0, normalize_text_js_1.normalizeTestText)(text);
        (0, vitest_1.expect)(normalized).toContain("OpenClaw");
        (0, vitest_1.expect)(normalized).toContain("Model: anthropic/pi:opus");
        (0, vitest_1.expect)(normalized).toContain("api-key");
        (0, vitest_1.expect)(normalized).toContain("Tokens: 1.2k in / 800 out");
        (0, vitest_1.expect)(normalized).toContain("Cost: $0.0020");
        (0, vitest_1.expect)(normalized).toContain("Context: 16k/32k (50%)");
        (0, vitest_1.expect)(normalized).toContain("Compactions: 2");
        (0, vitest_1.expect)(normalized).toContain("Session: agent:main:main");
        (0, vitest_1.expect)(normalized).toContain("updated 10m ago");
        (0, vitest_1.expect)(normalized).toContain("Runtime: direct");
        (0, vitest_1.expect)(normalized).toContain("Think: medium");
        (0, vitest_1.expect)(normalized).not.toContain("verbose");
        (0, vitest_1.expect)(normalized).toContain("elevated");
        (0, vitest_1.expect)(normalized).toContain("Queue: collect");
    });
    (0, vitest_1.it)("uses per-agent sandbox config when config and session key are provided", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            config: {
                agents: {
                    list: [
                        { id: "main", default: true },
                        { id: "discord", sandbox: { mode: "all" } },
                    ],
                },
            },
            agent: {},
            sessionKey: "agent:discord:discord:channel:1456350065223270435",
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
        });
        (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text)).toContain("Runtime: docker/all");
    });
    (0, vitest_1.it)("shows verbose/elevated labels only when enabled", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: { model: "anthropic/claude-opus-4-5" },
            sessionEntry: { sessionId: "v1", updatedAt: 0 },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            resolvedThink: "low",
            resolvedVerbose: "on",
            resolvedElevated: "on",
            queue: { mode: "collect", depth: 0 },
        });
        (0, vitest_1.expect)(text).toContain("verbose");
        (0, vitest_1.expect)(text).toContain("elevated");
    });
    (0, vitest_1.it)("includes media understanding decisions when present", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: { model: "anthropic/claude-opus-4-5" },
            sessionEntry: { sessionId: "media", updatedAt: 0 },
            sessionKey: "agent:main:main",
            queue: { mode: "none" },
            mediaDecisions: [
                {
                    capability: "image",
                    outcome: "success",
                    attachments: [
                        {
                            attachmentIndex: 0,
                            attempts: [
                                {
                                    type: "provider",
                                    outcome: "success",
                                    provider: "openai",
                                    model: "gpt-5.2",
                                },
                            ],
                            chosen: {
                                type: "provider",
                                outcome: "success",
                                provider: "openai",
                                model: "gpt-5.2",
                            },
                        },
                    ],
                },
                {
                    capability: "audio",
                    outcome: "skipped",
                    attachments: [
                        {
                            attachmentIndex: 1,
                            attempts: [
                                {
                                    type: "provider",
                                    outcome: "skipped",
                                    reason: "maxBytes: too large",
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        var normalized = (0, normalize_text_js_1.normalizeTestText)(text);
        (0, vitest_1.expect)(normalized).toContain("Media: image ok (openai/gpt-5.2) · audio skipped (maxBytes)");
    });
    (0, vitest_1.it)("omits media line when all decisions are none", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: { model: "anthropic/claude-opus-4-5" },
            sessionEntry: { sessionId: "media-none", updatedAt: 0 },
            sessionKey: "agent:main:main",
            queue: { mode: "none" },
            mediaDecisions: [
                { capability: "image", outcome: "no-attachment", attachments: [] },
                { capability: "audio", outcome: "no-attachment", attachments: [] },
                { capability: "video", outcome: "no-attachment", attachments: [] },
            ],
        });
        (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text)).not.toContain("Media:");
    });
    (0, vitest_1.it)("does not show elevated label when session explicitly disables it", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: { model: "anthropic/claude-opus-4-5", elevatedDefault: "on" },
            sessionEntry: { sessionId: "v1", updatedAt: 0, elevatedLevel: "off" },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            resolvedThink: "low",
            resolvedVerbose: "off",
            queue: { mode: "collect", depth: 0 },
        });
        var optionsLine = text.split("\n").find(function (line) { return line.trim().startsWith("⚙️"); });
        (0, vitest_1.expect)(optionsLine).toBeTruthy();
        (0, vitest_1.expect)(optionsLine).not.toContain("elevated");
    });
    (0, vitest_1.it)("prefers model overrides over last-run model", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: {
                model: "anthropic/claude-opus-4-5",
                contextTokens: 32000,
            },
            sessionEntry: {
                sessionId: "override-1",
                updatedAt: 0,
                providerOverride: "openai",
                modelOverride: "gpt-4.1-mini",
                modelProvider: "anthropic",
                model: "claude-haiku-4-5",
                contextTokens: 32000,
            },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "api-key",
        });
        (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text)).toContain("Model: openai/gpt-4.1-mini");
    });
    (0, vitest_1.it)("keeps provider prefix from configured model", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: {
                model: "google-antigravity/claude-sonnet-4-5",
            },
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "api-key",
        });
        (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text)).toContain("Model: google-antigravity/claude-sonnet-4-5");
    });
    (0, vitest_1.it)("handles missing agent config gracefully", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: {},
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "api-key",
        });
        var normalized = (0, normalize_text_js_1.normalizeTestText)(text);
        (0, vitest_1.expect)(normalized).toContain("Model:");
        (0, vitest_1.expect)(normalized).toContain("Context:");
        (0, vitest_1.expect)(normalized).toContain("Queue: collect");
    });
    (0, vitest_1.it)("includes group activation for group sessions", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: {},
            sessionEntry: {
                sessionId: "g1",
                updatedAt: 0,
                groupActivation: "always",
                chatType: "group",
            },
            sessionKey: "agent:main:whatsapp:group:123@g.us",
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "api-key",
        });
        (0, vitest_1.expect)(text).toContain("Activation: always");
    });
    (0, vitest_1.it)("shows queue details when overridden", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: {},
            sessionEntry: { sessionId: "q1", updatedAt: 0 },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            queue: {
                mode: "collect",
                depth: 3,
                debounceMs: 2000,
                cap: 5,
                dropPolicy: "old",
                showDetails: true,
            },
            modelAuth: "api-key",
        });
        (0, vitest_1.expect)(text).toContain("Queue: collect (depth 3 · debounce 2s · cap 5 · drop old)");
    });
    (0, vitest_1.it)("inserts usage summary beneath context line", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            agent: { model: "anthropic/claude-opus-4-5", contextTokens: 32000 },
            sessionEntry: { sessionId: "u1", updatedAt: 0, totalTokens: 1000 },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            usageLine: "📊 Usage: Claude 80% left (5h)",
            modelAuth: "api-key",
        });
        var lines = (0, normalize_text_js_1.normalizeTestText)(text).split("\n");
        var contextIndex = lines.findIndex(function (line) { return line.includes("Context:"); });
        (0, vitest_1.expect)(contextIndex).toBeGreaterThan(-1);
        (0, vitest_1.expect)(lines[contextIndex + 1]).toContain("Usage: Claude 80% left (5h)");
    });
    (0, vitest_1.it)("hides cost when not using an API key", function () {
        var text = (0, status_js_1.buildStatusMessage)({
            config: {
                models: {
                    providers: {
                        anthropic: {
                            models: [
                                {
                                    id: "claude-opus-4-5",
                                    cost: {
                                        input: 1,
                                        output: 1,
                                        cacheRead: 0,
                                        cacheWrite: 0,
                                    },
                                },
                            ],
                        },
                    },
                },
            },
            agent: { model: "anthropic/claude-opus-4-5" },
            sessionEntry: { sessionId: "c1", updatedAt: 0, inputTokens: 10 },
            sessionKey: "agent:main:main",
            sessionScope: "per-sender",
            queue: { mode: "collect", depth: 0 },
            modelAuth: "oauth",
        });
        (0, vitest_1.expect)(text).not.toContain("💵 Cost:");
    });
    (0, vitest_1.it)("prefers cached prompt tokens from the session log", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, temp_home_js_1.withTempHome)(function (dir) { return __awaiter(void 0, void 0, void 0, function () {
                        var buildStatusMessageDynamic, sessionId, logPath, text;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    vitest_1.vi.resetModules();
                                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./status.js"); })];
                                case 1:
                                    buildStatusMessageDynamic = (_a.sent()).buildStatusMessage;
                                    sessionId = "sess-1";
                                    logPath = node_path_1.default.join(dir, ".openclaw", "agents", "main", "sessions", "".concat(sessionId, ".jsonl"));
                                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(logPath), { recursive: true });
                                    node_fs_1.default.writeFileSync(logPath, [
                                        JSON.stringify({
                                            type: "message",
                                            message: {
                                                role: "assistant",
                                                model: "claude-opus-4-5",
                                                usage: {
                                                    input: 1,
                                                    output: 2,
                                                    cacheRead: 1000,
                                                    cacheWrite: 0,
                                                    totalTokens: 1003,
                                                },
                                            },
                                        }),
                                    ].join("\n"), "utf-8");
                                    text = buildStatusMessageDynamic({
                                        agent: {
                                            model: "anthropic/claude-opus-4-5",
                                            contextTokens: 32000,
                                        },
                                        sessionEntry: {
                                            sessionId: sessionId,
                                            updatedAt: 0,
                                            totalTokens: 3, // would be wrong if cached prompt tokens exist
                                            contextTokens: 32000,
                                        },
                                        sessionKey: "agent:main:main",
                                        sessionScope: "per-sender",
                                        queue: { mode: "collect", depth: 0 },
                                        includeTranscriptUsage: true,
                                        modelAuth: "api-key",
                                    });
                                    (0, vitest_1.expect)((0, normalize_text_js_1.normalizeTestText)(text)).toContain("Context: 1.0k/32k");
                                    return [2 /*return*/];
                            }
                        });
                    }); }, { prefix: "openclaw-status-" })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("buildCommandsMessage", function () {
    (0, vitest_1.it)("lists commands with aliases and text-only hints", function () {
        var text = (0, status_js_1.buildCommandsMessage)({
            commands: { config: false, debug: false },
        });
        (0, vitest_1.expect)(text).toContain("ℹ️ Slash commands");
        (0, vitest_1.expect)(text).toContain("Status");
        (0, vitest_1.expect)(text).toContain("/commands - List all slash commands.");
        (0, vitest_1.expect)(text).toContain("/skill - Run a skill by name.");
        (0, vitest_1.expect)(text).toContain("/think (/thinking, /t) - Set thinking level.");
        (0, vitest_1.expect)(text).toContain("/compact [text] - Compact the session context.");
        (0, vitest_1.expect)(text).not.toContain("/config");
        (0, vitest_1.expect)(text).not.toContain("/debug");
    });
    (0, vitest_1.it)("includes skill commands when provided", function () {
        var text = (0, status_js_1.buildCommandsMessage)({
            commands: { config: false, debug: false },
        }, [
            {
                name: "demo_skill",
                skillName: "demo-skill",
                description: "Demo skill",
            },
        ]);
        (0, vitest_1.expect)(text).toContain("/demo_skill - Demo skill");
    });
});
(0, vitest_1.describe)("buildHelpMessage", function () {
    (0, vitest_1.it)("hides config/debug when disabled", function () {
        var text = (0, status_js_1.buildHelpMessage)({
            commands: { config: false, debug: false },
        });
        (0, vitest_1.expect)(text).toContain("Skills");
        (0, vitest_1.expect)(text).toContain("/skill <name> [input]");
        (0, vitest_1.expect)(text).not.toContain("/config");
        (0, vitest_1.expect)(text).not.toContain("/debug");
    });
});
(0, vitest_1.describe)("buildCommandsMessagePaginated", function () {
    (0, vitest_1.it)("formats telegram output with pages", function () {
        var result = (0, status_js_1.buildCommandsMessagePaginated)({
            commands: { config: false, debug: false },
        }, undefined, { surface: "telegram", page: 1 });
        (0, vitest_1.expect)(result.text).toContain("ℹ️ Commands (1/");
        (0, vitest_1.expect)(result.text).toContain("Session");
        (0, vitest_1.expect)(result.text).toContain("/stop - Stop the current run.");
    });
    (0, vitest_1.it)("includes plugin commands in the paginated list", function () {
        listPluginCommands.mockReturnValue([
            { name: "plugin_cmd", description: "Plugin command", pluginId: "demo-plugin" },
        ]);
        var result = (0, status_js_1.buildCommandsMessagePaginated)({
            commands: { config: false, debug: false },
        }, undefined, { surface: "telegram", page: 99 });
        (0, vitest_1.expect)(result.text).toContain("Plugins");
        (0, vitest_1.expect)(result.text).toContain("/plugin_cmd (demo-plugin) - Plugin command");
    });
});
