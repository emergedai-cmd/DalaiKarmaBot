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
exports.msteamsPlugin = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var directory_live_js_1 = require("./directory-live.js");
var onboarding_js_1 = require("./onboarding.js");
var outbound_js_1 = require("./outbound.js");
var policy_js_1 = require("./policy.js");
var probe_js_1 = require("./probe.js");
var resolve_allowlist_js_1 = require("./resolve-allowlist.js");
var send_js_1 = require("./send.js");
var token_js_1 = require("./token.js");
var meta = {
    id: "msteams",
    label: "Microsoft Teams",
    selectionLabel: "Microsoft Teams (Bot Framework)",
    docsPath: "/channels/msteams",
    docsLabel: "msteams",
    blurb: "Bot Framework; enterprise support.",
    aliases: ["teams"],
    order: 60,
};
exports.msteamsPlugin = {
    id: "msteams",
    meta: __assign({}, meta),
    onboarding: onboarding_js_1.msteamsOnboardingAdapter,
    pairing: {
        idLabel: "msteamsUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(msteams|user):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, send_js_1.sendMessageMSTeams)({
                            cfg: cfg,
                            to: id,
                            text: plugin_sdk_1.PAIRING_APPROVED_MESSAGE,
                        })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    capabilities: {
        chatTypes: ["direct", "channel", "thread"],
        polls: true,
        threads: true,
        media: true,
    },
    agentPrompt: {
        messageToolHints: function () { return [
            "- Adaptive Cards supported. Use `action=send` with `card={type,version,body}` to send rich cards.",
            "- MSTeams targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:ID` or `user:Display Name` (requires Graph API) for DMs, `conversation:19:...@thread.tacv2` for groups/channels. Prefer IDs over display names for speed.",
        ]; },
    },
    threading: {
        buildToolContext: function (_a) {
            var _b;
            var context = _a.context, hasRepliedRef = _a.hasRepliedRef;
            return ({
                currentChannelId: ((_b = context.To) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                currentThreadTs: context.ReplyToId,
                hasRepliedRef: hasRepliedRef,
            });
        },
    },
    groups: {
        resolveToolPolicy: policy_js_1.resolveMSTeamsGroupToolPolicy,
    },
    reload: { configPrefixes: ["channels.msteams"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(plugin_sdk_1.MSTeamsConfigSchema),
    config: {
        listAccountIds: function () { return [plugin_sdk_1.DEFAULT_ACCOUNT_ID]; },
        resolveAccount: function (cfg) {
            var _a, _b, _c;
            return ({
                accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
                enabled: ((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.enabled) !== false,
                configured: Boolean((0, token_js_1.resolveMSTeamsCredentials)((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.msteams)),
            });
        },
        defaultAccountId: function () { return plugin_sdk_1.DEFAULT_ACCOUNT_ID; },
        setAccountEnabled: function (_a) {
            var _b;
            var cfg = _a.cfg, enabled = _a.enabled;
            return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams), { enabled: enabled }) }) }));
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg;
            var next = __assign({}, cfg);
            var nextChannels = __assign({}, cfg.channels);
            delete nextChannels.msteams;
            if (Object.keys(nextChannels).length > 0) {
                next.channels = nextChannels;
            }
            else {
                delete next.channels;
            }
            return next;
        },
        isConfigured: function (_account, cfg) { var _a; return Boolean((0, token_js_1.resolveMSTeamsCredentials)((_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams)); },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            enabled: account.enabled,
            configured: account.configured,
        }); },
        resolveAllowFrom: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (_d = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams) === null || _c === void 0 ? void 0 : _c.allowFrom) !== null && _d !== void 0 ? _d : [];
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        collectWarnings: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg;
            var defaultGroupPolicy = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.defaults) === null || _c === void 0 ? void 0 : _c.groupPolicy;
            var groupPolicy = (_g = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.msteams) === null || _e === void 0 ? void 0 : _e.groupPolicy) !== null && _f !== void 0 ? _f : defaultGroupPolicy) !== null && _g !== void 0 ? _g : "allowlist";
            if (groupPolicy !== "open") {
                return [];
            }
            return [
                "- MS Teams groups: groupPolicy=\"open\" allows any member to trigger (mention-gated). Set channels.msteams.groupPolicy=\"allowlist\" + channels.msteams.groupAllowFrom to restrict senders.",
            ];
        },
    },
    setup: {
        resolveAccountId: function () { return plugin_sdk_1.DEFAULT_ACCOUNT_ID; },
        applyAccountConfig: function (_a) {
            var _b;
            var cfg = _a.cfg;
            return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams), { enabled: true }) }) }));
        },
    },
    messaging: {
        normalizeTarget: resolve_allowlist_js_1.normalizeMSTeamsMessagingTarget,
        targetResolver: {
            looksLikeId: function (raw) {
                var trimmed = raw.trim();
                if (!trimmed) {
                    return false;
                }
                if (/^conversation:/i.test(trimmed)) {
                    return true;
                }
                if (/^user:/i.test(trimmed)) {
                    // Only treat as ID if the value after user: looks like a UUID
                    var id = trimmed.slice("user:".length).trim();
                    return /^[0-9a-fA-F-]{16,}$/.test(id);
                }
                return trimmed.includes("@thread");
            },
            hint: "<conversationId|user:ID|conversation:ID>",
        },
    },
    directory: {
        self: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
        listPeers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var q, ids, _i, _c, entry, trimmed, _d, _e, userId, trimmed;
            var _f, _g, _h, _j, _k, _l;
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_m) {
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                ids = new Set();
                for (_i = 0, _c = (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.msteams) === null || _g === void 0 ? void 0 : _g.allowFrom) !== null && _h !== void 0 ? _h : []; _i < _c.length; _i++) {
                    entry = _c[_i];
                    trimmed = String(entry).trim();
                    if (trimmed && trimmed !== "*") {
                        ids.add(trimmed);
                    }
                }
                for (_d = 0, _e = Object.keys((_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.msteams) === null || _k === void 0 ? void 0 : _k.dms) !== null && _l !== void 0 ? _l : {}); _d < _e.length; _d++) {
                    userId = _e[_d];
                    trimmed = userId.trim();
                    if (trimmed) {
                        ids.add(trimmed);
                    }
                }
                return [2 /*return*/, Array.from(ids)
                        .map(function (raw) { return raw.trim(); })
                        .filter(Boolean)
                        .map(function (raw) { var _a; return (_a = (0, resolve_allowlist_js_1.normalizeMSTeamsMessagingTarget)(raw)) !== null && _a !== void 0 ? _a : raw; })
                        .map(function (raw) {
                        var lowered = raw.toLowerCase();
                        if (lowered.startsWith("user:")) {
                            return raw;
                        }
                        if (lowered.startsWith("conversation:")) {
                            return raw;
                        }
                        return "user:".concat(raw);
                    })
                        .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                        .slice(0, limit && limit > 0 ? limit : undefined)
                        .map(function (id) { return ({ kind: "user", id: id }); })];
            });
        }); },
        listGroups: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var q, ids, _i, _c, team, _d, _e, channelId, trimmed;
            var _f, _g, _h, _j;
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_k) {
                q = (query === null || query === void 0 ? void 0 : query.trim().toLowerCase()) || "";
                ids = new Set();
                for (_i = 0, _c = Object.values((_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.msteams) === null || _g === void 0 ? void 0 : _g.teams) !== null && _h !== void 0 ? _h : {}); _i < _c.length; _i++) {
                    team = _c[_i];
                    for (_d = 0, _e = Object.keys((_j = team.channels) !== null && _j !== void 0 ? _j : {}); _d < _e.length; _d++) {
                        channelId = _e[_d];
                        trimmed = channelId.trim();
                        if (trimmed && trimmed !== "*") {
                            ids.add(trimmed);
                        }
                    }
                }
                return [2 /*return*/, Array.from(ids)
                        .map(function (raw) { return raw.trim(); })
                        .filter(Boolean)
                        .map(function (raw) { return raw.replace(/^conversation:/i, "").trim(); })
                        .map(function (id) { return "conversation:".concat(id); })
                        .filter(function (id) { return (q ? id.toLowerCase().includes(q) : true); })
                        .slice(0, limit && limit > 0 ? limit : undefined)
                        .map(function (id) { return ({ kind: "group", id: id }); })];
            });
        }); },
        listPeersLive: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, directory_live_js_1.listMSTeamsDirectoryPeersLive)({ cfg: cfg, query: query, limit: limit })];
            });
        }); },
        listGroupsLive: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var cfg = _b.cfg, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, directory_live_js_1.listMSTeamsDirectoryGroupsLive)({ cfg: cfg, query: query, limit: limit })];
            });
        }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var results, stripPrefix, pending_1, resolved, err_1, pending, resolved, err_2;
            var _c, _d;
            var cfg = _b.cfg, inputs = _b.inputs, kind = _b.kind, runtime = _b.runtime;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        results = inputs.map(function (input) { return ({
                            input: input,
                            resolved: false,
                            id: undefined,
                            name: undefined,
                            note: undefined,
                        }); });
                        stripPrefix = function (value) { return (0, resolve_allowlist_js_1.normalizeMSTeamsUserInput)(value); };
                        if (!(kind === "user")) return [3 /*break*/, 5];
                        pending_1 = [];
                        results.forEach(function (entry, index) {
                            var trimmed = entry.input.trim();
                            if (!trimmed) {
                                entry.note = "empty input";
                                return;
                            }
                            var cleaned = stripPrefix(trimmed);
                            if (/^[0-9a-fA-F-]{16,}$/.test(cleaned) || cleaned.includes("@")) {
                                entry.resolved = true;
                                entry.id = cleaned;
                                return;
                            }
                            pending_1.push({ input: entry.input, query: cleaned, index: index });
                        });
                        if (!(pending_1.length > 0)) return [3 /*break*/, 4];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsUserAllowlist)({
                                cfg: cfg,
                                entries: pending_1.map(function (entry) { return entry.query; }),
                            })];
                    case 2:
                        resolved = _e.sent();
                        resolved.forEach(function (entry, idx) {
                            var _a, _b;
                            var target = results[(_b = (_a = pending_1[idx]) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1];
                            if (!target) {
                                return;
                            }
                            target.resolved = entry.resolved;
                            target.id = entry.id;
                            target.name = entry.name;
                            target.note = entry.note;
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _e.sent();
                        (_c = runtime.error) === null || _c === void 0 ? void 0 : _c.call(runtime, "msteams resolve failed: ".concat(String(err_1)));
                        pending_1.forEach(function (_a) {
                            var index = _a.index;
                            var entry = results[index];
                            if (entry) {
                                entry.note = "lookup failed";
                            }
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, results];
                    case 5:
                        pending = [];
                        results.forEach(function (entry, index) {
                            var trimmed = entry.input.trim();
                            if (!trimmed) {
                                entry.note = "empty input";
                                return;
                            }
                            var conversationId = (0, resolve_allowlist_js_1.parseMSTeamsConversationId)(trimmed);
                            if (conversationId !== null) {
                                entry.resolved = Boolean(conversationId);
                                entry.id = conversationId || undefined;
                                entry.note = conversationId ? "conversation id" : "empty conversation id";
                                return;
                            }
                            var parsed = (0, resolve_allowlist_js_1.parseMSTeamsTeamChannelInput)(trimmed);
                            if (!parsed.team) {
                                entry.note = "missing team";
                                return;
                            }
                            var query = parsed.channel ? "".concat(parsed.team, "/").concat(parsed.channel) : parsed.team;
                            pending.push({ input: entry.input, query: query, index: index });
                        });
                        if (!(pending.length > 0)) return [3 /*break*/, 9];
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsChannelAllowlist)({
                                cfg: cfg,
                                entries: pending.map(function (entry) { return entry.query; }),
                            })];
                    case 7:
                        resolved = _e.sent();
                        resolved.forEach(function (entry, idx) {
                            var _a, _b, _c;
                            var target = results[(_b = (_a = pending[idx]) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1];
                            if (!target) {
                                return;
                            }
                            if (!entry.resolved || !entry.teamId) {
                                target.resolved = false;
                                target.note = entry.note;
                                return;
                            }
                            target.resolved = true;
                            if (entry.channelId) {
                                target.id = "".concat(entry.teamId, "/").concat(entry.channelId);
                                target.name =
                                    entry.channelName && entry.teamName
                                        ? "".concat(entry.teamName, "/").concat(entry.channelName)
                                        : ((_c = entry.channelName) !== null && _c !== void 0 ? _c : entry.teamName);
                            }
                            else {
                                target.id = entry.teamId;
                                target.name = entry.teamName;
                                target.note = "team id";
                            }
                            if (entry.note) {
                                target.note = entry.note;
                            }
                        });
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _e.sent();
                        (_d = runtime.error) === null || _d === void 0 ? void 0 : _d.call(runtime, "msteams resolve failed: ".concat(String(err_2)));
                        pending.forEach(function (_a) {
                            var index = _a.index;
                            var entry = results[index];
                            if (entry) {
                                entry.note = "lookup failed";
                            }
                        });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, results];
                }
            });
        }); },
    },
    actions: {
        listActions: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            var enabled = ((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams) === null || _c === void 0 ? void 0 : _c.enabled) !== false &&
                Boolean((0, token_js_1.resolveMSTeamsCredentials)((_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.msteams));
            if (!enabled) {
                return [];
            }
            return ["poll"];
        },
        supportsCards: function (_a) {
            var _b, _c, _d;
            var cfg = _a.cfg;
            return (((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.msteams) === null || _c === void 0 ? void 0 : _c.enabled) !== false &&
                Boolean((0, token_js_1.resolveMSTeamsCredentials)((_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.msteams)));
        },
        handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var card, to, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(ctx.action === "send" && ctx.params.card)) return [3 /*break*/, 2];
                        card = ctx.params.card;
                        to = typeof ctx.params.to === "string"
                            ? ctx.params.to.trim()
                            : typeof ctx.params.target === "string"
                                ? ctx.params.target.trim()
                                : "";
                        if (!to) {
                            return [2 /*return*/, {
                                    isError: true,
                                    content: [{ type: "text", text: "Card send requires a target (to)." }],
                                }];
                        }
                        return [4 /*yield*/, (0, send_js_1.sendAdaptiveCardMSTeams)({
                                cfg: ctx.cfg,
                                to: to,
                                card: card,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify({
                                            ok: true,
                                            channel: "msteams",
                                            messageId: result.messageId,
                                            conversationId: result.conversationId,
                                        }),
                                    },
                                ],
                            }];
                    case 2: 
                    // Return null to fall through to default handler
                    return [2 /*return*/, null];
                }
            });
        }); },
    },
    outbound: outbound_js_1.msteamsOutbound,
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
            port: null,
        },
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                running: (_c = snapshot.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = snapshot.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = snapshot.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = snapshot.lastError) !== null && _f !== void 0 ? _f : null,
                port: (_g = snapshot.port) !== null && _g !== void 0 ? _g : null,
                probe: snapshot.probe,
                lastProbeAt: (_h = snapshot.lastProbeAt) !== null && _h !== void 0 ? _h : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c;
            var cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, probe_js_1.probeMSTeams)((_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.msteams)];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        }); },
        buildAccountSnapshot: function (_a) {
            var _b, _c, _d, _e, _f;
            var account = _a.account, runtime = _a.runtime, probe = _a.probe;
            return ({
                accountId: account.accountId,
                enabled: account.enabled,
                configured: account.configured,
                running: (_b = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _b !== void 0 ? _b : false,
                lastStartAt: (_c = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _c !== void 0 ? _c : null,
                lastStopAt: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _d !== void 0 ? _d : null,
                lastError: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _e !== void 0 ? _e : null,
                port: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.port) !== null && _f !== void 0 ? _f : null,
                probe: probe,
            });
        },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var monitorMSTeamsProvider, port;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./index.js"); })];
                    case 1:
                        monitorMSTeamsProvider = (_f.sent()).monitorMSTeamsProvider;
                        port = (_d = (_c = (_b = (_a = ctx.cfg.channels) === null || _a === void 0 ? void 0 : _a.msteams) === null || _b === void 0 ? void 0 : _b.webhook) === null || _c === void 0 ? void 0 : _c.port) !== null && _d !== void 0 ? _d : 3978;
                        ctx.setStatus({ accountId: ctx.accountId, port: port });
                        (_e = ctx.log) === null || _e === void 0 ? void 0 : _e.info("starting provider (port ".concat(port, ")"));
                        return [2 /*return*/, monitorMSTeamsProvider({
                                cfg: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                            })];
                }
            });
        }); },
    },
};
