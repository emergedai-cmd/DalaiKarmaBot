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
var utils_js_1 = require("../utils.js");
var monitor_js_1 = require("./monitor.js");
var listeners_js_1 = require("./monitor/listeners.js");
var fakeGuild = function (id, name) { return ({ id: id, name: name }); };
var makeEntries = function (entries) {
    var out = {};
    for (var _i = 0, _a = Object.entries(entries); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        out[key] = {
            slug: value.slug,
            requireMention: value.requireMention,
            reactionNotifications: value.reactionNotifications,
            users: value.users,
            channels: value.channels,
        };
    }
    return out;
};
(0, vitest_1.describe)("registerDiscordListener", function () {
    var FakeListener = /** @class */ (function () {
        function FakeListener() {
        }
        return FakeListener;
    }());
    (0, vitest_1.it)("dedupes listeners by constructor", function () {
        var listeners = [];
        (0, vitest_1.expect)((0, monitor_js_1.registerDiscordListener)(listeners, new FakeListener())).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.registerDiscordListener)(listeners, new FakeListener())).toBe(false);
        (0, vitest_1.expect)(listeners).toHaveLength(1);
    });
});
(0, vitest_1.describe)("DiscordMessageListener", function () {
    (0, vitest_1.it)("returns before the handler finishes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var handlerResolved, resolveHandler, handlerPromise, handler, listener;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handlerResolved = false;
                    resolveHandler = null;
                    handlerPromise = new Promise(function (resolve) {
                        resolveHandler = function () {
                            handlerResolved = true;
                            resolve();
                        };
                    });
                    handler = vitest_1.vi.fn(function () { return handlerPromise; });
                    listener = new listeners_js_1.DiscordMessageListener(handler);
                    return [4 /*yield*/, listener.handle({}, {})];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(handler).toHaveBeenCalledOnce();
                    (0, vitest_1.expect)(handlerResolved).toBe(false);
                    resolveHandler === null || resolveHandler === void 0 ? void 0 : resolveHandler();
                    return [4 /*yield*/, handlerPromise];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs handler failures", function () { return __awaiter(void 0, void 0, void 0, function () {
        var logger, handler, listener;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = {
                        warn: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    handler = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("boom");
                        });
                    }); });
                    listener = new listeners_js_1.DiscordMessageListener(handler, logger);
                    return [4 /*yield*/, listener.handle({}, {})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, utils_js_1.sleep)(0)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(logger.error).toHaveBeenCalledWith(vitest_1.expect.stringContaining("discord handler failed"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs slow handlers after the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveHandler_1, handlerPromise_1, handler, logger, listener, _a, meta;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    vitest_1.vi.setSystemTime(0);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 5, 6]);
                    resolveHandler_1 = null;
                    handlerPromise_1 = new Promise(function (resolve) {
                        resolveHandler_1 = resolve;
                    });
                    handler = vitest_1.vi.fn(function () { return handlerPromise_1; });
                    logger = {
                        warn: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                    };
                    listener = new listeners_js_1.DiscordMessageListener(handler, logger);
                    return [4 /*yield*/, listener.handle({}, {})];
                case 2:
                    _c.sent();
                    vitest_1.vi.setSystemTime(31000);
                    resolveHandler_1 === null || resolveHandler_1 === void 0 ? void 0 : resolveHandler_1();
                    return [4 /*yield*/, handlerPromise_1];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(logger.warn).toHaveBeenCalled();
                    _a = (_b = logger.warn.mock.calls[0]) !== null && _b !== void 0 ? _b : [], meta = _a[1];
                    (0, vitest_1.expect)(meta === null || meta === void 0 ? void 0 : meta.durationMs).toBeGreaterThanOrEqual(30000);
                    return [3 /*break*/, 6];
                case 5:
                    vitest_1.vi.useRealTimers();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("discord allowlist helpers", function () {
    (0, vitest_1.it)("normalizes slugs", function () {
        (0, vitest_1.expect)((0, monitor_js_1.normalizeDiscordSlug)("Friends of OpenClaw")).toBe("friends-of-openclaw");
        (0, vitest_1.expect)((0, monitor_js_1.normalizeDiscordSlug)("#General")).toBe("general");
        (0, vitest_1.expect)((0, monitor_js_1.normalizeDiscordSlug)("Dev__Chat")).toBe("dev-chat");
    });
    (0, vitest_1.it)("matches ids or names", function () {
        var allow = (0, monitor_js_1.normalizeDiscordAllowList)(["123", "steipete", "Friends of OpenClaw"], ["discord:", "user:", "guild:", "channel:"]);
        (0, vitest_1.expect)(allow).not.toBeNull();
        if (!allow) {
            throw new Error("Expected allow list to be normalized");
        }
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { id: "123" })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { name: "steipete" })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { name: "friends-of-openclaw" })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { name: "other" })).toBe(false);
    });
    (0, vitest_1.it)("matches pk-prefixed allowlist entries", function () {
        var allow = (0, monitor_js_1.normalizeDiscordAllowList)(["pk:member-123"], ["discord:", "user:", "pk:"]);
        (0, vitest_1.expect)(allow).not.toBeNull();
        if (!allow) {
            throw new Error("Expected allow list to be normalized");
        }
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { id: "member-123" })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.allowListMatches)(allow, { id: "member-999" })).toBe(false);
    });
});
(0, vitest_1.describe)("discord guild/channel resolution", function () {
    (0, vitest_1.it)("resolves guild entry by id", function () {
        var guildEntries = makeEntries({
            "123": { slug: "friends-of-openclaw" },
        });
        var resolved = (0, monitor_js_1.resolveDiscordGuildEntry)({
            guild: fakeGuild("123", "Friends of OpenClaw"),
            guildEntries: guildEntries,
        });
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.id).toBe("123");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.slug).toBe("friends-of-openclaw");
    });
    (0, vitest_1.it)("resolves guild entry by slug key", function () {
        var guildEntries = makeEntries({
            "friends-of-openclaw": { slug: "friends-of-openclaw" },
        });
        var resolved = (0, monitor_js_1.resolveDiscordGuildEntry)({
            guild: fakeGuild("123", "Friends of OpenClaw"),
            guildEntries: guildEntries,
        });
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.id).toBe("123");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.slug).toBe("friends-of-openclaw");
    });
    (0, vitest_1.it)("falls back to wildcard guild entry", function () {
        var guildEntries = makeEntries({
            "*": { requireMention: false },
        });
        var resolved = (0, monitor_js_1.resolveDiscordGuildEntry)({
            guild: fakeGuild("123", "Friends of OpenClaw"),
            guildEntries: guildEntries,
        });
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.id).toBe("123");
        (0, vitest_1.expect)(resolved === null || resolved === void 0 ? void 0 : resolved.requireMention).toBe(false);
    });
    (0, vitest_1.it)("resolves channel config by slug", function () {
        var guildInfo = {
            channels: {
                general: { allow: true },
                help: {
                    allow: true,
                    requireMention: true,
                    skills: ["search"],
                    enabled: false,
                    users: ["123"],
                    systemPrompt: "Use short answers.",
                    autoThread: true,
                },
            },
        };
        var channel = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "456",
            channelName: "General",
            channelSlug: "general",
        });
        (0, vitest_1.expect)(channel === null || channel === void 0 ? void 0 : channel.allowed).toBe(true);
        (0, vitest_1.expect)(channel === null || channel === void 0 ? void 0 : channel.requireMention).toBeUndefined();
        var help = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "789",
            channelName: "Help",
            channelSlug: "help",
        });
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.allowed).toBe(true);
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.requireMention).toBe(true);
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.skills).toEqual(["search"]);
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.enabled).toBe(false);
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.users).toEqual(["123"]);
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.systemPrompt).toBe("Use short answers.");
        (0, vitest_1.expect)(help === null || help === void 0 ? void 0 : help.autoThread).toBe(true);
    });
    (0, vitest_1.it)("denies channel when config present but no match", function () {
        var guildInfo = {
            channels: {
                general: { allow: true },
            },
        };
        var channel = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "999",
            channelName: "random",
            channelSlug: "random",
        });
        (0, vitest_1.expect)(channel === null || channel === void 0 ? void 0 : channel.allowed).toBe(false);
    });
    (0, vitest_1.it)("inherits parent config for thread channels", function () {
        var guildInfo = {
            channels: {
                general: { allow: true },
                random: { allow: false },
            },
        };
        var thread = (0, monitor_js_1.resolveDiscordChannelConfigWithFallback)({
            guildInfo: guildInfo,
            channelId: "thread-123",
            channelName: "topic",
            channelSlug: "topic",
            parentId: "999",
            parentName: "random",
            parentSlug: "random",
            scope: "thread",
        });
        (0, vitest_1.expect)(thread === null || thread === void 0 ? void 0 : thread.allowed).toBe(false);
    });
    (0, vitest_1.it)("does not match thread name/slug when resolving allowlists", function () {
        var guildInfo = {
            channels: {
                general: { allow: true },
                random: { allow: false },
            },
        };
        var thread = (0, monitor_js_1.resolveDiscordChannelConfigWithFallback)({
            guildInfo: guildInfo,
            channelId: "thread-999",
            channelName: "general",
            channelSlug: "general",
            parentId: "999",
            parentName: "random",
            parentSlug: "random",
            scope: "thread",
        });
        (0, vitest_1.expect)(thread === null || thread === void 0 ? void 0 : thread.allowed).toBe(false);
    });
    (0, vitest_1.it)("applies wildcard channel config when no specific match", function () {
        var guildInfo = {
            channels: {
                general: { allow: true, requireMention: false },
                "*": { allow: true, autoThread: true, requireMention: true },
            },
        };
        // Specific channel should NOT use wildcard
        var general = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "123",
            channelName: "general",
            channelSlug: "general",
        });
        (0, vitest_1.expect)(general === null || general === void 0 ? void 0 : general.allowed).toBe(true);
        (0, vitest_1.expect)(general === null || general === void 0 ? void 0 : general.requireMention).toBe(false);
        (0, vitest_1.expect)(general === null || general === void 0 ? void 0 : general.autoThread).toBeUndefined();
        (0, vitest_1.expect)(general === null || general === void 0 ? void 0 : general.matchSource).toBe("direct");
        // Unknown channel should use wildcard
        var random = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "999",
            channelName: "random",
            channelSlug: "random",
        });
        (0, vitest_1.expect)(random === null || random === void 0 ? void 0 : random.allowed).toBe(true);
        (0, vitest_1.expect)(random === null || random === void 0 ? void 0 : random.autoThread).toBe(true);
        (0, vitest_1.expect)(random === null || random === void 0 ? void 0 : random.requireMention).toBe(true);
        (0, vitest_1.expect)(random === null || random === void 0 ? void 0 : random.matchSource).toBe("wildcard");
    });
    (0, vitest_1.it)("falls back to wildcard when thread channel and parent are missing", function () {
        var guildInfo = {
            channels: {
                "*": { allow: true, requireMention: false },
            },
        };
        var thread = (0, monitor_js_1.resolveDiscordChannelConfigWithFallback)({
            guildInfo: guildInfo,
            channelId: "thread-123",
            channelName: "topic",
            channelSlug: "topic",
            parentId: "parent-999",
            parentName: "general",
            parentSlug: "general",
            scope: "thread",
        });
        (0, vitest_1.expect)(thread === null || thread === void 0 ? void 0 : thread.allowed).toBe(true);
        (0, vitest_1.expect)(thread === null || thread === void 0 ? void 0 : thread.matchKey).toBe("*");
        (0, vitest_1.expect)(thread === null || thread === void 0 ? void 0 : thread.matchSource).toBe("wildcard");
    });
});
(0, vitest_1.describe)("discord mention gating", function () {
    (0, vitest_1.it)("requires mention by default", function () {
        var guildInfo = {
            requireMention: true,
            channels: {
                general: { allow: true },
            },
        };
        var channelConfig = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "1",
            channelName: "General",
            channelSlug: "general",
        });
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: true,
            isThread: false,
            channelConfig: channelConfig,
            guildInfo: guildInfo,
        })).toBe(true);
    });
    (0, vitest_1.it)("does not require mention inside autoThread threads", function () {
        var guildInfo = {
            requireMention: true,
            channels: {
                general: { allow: true, autoThread: true },
            },
        };
        var channelConfig = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "1",
            channelName: "General",
            channelSlug: "general",
        });
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: true,
            isThread: true,
            botId: "bot123",
            threadOwnerId: "bot123",
            channelConfig: channelConfig,
            guildInfo: guildInfo,
        })).toBe(false);
    });
    (0, vitest_1.it)("requires mention inside user-created threads with autoThread enabled", function () {
        var guildInfo = {
            requireMention: true,
            channels: {
                general: { allow: true, autoThread: true },
            },
        };
        var channelConfig = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "1",
            channelName: "General",
            channelSlug: "general",
        });
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: true,
            isThread: true,
            botId: "bot123",
            threadOwnerId: "user456",
            channelConfig: channelConfig,
            guildInfo: guildInfo,
        })).toBe(true);
    });
    (0, vitest_1.it)("requires mention when thread owner is unknown", function () {
        var guildInfo = {
            requireMention: true,
            channels: {
                general: { allow: true, autoThread: true },
            },
        };
        var channelConfig = (0, monitor_js_1.resolveDiscordChannelConfig)({
            guildInfo: guildInfo,
            channelId: "1",
            channelName: "General",
            channelSlug: "general",
        });
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: true,
            isThread: true,
            botId: "bot123",
            channelConfig: channelConfig,
            guildInfo: guildInfo,
        })).toBe(true);
    });
    (0, vitest_1.it)("inherits parent channel mention rules for threads", function () {
        var guildInfo = {
            requireMention: true,
            channels: {
                "parent-1": { allow: true, requireMention: false },
            },
        };
        var channelConfig = (0, monitor_js_1.resolveDiscordChannelConfigWithFallback)({
            guildInfo: guildInfo,
            channelId: "thread-1",
            channelName: "topic",
            channelSlug: "topic",
            parentId: "parent-1",
            parentName: "Parent",
            parentSlug: "parent",
            scope: "thread",
        });
        (0, vitest_1.expect)(channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.matchSource).toBe("parent");
        (0, vitest_1.expect)(channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.matchKey).toBe("parent-1");
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordShouldRequireMention)({
            isGuildMessage: true,
            isThread: true,
            channelConfig: channelConfig,
            guildInfo: guildInfo,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("discord groupPolicy gating", function () {
    (0, vitest_1.it)("allows when policy is open", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "open",
            guildAllowlisted: false,
            channelAllowlistConfigured: false,
            channelAllowed: false,
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks when policy is disabled", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "disabled",
            guildAllowlisted: true,
            channelAllowlistConfigured: true,
            channelAllowed: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("blocks allowlist when guild is not allowlisted", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "allowlist",
            guildAllowlisted: false,
            channelAllowlistConfigured: false,
            channelAllowed: true,
        })).toBe(false);
    });
    (0, vitest_1.it)("allows allowlist when guild allowlisted but no channel allowlist", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "allowlist",
            guildAllowlisted: true,
            channelAllowlistConfigured: false,
            channelAllowed: true,
        })).toBe(true);
    });
    (0, vitest_1.it)("allows allowlist when channel is allowed", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "allowlist",
            guildAllowlisted: true,
            channelAllowlistConfigured: true,
            channelAllowed: true,
        })).toBe(true);
    });
    (0, vitest_1.it)("blocks allowlist when channel is not allowed", function () {
        (0, vitest_1.expect)((0, monitor_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy: "allowlist",
            guildAllowlisted: true,
            channelAllowlistConfigured: true,
            channelAllowed: false,
        })).toBe(false);
    });
});
(0, vitest_1.describe)("discord group DM gating", function () {
    (0, vitest_1.it)("allows all when no allowlist", function () {
        (0, vitest_1.expect)((0, monitor_js_1.resolveGroupDmAllow)({
            channels: undefined,
            channelId: "1",
            channelName: "dm",
            channelSlug: "dm",
        })).toBe(true);
    });
    (0, vitest_1.it)("matches group DM allowlist", function () {
        (0, vitest_1.expect)((0, monitor_js_1.resolveGroupDmAllow)({
            channels: ["openclaw-dm"],
            channelId: "1",
            channelName: "OpenClaw DM",
            channelSlug: "openclaw-dm",
        })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.resolveGroupDmAllow)({
            channels: ["openclaw-dm"],
            channelId: "1",
            channelName: "Other",
            channelSlug: "other",
        })).toBe(false);
    });
});
(0, vitest_1.describe)("discord reply target selection", function () {
    (0, vitest_1.it)("skips replies when mode is off", function () {
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordReplyTarget)({
            replyToMode: "off",
            replyToId: "123",
            hasReplied: false,
        })).toBeUndefined();
    });
    (0, vitest_1.it)("replies only once when mode is first", function () {
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordReplyTarget)({
            replyToMode: "first",
            replyToId: "123",
            hasReplied: false,
        })).toBe("123");
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordReplyTarget)({
            replyToMode: "first",
            replyToId: "123",
            hasReplied: true,
        })).toBeUndefined();
    });
    (0, vitest_1.it)("replies on every message when mode is all", function () {
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordReplyTarget)({
            replyToMode: "all",
            replyToId: "123",
            hasReplied: false,
        })).toBe("123");
        (0, vitest_1.expect)((0, monitor_js_1.resolveDiscordReplyTarget)({
            replyToMode: "all",
            replyToId: "123",
            hasReplied: true,
        })).toBe("123");
    });
});
(0, vitest_1.describe)("discord autoThread name sanitization", function () {
    (0, vitest_1.it)("strips mentions and collapses whitespace", function () {
        var name = (0, monitor_js_1.sanitizeDiscordThreadName)("  <@123>  <@&456> <#789>  Help   here  ", "msg-1");
        (0, vitest_1.expect)(name).toBe("Help here");
    });
    (0, vitest_1.it)("falls back to thread + id when empty after cleaning", function () {
        var name = (0, monitor_js_1.sanitizeDiscordThreadName)("   <@123>", "abc");
        (0, vitest_1.expect)(name).toBe("Thread abc");
    });
});
(0, vitest_1.describe)("discord reaction notification gating", function () {
    (0, vitest_1.it)("defaults to own when mode is unset", function () {
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: undefined,
            botId: "bot-1",
            messageAuthorId: "bot-1",
            userId: "user-1",
        })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: undefined,
            botId: "bot-1",
            messageAuthorId: "user-1",
            userId: "user-2",
        })).toBe(false);
    });
    (0, vitest_1.it)("skips when mode is off", function () {
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "off",
            botId: "bot-1",
            messageAuthorId: "bot-1",
            userId: "user-1",
        })).toBe(false);
    });
    (0, vitest_1.it)("allows all reactions when mode is all", function () {
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "all",
            botId: "bot-1",
            messageAuthorId: "user-1",
            userId: "user-2",
        })).toBe(true);
    });
    (0, vitest_1.it)("requires bot ownership when mode is own", function () {
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "own",
            botId: "bot-1",
            messageAuthorId: "bot-1",
            userId: "user-2",
        })).toBe(true);
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "own",
            botId: "bot-1",
            messageAuthorId: "user-2",
            userId: "user-3",
        })).toBe(false);
    });
    (0, vitest_1.it)("requires allowlist matches when mode is allowlist", function () {
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "allowlist",
            botId: "bot-1",
            messageAuthorId: "user-1",
            userId: "user-2",
            allowlist: [],
        })).toBe(false);
        (0, vitest_1.expect)((0, monitor_js_1.shouldEmitDiscordReactionNotification)({
            mode: "allowlist",
            botId: "bot-1",
            messageAuthorId: "user-1",
            userId: "123",
            userName: "steipete",
            allowlist: ["123", "other"],
        })).toBe(true);
    });
});
(0, vitest_1.describe)("discord media payload", function () {
    (0, vitest_1.it)("preserves attachment order for MediaPaths/MediaUrls", function () {
        var payload = (0, monitor_js_1.buildDiscordMediaPayload)([
            { path: "/tmp/a.png", contentType: "image/png" },
            { path: "/tmp/b.png", contentType: "image/png" },
            { path: "/tmp/c.png", contentType: "image/png" },
        ]);
        (0, vitest_1.expect)(payload.MediaPath).toBe("/tmp/a.png");
        (0, vitest_1.expect)(payload.MediaUrl).toBe("/tmp/a.png");
        (0, vitest_1.expect)(payload.MediaType).toBe("image/png");
        (0, vitest_1.expect)(payload.MediaPaths).toEqual(["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"]);
        (0, vitest_1.expect)(payload.MediaUrls).toEqual(["/tmp/a.png", "/tmp/b.png", "/tmp/c.png"]);
    });
});
