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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsCapabilitiesCommand = channelsCapabilitiesCommand;
var helpers_js_1 = require("../../channels/plugins/helpers.js");
var index_js_1 = require("../../channels/plugins/index.js");
var send_js_1 = require("../../discord/send.js");
var targets_js_1 = require("../../discord/targets.js");
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var scopes_js_1 = require("../../slack/scopes.js");
var theme_js_1 = require("../../terminal/theme.js");
var shared_js_1 = require("./shared.js");
var REQUIRED_DISCORD_PERMISSIONS = ["ViewChannel", "SendMessages"];
var TEAMS_GRAPH_PERMISSION_HINTS = {
    "ChannelMessage.Read.All": "channel history",
    "Chat.Read.All": "chat history",
    "Channel.ReadBasic.All": "channel list",
    "Team.ReadBasic.All": "team list",
    "TeamsActivity.Read.All": "teams activity",
    "Sites.Read.All": "files (SharePoint)",
    "Files.Read.All": "files (OneDrive)",
};
function normalizeTimeout(raw, fallback) {
    if (fallback === void 0) { fallback = 10000; }
    var value = typeof raw === "string" ? Number(raw) : Number(raw);
    if (!Number.isFinite(value) || value <= 0) {
        return fallback;
    }
    return value;
}
function formatSupport(capabilities) {
    var _a;
    if (!capabilities) {
        return "unknown";
    }
    var bits = [];
    if ((_a = capabilities.chatTypes) === null || _a === void 0 ? void 0 : _a.length) {
        bits.push("chatTypes=".concat(capabilities.chatTypes.join(",")));
    }
    if (capabilities.polls) {
        bits.push("polls");
    }
    if (capabilities.reactions) {
        bits.push("reactions");
    }
    if (capabilities.edit) {
        bits.push("edit");
    }
    if (capabilities.unsend) {
        bits.push("unsend");
    }
    if (capabilities.reply) {
        bits.push("reply");
    }
    if (capabilities.effects) {
        bits.push("effects");
    }
    if (capabilities.groupManagement) {
        bits.push("groupManagement");
    }
    if (capabilities.threads) {
        bits.push("threads");
    }
    if (capabilities.media) {
        bits.push("media");
    }
    if (capabilities.nativeCommands) {
        bits.push("nativeCommands");
    }
    if (capabilities.blockStreaming) {
        bits.push("blockStreaming");
    }
    return bits.length ? bits.join(" ") : "none";
}
function summarizeDiscordTarget(raw) {
    if (!raw) {
        return undefined;
    }
    var target = (0, targets_js_1.parseDiscordTarget)(raw, { defaultKind: "channel" });
    if (!target) {
        return { raw: raw };
    }
    if (target.kind === "channel") {
        return {
            raw: raw,
            normalized: target.normalized,
            kind: "channel",
            channelId: target.id,
        };
    }
    if (target.kind === "user") {
        return {
            raw: raw,
            normalized: target.normalized,
            kind: "user",
        };
    }
    return { raw: raw, normalized: target.normalized };
}
function formatDiscordIntents(intents) {
    var _a, _b, _c;
    if (!intents) {
        return "unknown";
    }
    return [
        "messageContent=".concat((_a = intents.messageContent) !== null && _a !== void 0 ? _a : "unknown"),
        "guildMembers=".concat((_b = intents.guildMembers) !== null && _b !== void 0 ? _b : "unknown"),
        "presence=".concat((_c = intents.presence) !== null && _c !== void 0 ? _c : "unknown"),
    ].join(" ");
}
function formatProbeLines(channelId, probe) {
    var _a, _b;
    var lines = [];
    if (!probe || typeof probe !== "object") {
        return lines;
    }
    var probeObj = probe;
    if (channelId === "discord") {
        var bot = probeObj.bot;
        if (bot === null || bot === void 0 ? void 0 : bot.username) {
            var botId = bot.id ? " (".concat(bot.id, ")") : "";
            lines.push("Bot: ".concat(theme_js_1.theme.accent("@".concat(bot.username))).concat(botId));
        }
        var app = probeObj.application;
        if (app === null || app === void 0 ? void 0 : app.intents) {
            lines.push("Intents: ".concat(formatDiscordIntents(app.intents)));
        }
    }
    if (channelId === "telegram") {
        var bot = probeObj.bot;
        if (bot === null || bot === void 0 ? void 0 : bot.username) {
            var botId = bot.id ? " (".concat(bot.id, ")") : "";
            lines.push("Bot: ".concat(theme_js_1.theme.accent("@".concat(bot.username))).concat(botId));
        }
        var flags = [];
        var canJoinGroups = bot === null || bot === void 0 ? void 0 : bot.canJoinGroups;
        var canReadAll = bot === null || bot === void 0 ? void 0 : bot.canReadAllGroupMessages;
        var inlineQueries = bot === null || bot === void 0 ? void 0 : bot.supportsInlineQueries;
        if (typeof canJoinGroups === "boolean") {
            flags.push("joinGroups=".concat(canJoinGroups));
        }
        if (typeof canReadAll === "boolean") {
            flags.push("readAllGroupMessages=".concat(canReadAll));
        }
        if (typeof inlineQueries === "boolean") {
            flags.push("inlineQueries=".concat(inlineQueries));
        }
        if (flags.length > 0) {
            lines.push("Flags: ".concat(flags.join(" ")));
        }
        var webhook = probeObj.webhook;
        if ((webhook === null || webhook === void 0 ? void 0 : webhook.url) !== undefined) {
            lines.push("Webhook: ".concat(webhook.url || "none"));
        }
    }
    if (channelId === "slack") {
        var bot = probeObj.bot;
        var team = probeObj.team;
        if (bot === null || bot === void 0 ? void 0 : bot.name) {
            lines.push("Bot: ".concat(theme_js_1.theme.accent("@".concat(bot.name))));
        }
        if ((team === null || team === void 0 ? void 0 : team.name) || (team === null || team === void 0 ? void 0 : team.id)) {
            var id = (team === null || team === void 0 ? void 0 : team.id) ? " (".concat(team.id, ")") : "";
            lines.push("Team: ".concat((_a = team === null || team === void 0 ? void 0 : team.name) !== null && _a !== void 0 ? _a : "unknown").concat(id));
        }
    }
    if (channelId === "signal") {
        var version = probeObj.version;
        if (version) {
            lines.push("Signal daemon: ".concat(version));
        }
    }
    if (channelId === "msteams") {
        var appId = typeof probeObj.appId === "string" ? probeObj.appId.trim() : "";
        if (appId) {
            lines.push("App: ".concat(theme_js_1.theme.accent(appId)));
        }
        var graph = probeObj.graph;
        if (graph) {
            var roles = Array.isArray(graph.roles)
                ? graph.roles.map(function (role) { return String(role).trim(); }).filter(Boolean)
                : [];
            var scopes = typeof graph.scopes === "string"
                ? graph.scopes
                    .split(/\s+/)
                    .map(function (scope) { return scope.trim(); })
                    .filter(Boolean)
                : Array.isArray(graph.scopes)
                    ? graph.scopes.map(function (scope) { return String(scope).trim(); }).filter(Boolean)
                    : [];
            if (graph.ok === false) {
                lines.push("Graph: ".concat(theme_js_1.theme.error((_b = graph.error) !== null && _b !== void 0 ? _b : "failed")));
            }
            else if (roles.length > 0 || scopes.length > 0) {
                var formatPermission = function (permission) {
                    var hint = TEAMS_GRAPH_PERMISSION_HINTS[permission];
                    return hint ? "".concat(permission, " (").concat(hint, ")") : permission;
                };
                if (roles.length > 0) {
                    lines.push("Graph roles: ".concat(roles.map(formatPermission).join(", ")));
                }
                if (scopes.length > 0) {
                    lines.push("Graph scopes: ".concat(scopes.map(formatPermission).join(", ")));
                }
            }
            else if (graph.ok === true) {
                lines.push("Graph: ok");
            }
        }
    }
    var ok = typeof probeObj.ok === "boolean" ? probeObj.ok : undefined;
    if (ok === true && lines.length === 0) {
        lines.push("Probe: ok");
    }
    if (ok === false) {
        var error = typeof probeObj.error === "string" && probeObj.error ? " (".concat(probeObj.error, ")") : "";
        lines.push("Probe: ".concat(theme_js_1.theme.error("failed".concat(error))));
    }
    return lines;
}
function buildDiscordPermissions(params) {
    return __awaiter(this, void 0, void 0, function () {
        var target, token, perms_1, missing, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    target = summarizeDiscordTarget((_a = params.target) === null || _a === void 0 ? void 0 : _a.trim());
                    if (!target) {
                        return [2 /*return*/, {}];
                    }
                    if (target.kind !== "channel" || !target.channelId) {
                        return [2 /*return*/, {
                                target: target,
                                report: {
                                    error: "Target looks like a DM user; pass channel:<id> to audit channel permissions.",
                                },
                            }];
                    }
                    token = (_b = params.account.token) === null || _b === void 0 ? void 0 : _b.trim();
                    if (!token) {
                        return [2 /*return*/, {
                                target: target,
                                report: {
                                    channelId: target.channelId,
                                    error: "Discord bot token missing for permission audit.",
                                },
                            }];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, send_js_1.fetchChannelPermissionsDiscord)(target.channelId, {
                            token: token,
                            accountId: (_c = params.account.accountId) !== null && _c !== void 0 ? _c : undefined,
                        })];
                case 2:
                    perms_1 = _d.sent();
                    missing = REQUIRED_DISCORD_PERMISSIONS.filter(function (permission) { return !perms_1.permissions.includes(permission); });
                    return [2 /*return*/, {
                            target: target,
                            report: {
                                channelId: perms_1.channelId,
                                guildId: perms_1.guildId,
                                isDm: perms_1.isDm,
                                channelType: perms_1.channelType,
                                permissions: perms_1.permissions,
                                missingRequired: missing.length ? missing : [],
                                raw: perms_1.raw,
                            },
                        }];
                case 3:
                    err_1 = _d.sent();
                    return [2 /*return*/, {
                            target: target,
                            report: {
                                channelId: target.channelId,
                                error: err_1 instanceof Error ? err_1.message : String(err_1),
                            },
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function resolveChannelReports(params) {
    return __awaiter(this, void 0, void 0, function () {
        var plugin, cfg, timeoutMs, accountIds, reports, listedActions, actions, _i, accountIds_1, accountId, resolvedAccount, configured, _a, enabled, probe, err_2, slackScopes, botToken, userToken, scopeReports, _b, _c, _d, _e, discordTarget, discordPermissions, perms;
        var _f, _g;
        var _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    plugin = params.plugin, cfg = params.cfg, timeoutMs = params.timeoutMs;
                    accountIds = params.accountOverride
                        ? [params.accountOverride]
                        : (function () {
                            var ids = plugin.config.listAccountIds(cfg);
                            return ids.length > 0
                                ? ids
                                : [(0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg, accountIds: ids })];
                        })();
                    reports = [];
                    listedActions = (_k = (_j = (_h = plugin.actions) === null || _h === void 0 ? void 0 : _h.listActions) === null || _j === void 0 ? void 0 : _j.call(_h, { cfg: cfg })) !== null && _k !== void 0 ? _k : [];
                    actions = Array.from(new Set(__spreadArray(["send", "broadcast"], listedActions.map(function (action) { return String(action); }), true)));
                    _i = 0, accountIds_1 = accountIds;
                    _r.label = 1;
                case 1:
                    if (!(_i < accountIds_1.length)) return [3 /*break*/, 18];
                    accountId = accountIds_1[_i];
                    resolvedAccount = plugin.config.resolveAccount(cfg, accountId);
                    if (!plugin.config.isConfigured) return [3 /*break*/, 3];
                    return [4 /*yield*/, plugin.config.isConfigured(resolvedAccount, cfg)];
                case 2:
                    _a = _r.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = Boolean(resolvedAccount);
                    _r.label = 4;
                case 4:
                    configured = _a;
                    enabled = plugin.config.isEnabled
                        ? plugin.config.isEnabled(resolvedAccount, cfg)
                        : resolvedAccount.enabled !== false;
                    probe = void 0;
                    if (!(configured && enabled && ((_l = plugin.status) === null || _l === void 0 ? void 0 : _l.probeAccount))) return [3 /*break*/, 8];
                    _r.label = 5;
                case 5:
                    _r.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, plugin.status.probeAccount({
                            account: resolvedAccount,
                            timeoutMs: timeoutMs,
                            cfg: cfg,
                        })];
                case 6:
                    probe = _r.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _r.sent();
                    probe = { ok: false, error: err_2 instanceof Error ? err_2.message : String(err_2) };
                    return [3 /*break*/, 8];
                case 8:
                    slackScopes = void 0;
                    if (!(plugin.id === "slack" && configured && enabled)) return [3 /*break*/, 14];
                    botToken = (_m = resolvedAccount.botToken) === null || _m === void 0 ? void 0 : _m.trim();
                    userToken = (_p = (_o = resolvedAccount.config) === null || _o === void 0 ? void 0 : _o.userToken) === null || _p === void 0 ? void 0 : _p.trim();
                    scopeReports = [];
                    if (!botToken) return [3 /*break*/, 10];
                    _c = (_b = scopeReports).push;
                    _f = {
                        tokenType: "bot"
                    };
                    return [4 /*yield*/, (0, scopes_js_1.fetchSlackScopes)(botToken, timeoutMs)];
                case 9:
                    _c.apply(_b, [(_f.result = _r.sent(),
                            _f)]);
                    return [3 /*break*/, 11];
                case 10:
                    scopeReports.push({
                        tokenType: "bot",
                        result: { ok: false, error: "Slack bot token missing." },
                    });
                    _r.label = 11;
                case 11:
                    if (!userToken) return [3 /*break*/, 13];
                    _e = (_d = scopeReports).push;
                    _g = {
                        tokenType: "user"
                    };
                    return [4 /*yield*/, (0, scopes_js_1.fetchSlackScopes)(userToken, timeoutMs)];
                case 12:
                    _e.apply(_d, [(_g.result = _r.sent(),
                            _g)]);
                    _r.label = 13;
                case 13:
                    slackScopes = scopeReports;
                    _r.label = 14;
                case 14:
                    discordTarget = void 0;
                    discordPermissions = void 0;
                    if (!(plugin.id === "discord" && params.target)) return [3 /*break*/, 16];
                    return [4 /*yield*/, buildDiscordPermissions({
                            account: resolvedAccount,
                            target: params.target,
                        })];
                case 15:
                    perms = _r.sent();
                    discordTarget = perms.target;
                    discordPermissions = perms.report;
                    _r.label = 16;
                case 16:
                    reports.push({
                        channel: plugin.id,
                        accountId: accountId,
                        accountName: typeof resolvedAccount.name === "string"
                            ? ((_q = resolvedAccount.name) === null || _q === void 0 ? void 0 : _q.trim()) || undefined
                            : undefined,
                        configured: configured,
                        enabled: enabled,
                        support: plugin.capabilities,
                        probe: probe,
                        target: discordTarget,
                        channelPermissions: discordPermissions,
                        actions: actions,
                        slackScopes: slackScopes,
                    });
                    _r.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 1];
                case 18: return [2 /*return*/, reports];
            }
        });
    });
}
function channelsCapabilitiesCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var cfg, timeoutMs, rawChannel, rawTarget, plugins, selected, reports, _i, selected_1, plugin, accountOverride, _a, _b, _c, lines, _d, reports_1, report, label, configuredLabel, enabledLabel, probeLines, _e, _f, entry, source, label_1, perms, list, label_2;
        var _g, _h, _j;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _k.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    timeoutMs = normalizeTimeout(opts.timeout, 10000);
                    rawChannel = typeof opts.channel === "string" ? opts.channel.trim().toLowerCase() : "";
                    rawTarget = typeof opts.target === "string" ? opts.target.trim() : "";
                    if (opts.account && (!rawChannel || rawChannel === "all")) {
                        runtime.error((0, globals_js_1.danger)("--account requires a specific --channel."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (rawTarget && rawChannel !== "discord") {
                        runtime.error((0, globals_js_1.danger)("--target requires --channel discord."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    plugins = (0, index_js_1.listChannelPlugins)();
                    selected = !rawChannel || rawChannel === "all"
                        ? plugins
                        : (function () {
                            var plugin = (0, index_js_1.getChannelPlugin)(rawChannel);
                            if (!plugin) {
                                return null;
                            }
                            return [plugin];
                        })();
                    if (!selected || selected.length === 0) {
                        runtime.error((0, globals_js_1.danger)("Unknown channel \"".concat(rawChannel, "\".")));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    reports = [];
                    _i = 0, selected_1 = selected;
                    _k.label = 2;
                case 2:
                    if (!(_i < selected_1.length)) return [3 /*break*/, 5];
                    plugin = selected_1[_i];
                    accountOverride = ((_g = opts.account) === null || _g === void 0 ? void 0 : _g.trim()) || undefined;
                    _b = (_a = reports.push).apply;
                    _c = [reports];
                    return [4 /*yield*/, resolveChannelReports({
                            plugin: plugin,
                            cfg: cfg,
                            timeoutMs: timeoutMs,
                            accountOverride: accountOverride,
                            target: rawTarget && plugin.id === "discord" ? rawTarget : undefined,
                        })];
                case 3:
                    _b.apply(_a, _c.concat([(_k.sent())]));
                    _k.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (opts.json) {
                        runtime.log(JSON.stringify({ channels: reports }, null, 2));
                        return [2 /*return*/];
                    }
                    lines = [];
                    for (_d = 0, reports_1 = reports; _d < reports_1.length; _d++) {
                        report = reports_1[_d];
                        label = (0, shared_js_1.formatChannelAccountLabel)({
                            channel: report.channel,
                            accountId: report.accountId,
                            name: report.accountName,
                            channelStyle: theme_js_1.theme.accent,
                            accountStyle: theme_js_1.theme.heading,
                        });
                        lines.push(theme_js_1.theme.heading(label));
                        lines.push("Support: ".concat(formatSupport(report.support)));
                        if (report.actions && report.actions.length > 0) {
                            lines.push("Actions: ".concat(report.actions.join(", ")));
                        }
                        if (report.configured === false || report.enabled === false) {
                            configuredLabel = report.configured === false ? "not configured" : "configured";
                            enabledLabel = report.enabled === false ? "disabled" : "enabled";
                            lines.push("Status: ".concat(configuredLabel, ", ").concat(enabledLabel));
                        }
                        probeLines = formatProbeLines(report.channel, report.probe);
                        if (probeLines.length > 0) {
                            lines.push.apply(lines, probeLines);
                        }
                        else if (report.configured && report.enabled) {
                            lines.push(theme_js_1.theme.muted("Probe: unavailable"));
                        }
                        if (report.channel === "slack" && report.slackScopes) {
                            for (_e = 0, _f = report.slackScopes; _e < _f.length; _e++) {
                                entry = _f[_e];
                                source = entry.result.source ? " (".concat(entry.result.source, ")") : "";
                                label_1 = entry.tokenType === "user" ? "User scopes" : "Bot scopes";
                                if (entry.result.ok && ((_h = entry.result.scopes) === null || _h === void 0 ? void 0 : _h.length)) {
                                    lines.push("".concat(label_1).concat(source, ": ").concat(entry.result.scopes.join(", ")));
                                }
                                else if (entry.result.error) {
                                    lines.push("".concat(label_1, ": ").concat(theme_js_1.theme.error(entry.result.error)));
                                }
                            }
                        }
                        if (report.channel === "discord" && report.channelPermissions) {
                            perms = report.channelPermissions;
                            if (perms.error) {
                                lines.push("Permissions: ".concat(theme_js_1.theme.error(perms.error)));
                            }
                            else {
                                list = ((_j = perms.permissions) === null || _j === void 0 ? void 0 : _j.length) ? perms.permissions.join(", ") : "none";
                                label_2 = perms.channelId ? " (".concat(perms.channelId, ")") : "";
                                lines.push("Permissions".concat(label_2, ": ").concat(list));
                                if (perms.missingRequired && perms.missingRequired.length > 0) {
                                    lines.push("".concat(theme_js_1.theme.warn("Missing required:"), " ").concat(perms.missingRequired.join(", ")));
                                }
                                else {
                                    lines.push(theme_js_1.theme.success("Missing required: none"));
                                }
                            }
                        }
                        else if (report.channel === "discord" && rawTarget && !report.channelPermissions) {
                            lines.push(theme_js_1.theme.muted("Permissions: skipped (no target)."));
                        }
                        lines.push("");
                    }
                    runtime.log(lines.join("\n").trimEnd());
                    return [2 /*return*/];
            }
        });
    });
}
