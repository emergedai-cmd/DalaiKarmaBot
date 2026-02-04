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
exports.monitorMSTeamsProvider = monitorMSTeamsProvider;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var conversation_store_fs_js_1 = require("./conversation-store-fs.js");
var errors_js_1 = require("./errors.js");
var monitor_handler_js_1 = require("./monitor-handler.js");
var polls_js_1 = require("./polls.js");
var resolve_allowlist_js_1 = require("./resolve-allowlist.js");
var runtime_js_1 = require("./runtime.js");
var sdk_js_1 = require("./sdk.js");
var token_js_1 = require("./token.js");
function monitorMSTeamsProvider(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var core, log, cfg, msteamsCfg, creds, appId, runtime, allowFrom, groupAllowFrom, teamsConfig, cleanAllowEntry, resolveAllowlistUsers, allowEntries, additions, groupEntries, additions, entries_1, _i, _a, _b, teamKey, teamCfg, channels, channelKeys, _c, channelKeys_1, channelKey, resolved, mapping_1, unresolved_1, nextTeams_1, err_1, port, textLimit, MB, agentDefaults, mediaMaxBytes, conversationStore, pollStore, express, _d, sdk, authConfig, ActivityHandler, MsalTokenProvider, authorizeJWT, tokenProvider, adapter, handler, expressApp, configuredPath, messageHandler, httpServer, shutdown;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    core = (0, runtime_js_1.getMSTeamsRuntime)();
                    log = core.logging.getChildLogger({ name: "msteams" });
                    cfg = opts.cfg;
                    msteamsCfg = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.msteams;
                    if (!(msteamsCfg === null || msteamsCfg === void 0 ? void 0 : msteamsCfg.enabled)) {
                        log.debug("msteams provider disabled");
                        return [2 /*return*/, { app: null, shutdown: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); } }];
                    }
                    creds = (0, token_js_1.resolveMSTeamsCredentials)(msteamsCfg);
                    if (!creds) {
                        log.error("msteams credentials not configured");
                        return [2 /*return*/, { app: null, shutdown: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                }); }); } }];
                    }
                    appId = creds.appId;
                    runtime = (_f = opts.runtime) !== null && _f !== void 0 ? _f : {
                        log: console.log,
                        error: console.error,
                        exit: function (code) {
                            throw new Error("exit ".concat(code));
                        },
                    };
                    allowFrom = msteamsCfg.allowFrom;
                    groupAllowFrom = msteamsCfg.groupAllowFrom;
                    teamsConfig = msteamsCfg.teams;
                    cleanAllowEntry = function (entry) {
                        return entry
                            .replace(/^(msteams|teams):/i, "")
                            .replace(/^user:/i, "")
                            .trim();
                    };
                    resolveAllowlistUsers = function (label, entries) { return __awaiter(_this, void 0, void 0, function () {
                        var resolved, additions, unresolved, _i, resolved_1, entry, mapping;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (entries.length === 0) {
                                        return [2 /*return*/, { additions: [], unresolved: [] }];
                                    }
                                    return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsUserAllowlist)({ cfg: cfg, entries: entries })];
                                case 1:
                                    resolved = _a.sent();
                                    additions = [];
                                    unresolved = [];
                                    for (_i = 0, resolved_1 = resolved; _i < resolved_1.length; _i++) {
                                        entry = resolved_1[_i];
                                        if (entry.resolved && entry.id) {
                                            additions.push(entry.id);
                                        }
                                        else {
                                            unresolved.push(entry.input);
                                        }
                                    }
                                    mapping = resolved
                                        .filter(function (entry) { return entry.resolved && entry.id; })
                                        .map(function (entry) { return "".concat(entry.input, "\u2192").concat(entry.id); });
                                    (0, plugin_sdk_1.summarizeMapping)(label, mapping, unresolved, runtime);
                                    return [2 /*return*/, { additions: additions, unresolved: unresolved }];
                            }
                        });
                    }); };
                    _s.label = 1;
                case 1:
                    _s.trys.push([1, 8, , 9]);
                    allowEntries = (_g = allowFrom === null || allowFrom === void 0 ? void 0 : allowFrom.map(function (entry) { return cleanAllowEntry(String(entry)); }).filter(function (entry) { return entry && entry !== "*"; })) !== null && _g !== void 0 ? _g : [];
                    if (!(allowEntries.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, resolveAllowlistUsers("msteams users", allowEntries)];
                case 2:
                    additions = (_s.sent()).additions;
                    allowFrom = (0, plugin_sdk_1.mergeAllowlist)({ existing: allowFrom, additions: additions });
                    _s.label = 3;
                case 3:
                    if (!(Array.isArray(groupAllowFrom) && groupAllowFrom.length > 0)) return [3 /*break*/, 5];
                    groupEntries = groupAllowFrom
                        .map(function (entry) { return cleanAllowEntry(String(entry)); })
                        .filter(function (entry) { return entry && entry !== "*"; });
                    if (!(groupEntries.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, resolveAllowlistUsers("msteams group users", groupEntries)];
                case 4:
                    additions = (_s.sent()).additions;
                    groupAllowFrom = (0, plugin_sdk_1.mergeAllowlist)({ existing: groupAllowFrom, additions: additions });
                    _s.label = 5;
                case 5:
                    if (!(teamsConfig && Object.keys(teamsConfig).length > 0)) return [3 /*break*/, 7];
                    entries_1 = [];
                    for (_i = 0, _a = Object.entries(teamsConfig); _i < _a.length; _i++) {
                        _b = _a[_i], teamKey = _b[0], teamCfg = _b[1];
                        if (teamKey === "*") {
                            continue;
                        }
                        channels = (_h = teamCfg === null || teamCfg === void 0 ? void 0 : teamCfg.channels) !== null && _h !== void 0 ? _h : {};
                        channelKeys = Object.keys(channels).filter(function (key) { return key !== "*"; });
                        if (channelKeys.length === 0) {
                            entries_1.push({ input: teamKey, teamKey: teamKey });
                            continue;
                        }
                        for (_c = 0, channelKeys_1 = channelKeys; _c < channelKeys_1.length; _c++) {
                            channelKey = channelKeys_1[_c];
                            entries_1.push({
                                input: "".concat(teamKey, "/").concat(channelKey),
                                teamKey: teamKey,
                                channelKey: channelKey,
                            });
                        }
                    }
                    if (!(entries_1.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, resolve_allowlist_js_1.resolveMSTeamsChannelAllowlist)({
                            cfg: cfg,
                            entries: entries_1.map(function (entry) { return entry.input; }),
                        })];
                case 6:
                    resolved = _s.sent();
                    mapping_1 = [];
                    unresolved_1 = [];
                    nextTeams_1 = __assign({}, teamsConfig);
                    resolved.forEach(function (entry, idx) {
                        var _a;
                        var _b, _c, _d;
                        var source = entries_1[idx];
                        if (!source) {
                            return;
                        }
                        var sourceTeam = (_b = teamsConfig === null || teamsConfig === void 0 ? void 0 : teamsConfig[source.teamKey]) !== null && _b !== void 0 ? _b : {};
                        if (!entry.resolved || !entry.teamId) {
                            unresolved_1.push(entry.input);
                            return;
                        }
                        mapping_1.push(entry.channelId
                            ? "".concat(entry.input, "\u2192").concat(entry.teamId, "/").concat(entry.channelId)
                            : "".concat(entry.input, "\u2192").concat(entry.teamId));
                        var existing = (_c = nextTeams_1[entry.teamId]) !== null && _c !== void 0 ? _c : {};
                        var mergedChannels = __assign(__assign({}, sourceTeam.channels), existing.channels);
                        var mergedTeam = __assign(__assign(__assign({}, sourceTeam), existing), { channels: mergedChannels });
                        nextTeams_1[entry.teamId] = mergedTeam;
                        if (source.channelKey && entry.channelId) {
                            var sourceChannel = (_d = sourceTeam.channels) === null || _d === void 0 ? void 0 : _d[source.channelKey];
                            if (sourceChannel) {
                                nextTeams_1[entry.teamId] = __assign(__assign({}, mergedTeam), { channels: __assign(__assign({}, mergedChannels), (_a = {}, _a[entry.channelId] = __assign(__assign({}, sourceChannel), mergedChannels === null || mergedChannels === void 0 ? void 0 : mergedChannels[entry.channelId]), _a)) });
                            }
                        }
                    });
                    teamsConfig = nextTeams_1;
                    (0, plugin_sdk_1.summarizeMapping)("msteams channels", mapping_1, unresolved_1, runtime);
                    _s.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _s.sent();
                    (_j = runtime.log) === null || _j === void 0 ? void 0 : _j.call(runtime, "msteams resolve failed; using config entries. ".concat(String(err_1)));
                    return [3 /*break*/, 9];
                case 9:
                    msteamsCfg = __assign(__assign({}, msteamsCfg), { allowFrom: allowFrom, groupAllowFrom: groupAllowFrom, teams: teamsConfig });
                    cfg = __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { msteams: msteamsCfg }) });
                    port = (_l = (_k = msteamsCfg.webhook) === null || _k === void 0 ? void 0 : _k.port) !== null && _l !== void 0 ? _l : 3978;
                    textLimit = core.channel.text.resolveTextChunkLimit(cfg, "msteams");
                    MB = 1024 * 1024;
                    agentDefaults = (_m = cfg.agents) === null || _m === void 0 ? void 0 : _m.defaults;
                    mediaMaxBytes = typeof (agentDefaults === null || agentDefaults === void 0 ? void 0 : agentDefaults.mediaMaxMb) === "number" && agentDefaults.mediaMaxMb > 0
                        ? Math.floor(agentDefaults.mediaMaxMb * MB)
                        : 8 * MB;
                    conversationStore = (_o = opts.conversationStore) !== null && _o !== void 0 ? _o : (0, conversation_store_fs_js_1.createMSTeamsConversationStoreFs)();
                    pollStore = (_p = opts.pollStore) !== null && _p !== void 0 ? _p : (0, polls_js_1.createMSTeamsPollStoreFs)();
                    log.info("starting provider (port ".concat(port, ")"));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("express"); })];
                case 10:
                    express = _s.sent();
                    return [4 /*yield*/, (0, sdk_js_1.loadMSTeamsSdkWithAuth)(creds)];
                case 11:
                    _d = _s.sent(), sdk = _d.sdk, authConfig = _d.authConfig;
                    ActivityHandler = sdk.ActivityHandler, MsalTokenProvider = sdk.MsalTokenProvider, authorizeJWT = sdk.authorizeJWT;
                    tokenProvider = new MsalTokenProvider(authConfig);
                    adapter = (0, sdk_js_1.createMSTeamsAdapter)(authConfig, sdk);
                    handler = (0, monitor_handler_js_1.registerMSTeamsHandlers)(new ActivityHandler(), {
                        cfg: cfg,
                        runtime: runtime,
                        appId: appId,
                        adapter: adapter,
                        tokenProvider: tokenProvider,
                        textLimit: textLimit,
                        mediaMaxBytes: mediaMaxBytes,
                        conversationStore: conversationStore,
                        pollStore: pollStore,
                        log: log,
                    });
                    expressApp = express.default();
                    expressApp.use(express.json());
                    expressApp.use(authorizeJWT(authConfig));
                    configuredPath = (_r = (_q = msteamsCfg.webhook) === null || _q === void 0 ? void 0 : _q.path) !== null && _r !== void 0 ? _r : "/api/messages";
                    messageHandler = function (req, res) {
                        void adapter
                            .process(req, res, function (context) { return handler.run(context); })
                            .catch(function (err) {
                            log.error("msteams webhook failed", { error: (0, errors_js_1.formatUnknownError)(err) });
                        });
                    };
                    // Listen on configured path and /api/messages (standard Bot Framework path)
                    expressApp.post(configuredPath, messageHandler);
                    if (configuredPath !== "/api/messages") {
                        expressApp.post("/api/messages", messageHandler);
                    }
                    log.debug("listening on paths", {
                        primary: configuredPath,
                        fallback: "/api/messages",
                    });
                    httpServer = expressApp.listen(port, function () {
                        log.info("msteams provider started on port ".concat(port));
                    });
                    httpServer.on("error", function (err) {
                        log.error("msteams server error", { error: String(err) });
                    });
                    shutdown = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            log.info("shutting down msteams provider");
                            return [2 /*return*/, new Promise(function (resolve) {
                                    httpServer.close(function (err) {
                                        if (err) {
                                            log.debug("msteams server close error", { error: String(err) });
                                        }
                                        resolve();
                                    });
                                })];
                        });
                    }); };
                    // Handle abort signal
                    if (opts.abortSignal) {
                        opts.abortSignal.addEventListener("abort", function () {
                            void shutdown();
                        });
                    }
                    return [2 /*return*/, { app: expressApp, shutdown: shutdown }];
            }
        });
    });
}
