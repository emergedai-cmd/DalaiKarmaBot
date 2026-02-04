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
exports.buildChannelsTable = buildChannelsTable;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var helpers_js_1 = require("../../channels/plugins/helpers.js");
var index_js_1 = require("../../channels/plugins/index.js");
var format_js_1 = require("./format.js");
var asRecord = function (value) {
    return value && typeof value === "object" ? value : {};
};
function summarizeSources(sources) {
    var _a;
    var counts = new Map();
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var s = sources_1[_i];
        var key = (s === null || s === void 0 ? void 0 : s.trim()) ? s.trim() : "unknown";
        counts.set(key, ((_a = counts.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    var parts = __spreadArray([], counts.entries(), true).toSorted(function (a, b) { return b[1] - a[1]; })
        .map(function (_a) {
        var key = _a[0], n = _a[1];
        return "".concat(key).concat(n > 1 ? "\u00D7".concat(n) : "");
    });
    var label = parts.length > 0 ? parts.join("+") : "unknown";
    return { label: label, parts: parts };
}
function existsSyncMaybe(p) {
    var path = (p === null || p === void 0 ? void 0 : p.trim()) || "";
    if (!path) {
        return null;
    }
    try {
        return node_fs_1.default.existsSync(path);
    }
    catch (_a) {
        return null;
    }
}
function sha256HexPrefix(value, len) {
    if (len === void 0) { len = 8; }
    return node_crypto_1.default.createHash("sha256").update(value).digest("hex").slice(0, len);
}
function formatTokenHint(token, opts) {
    var t = token.trim();
    if (!t) {
        return "empty";
    }
    if (!opts.showSecrets) {
        return "sha256:".concat(sha256HexPrefix(t), " \u00B7 len ").concat(t.length);
    }
    var head = t.slice(0, 4);
    var tail = t.slice(-4);
    if (t.length <= 10) {
        return "".concat(t, " \u00B7 len ").concat(t.length);
    }
    return "".concat(head, "\u2026").concat(tail, " \u00B7 len ").concat(t.length);
}
var formatAccountLabel = function (params) {
    var _a;
    var base = params.accountId || "default";
    if ((_a = params.name) === null || _a === void 0 ? void 0 : _a.trim()) {
        return "".concat(base, " (").concat(params.name.trim(), ")");
    }
    return base;
};
var resolveAccountEnabled = function (plugin, account, cfg) {
    if (plugin.config.isEnabled) {
        return plugin.config.isEnabled(account, cfg);
    }
    var enabled = asRecord(account).enabled;
    return enabled !== false;
};
var resolveAccountConfigured = function (plugin, account, cfg) { return __awaiter(void 0, void 0, void 0, function () {
    var configured;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!plugin.config.isConfigured) return [3 /*break*/, 2];
                return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                configured = asRecord(account).configured;
                return [2 /*return*/, configured !== false];
        }
    });
}); };
var buildAccountSnapshot = function (params) {
    var _a, _b;
    var described = (_b = (_a = params.plugin.config).describeAccount) === null || _b === void 0 ? void 0 : _b.call(_a, params.account, params.cfg);
    return __assign(__assign({ enabled: params.enabled, configured: params.configured }, described), { accountId: params.accountId });
};
var formatAllowFrom = function (params) {
    if (params.plugin.config.formatAllowFrom) {
        return params.plugin.config.formatAllowFrom({
            cfg: params.cfg,
            accountId: params.accountId,
            allowFrom: params.allowFrom,
        });
    }
    return params.allowFrom.map(function (entry) { return String(entry).trim(); }).filter(Boolean);
};
var buildAccountNotes = function (params) {
    var _a, _b, _c;
    var plugin = params.plugin, cfg = params.cfg, entry = params.entry;
    var notes = [];
    var snapshot = entry.snapshot;
    if (snapshot.enabled === false) {
        notes.push("disabled");
    }
    if (snapshot.dmPolicy) {
        notes.push("dm:".concat(snapshot.dmPolicy));
    }
    if (snapshot.tokenSource && snapshot.tokenSource !== "none") {
        notes.push("token:".concat(snapshot.tokenSource));
    }
    if (snapshot.botTokenSource && snapshot.botTokenSource !== "none") {
        notes.push("bot:".concat(snapshot.botTokenSource));
    }
    if (snapshot.appTokenSource && snapshot.appTokenSource !== "none") {
        notes.push("app:".concat(snapshot.appTokenSource));
    }
    if (snapshot.baseUrl) {
        notes.push(snapshot.baseUrl);
    }
    if (snapshot.port != null) {
        notes.push("port:".concat(snapshot.port));
    }
    if (snapshot.cliPath) {
        notes.push("cli:".concat(snapshot.cliPath));
    }
    if (snapshot.dbPath) {
        notes.push("db:".concat(snapshot.dbPath));
    }
    var allowFrom = (_c = (_b = (_a = plugin.config).resolveAllowFrom) === null || _b === void 0 ? void 0 : _b.call(_a, { cfg: cfg, accountId: snapshot.accountId })) !== null && _c !== void 0 ? _c : snapshot.allowFrom;
    if (allowFrom === null || allowFrom === void 0 ? void 0 : allowFrom.length) {
        var formatted = formatAllowFrom({
            plugin: plugin,
            cfg: cfg,
            accountId: snapshot.accountId,
            allowFrom: allowFrom,
        }).slice(0, 3);
        if (formatted.length > 0) {
            notes.push("allow:".concat(formatted.join(",")));
        }
    }
    return notes;
};
function resolveLinkFields(summary) {
    var rec = asRecord(summary);
    var linked = typeof rec.linked === "boolean" ? rec.linked : null;
    var authAgeMs = typeof rec.authAgeMs === "number" ? rec.authAgeMs : null;
    var self = asRecord(rec.self);
    var selfE164 = typeof self.e164 === "string" && self.e164.trim() ? self.e164.trim() : null;
    return { linked: linked, authAgeMs: authAgeMs, selfE164: selfE164 };
}
function collectMissingPaths(accounts) {
    var _a;
    var missing = [];
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var entry = accounts_1[_i];
        var accountRec = asRecord(entry.account);
        var snapshotRec = asRecord(entry.snapshot);
        for (var _b = 0, _c = [
            "tokenFile",
            "botTokenFile",
            "appTokenFile",
            "cliPath",
            "dbPath",
            "authDir",
        ]; _b < _c.length; _b++) {
            var key = _c[_b];
            var raw = (_a = accountRec[key]) !== null && _a !== void 0 ? _a : snapshotRec[key];
            var ok = existsSyncMaybe(raw);
            if (ok === false) {
                missing.push(String(raw));
            }
        }
    }
    return missing;
}
function summarizeTokenConfig(params) {
    var _a, _b;
    var enabled = params.accounts.filter(function (a) { return a.enabled; });
    if (enabled.length === 0) {
        return { state: null, detail: null };
    }
    var accountRecs = enabled.map(function (a) { return asRecord(a.account); });
    var hasBotOrAppTokenFields = accountRecs.some(function (r) { return "botToken" in r || "appToken" in r; });
    var hasTokenField = accountRecs.some(function (r) { return "token" in r; });
    if (!hasBotOrAppTokenFields && !hasTokenField) {
        return { state: null, detail: null };
    }
    if (hasBotOrAppTokenFields) {
        var ready_1 = enabled.filter(function (a) {
            var rec = asRecord(a.account);
            var bot = typeof rec.botToken === "string" ? rec.botToken.trim() : "";
            var app = typeof rec.appToken === "string" ? rec.appToken.trim() : "";
            return Boolean(bot) && Boolean(app);
        });
        var partial = enabled.filter(function (a) {
            var rec = asRecord(a.account);
            var bot = typeof rec.botToken === "string" ? rec.botToken.trim() : "";
            var app = typeof rec.appToken === "string" ? rec.appToken.trim() : "";
            var hasBot = Boolean(bot);
            var hasApp = Boolean(app);
            return (hasBot && !hasApp) || (!hasBot && hasApp);
        });
        if (partial.length > 0) {
            return {
                state: "warn",
                detail: "partial tokens (need bot+app) \u00B7 accounts ".concat(partial.length),
            };
        }
        if (ready_1.length === 0) {
            return { state: "setup", detail: "no tokens (need bot+app)" };
        }
        var botSources = summarizeSources(ready_1.map(function (a) { var _a; return (_a = a.snapshot.botTokenSource) !== null && _a !== void 0 ? _a : "none"; }));
        var appSources = summarizeSources(ready_1.map(function (a) { var _a; return (_a = a.snapshot.appTokenSource) !== null && _a !== void 0 ? _a : "none"; }));
        var sample_1 = ((_a = ready_1[0]) === null || _a === void 0 ? void 0 : _a.account) ? asRecord(ready_1[0].account) : {};
        var botToken = typeof sample_1.botToken === "string" ? sample_1.botToken : "";
        var appToken = typeof sample_1.appToken === "string" ? sample_1.appToken : "";
        var botHint = botToken.trim()
            ? formatTokenHint(botToken, { showSecrets: params.showSecrets })
            : "";
        var appHint = appToken.trim()
            ? formatTokenHint(appToken, { showSecrets: params.showSecrets })
            : "";
        var hint_1 = botHint || appHint ? " (bot ".concat(botHint || "?", ", app ").concat(appHint || "?", ")") : "";
        return {
            state: "ok",
            detail: "tokens ok (bot ".concat(botSources.label, ", app ").concat(appSources.label, ")").concat(hint_1, " \u00B7 accounts ").concat(ready_1.length, "/").concat(enabled.length || 1),
        };
    }
    var ready = enabled.filter(function (a) {
        var rec = asRecord(a.account);
        return typeof rec.token === "string" ? Boolean(rec.token.trim()) : false;
    });
    if (ready.length === 0) {
        return { state: "setup", detail: "no token" };
    }
    var sources = summarizeSources(ready.map(function (a) { return a.snapshot.tokenSource; }));
    var sample = ((_b = ready[0]) === null || _b === void 0 ? void 0 : _b.account) ? asRecord(ready[0].account) : {};
    var token = typeof sample.token === "string" ? sample.token : "";
    var hint = token.trim()
        ? " (".concat(formatTokenHint(token, { showSecrets: params.showSecrets }), ")")
        : "";
    return {
        state: "ok",
        detail: "token ".concat(sources.label).concat(hint, " \u00B7 accounts ").concat(ready.length, "/").concat(enabled.length || 1),
    };
}
// `status --all` channels table.
// Keep this generic: channel-specific rules belong in the channel plugin.
function buildChannelsTable(cfg, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var showSecrets, rows, details, _loop_1, _i, _a, plugin;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    showSecrets = (opts === null || opts === void 0 ? void 0 : opts.showSecrets) === true;
                    rows = [];
                    details = [];
                    _loop_1 = function (plugin) {
                        var accountIds, defaultAccountId, resolvedAccountIds, accounts, _j, resolvedAccountIds_1, accountId, account, enabled, configured, snapshot, anyEnabled, enabledAccounts, configuredAccounts, defaultEntry, summary, _k, link, missingPaths, tokenSummary, issues, label, state, detail;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    accountIds = plugin.config.listAccountIds(cfg);
                                    defaultAccountId = (0, helpers_js_1.resolveChannelDefaultAccountId)({
                                        plugin: plugin,
                                        cfg: cfg,
                                        accountIds: accountIds,
                                    });
                                    resolvedAccountIds = accountIds.length > 0 ? accountIds : [defaultAccountId];
                                    accounts = [];
                                    _j = 0, resolvedAccountIds_1 = resolvedAccountIds;
                                    _l.label = 1;
                                case 1:
                                    if (!(_j < resolvedAccountIds_1.length)) return [3 /*break*/, 4];
                                    accountId = resolvedAccountIds_1[_j];
                                    account = plugin.config.resolveAccount(cfg, accountId);
                                    enabled = resolveAccountEnabled(plugin, account, cfg);
                                    return [4 /*yield*/, resolveAccountConfigured(plugin, account, cfg)];
                                case 2:
                                    configured = _l.sent();
                                    snapshot = buildAccountSnapshot({
                                        plugin: plugin,
                                        cfg: cfg,
                                        accountId: accountId,
                                        account: account,
                                        enabled: enabled,
                                        configured: configured,
                                    });
                                    accounts.push({ accountId: accountId, account: account, enabled: enabled, configured: configured, snapshot: snapshot });
                                    _l.label = 3;
                                case 3:
                                    _j++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    anyEnabled = accounts.some(function (a) { return a.enabled; });
                                    enabledAccounts = accounts.filter(function (a) { return a.enabled; });
                                    configuredAccounts = enabledAccounts.filter(function (a) { return a.configured; });
                                    defaultEntry = (_b = accounts.find(function (a) { return a.accountId === defaultAccountId; })) !== null && _b !== void 0 ? _b : accounts[0];
                                    if (!((_c = plugin.status) === null || _c === void 0 ? void 0 : _c.buildChannelSummary)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, plugin.status.buildChannelSummary({
                                            account: (_d = defaultEntry === null || defaultEntry === void 0 ? void 0 : defaultEntry.account) !== null && _d !== void 0 ? _d : {},
                                            cfg: cfg,
                                            defaultAccountId: defaultAccountId,
                                            snapshot: (_e = defaultEntry === null || defaultEntry === void 0 ? void 0 : defaultEntry.snapshot) !== null && _e !== void 0 ? _e : { accountId: defaultAccountId },
                                        })];
                                case 5:
                                    _k = _l.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    _k = undefined;
                                    _l.label = 7;
                                case 7:
                                    summary = _k;
                                    link = resolveLinkFields(summary);
                                    missingPaths = collectMissingPaths(enabledAccounts);
                                    tokenSummary = summarizeTokenConfig({
                                        plugin: plugin,
                                        cfg: cfg,
                                        accounts: accounts,
                                        showSecrets: showSecrets,
                                    });
                                    issues = ((_f = plugin.status) === null || _f === void 0 ? void 0 : _f.collectStatusIssues)
                                        ? plugin.status.collectStatusIssues(accounts.map(function (a) { return a.snapshot; }))
                                        : [];
                                    label = (_g = plugin.meta.label) !== null && _g !== void 0 ? _g : plugin.id;
                                    state = (function () {
                                        if (!anyEnabled) {
                                            return "off";
                                        }
                                        if (missingPaths.length > 0) {
                                            return "warn";
                                        }
                                        if (issues.length > 0) {
                                            return "warn";
                                        }
                                        if (link.linked === false) {
                                            return "setup";
                                        }
                                        if (tokenSummary.state) {
                                            return tokenSummary.state;
                                        }
                                        if (link.linked === true) {
                                            return "ok";
                                        }
                                        if (configuredAccounts.length > 0) {
                                            return "ok";
                                        }
                                        return "setup";
                                    })();
                                    detail = (function () {
                                        var _a, _b, _c, _d, _e;
                                        if (!anyEnabled) {
                                            if (!defaultEntry) {
                                                return "disabled";
                                            }
                                            return (_c = (_b = (_a = plugin.config).disabledReason) === null || _b === void 0 ? void 0 : _b.call(_a, defaultEntry.account, cfg)) !== null && _c !== void 0 ? _c : "disabled";
                                        }
                                        if (missingPaths.length > 0) {
                                            return "missing file (".concat(missingPaths[0], ")");
                                        }
                                        if (issues.length > 0) {
                                            return (_e = (_d = issues[0]) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : "misconfigured";
                                        }
                                        if (link.linked !== null) {
                                            var base = link.linked ? "linked" : "not linked";
                                            var extra = [];
                                            if (link.linked && link.selfE164) {
                                                extra.push(link.selfE164);
                                            }
                                            if (link.linked && link.authAgeMs != null && link.authAgeMs >= 0) {
                                                extra.push("auth ".concat((0, format_js_1.formatAge)(link.authAgeMs)));
                                            }
                                            if (accounts.length > 1 || plugin.meta.forceAccountBinding) {
                                                extra.push("accounts ".concat(accounts.length || 1));
                                            }
                                            return extra.length > 0 ? "".concat(base, " \u00B7 ").concat(extra.join(" · ")) : base;
                                        }
                                        if (tokenSummary.detail) {
                                            return tokenSummary.detail;
                                        }
                                        if (configuredAccounts.length > 0) {
                                            var head = "configured";
                                            if (accounts.length <= 1 && !plugin.meta.forceAccountBinding) {
                                                return head;
                                            }
                                            return "".concat(head, " \u00B7 accounts ").concat(configuredAccounts.length, "/").concat(enabledAccounts.length || 1);
                                        }
                                        var reason = defaultEntry && plugin.config.unconfiguredReason
                                            ? plugin.config.unconfiguredReason(defaultEntry.account, cfg)
                                            : null;
                                        return reason !== null && reason !== void 0 ? reason : "not configured";
                                    })();
                                    rows.push({
                                        id: plugin.id,
                                        label: label,
                                        enabled: anyEnabled,
                                        state: state,
                                        detail: detail,
                                    });
                                    if (configuredAccounts.length > 0) {
                                        details.push({
                                            title: "".concat(label, " accounts"),
                                            columns: ["Account", "Status", "Notes"],
                                            rows: configuredAccounts.map(function (entry) {
                                                var notes = buildAccountNotes({ plugin: plugin, cfg: cfg, entry: entry });
                                                return {
                                                    Account: formatAccountLabel({
                                                        accountId: entry.accountId,
                                                        name: entry.snapshot.name,
                                                    }),
                                                    Status: entry.enabled ? "OK" : "WARN",
                                                    Notes: notes.join(" · "),
                                                };
                                            }),
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = (0, index_js_1.listChannelPlugins)();
                    _h.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    plugin = _a[_i];
                    return [5 /*yield**/, _loop_1(plugin)];
                case 2:
                    _h.sent();
                    _h.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        rows: rows,
                        details: details,
                    }];
            }
        });
    });
}
