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
exports.zalouserPlugin = exports.zalouserDock = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var config_schema_js_1 = require("./config-schema.js");
var onboarding_js_1 = require("./onboarding.js");
var probe_js_1 = require("./probe.js");
var send_js_1 = require("./send.js");
var status_issues_js_1 = require("./status-issues.js");
var zca_js_1 = require("./zca.js");
var meta = {
    id: "zalouser",
    label: "Zalo Personal",
    selectionLabel: "Zalo (Personal Account)",
    docsPath: "/channels/zalouser",
    docsLabel: "zalouser",
    blurb: "Zalo personal account via QR code login.",
    aliases: ["zlu"],
    order: 85,
    quickstartAllowFrom: true,
};
function resolveZalouserQrProfile(accountId) {
    var _a;
    var normalized = (0, plugin_sdk_1.normalizeAccountId)(accountId);
    if (!normalized || normalized === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return ((_a = process.env.ZCA_PROFILE) === null || _a === void 0 ? void 0 : _a.trim()) || "default";
    }
    return normalized;
}
function mapUser(params) {
    var _a, _b;
    return {
        kind: "user",
        id: params.id,
        name: (_a = params.name) !== null && _a !== void 0 ? _a : undefined,
        avatarUrl: (_b = params.avatarUrl) !== null && _b !== void 0 ? _b : undefined,
        raw: params.raw,
    };
}
function mapGroup(params) {
    var _a;
    return {
        kind: "group",
        id: params.id,
        name: (_a = params.name) !== null && _a !== void 0 ? _a : undefined,
        raw: params.raw,
    };
}
function resolveZalouserGroupToolPolicy(params) {
    var _a, _b, _c, _d;
    var account = (0, accounts_js_1.resolveZalouserAccountSync)({
        cfg: params.cfg,
        accountId: (_a = params.accountId) !== null && _a !== void 0 ? _a : undefined,
    });
    var groups = (_b = account.config.groups) !== null && _b !== void 0 ? _b : {};
    var groupId = (_c = params.groupId) === null || _c === void 0 ? void 0 : _c.trim();
    var groupChannel = (_d = params.groupChannel) === null || _d === void 0 ? void 0 : _d.trim();
    var candidates = [groupId, groupChannel, "*"].filter(function (value) {
        return Boolean(value);
    });
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var key = candidates_1[_i];
        var entry = groups[key];
        if (entry === null || entry === void 0 ? void 0 : entry.tools) {
            return entry.tools;
        }
    }
    return undefined;
}
exports.zalouserDock = {
    id: "zalouser",
    capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        blockStreaming: true,
    },
    outbound: { textChunkLimit: 2000 },
    config: {
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(zalouser|zlu):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    groups: {
        resolveRequireMention: function () { return true; },
        resolveToolPolicy: resolveZalouserGroupToolPolicy,
    },
    threading: {
        resolveReplyToMode: function () { return "off"; },
    },
};
exports.zalouserPlugin = {
    id: "zalouser",
    meta: meta,
    onboarding: onboarding_js_1.zalouserOnboardingAdapter,
    capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        reactions: true,
        threads: false,
        polls: false,
        nativeCommands: false,
        blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.zalouser"] },
    configSchema: (0, plugin_sdk_1.buildChannelConfigSchema)(config_schema_js_1.ZalouserConfigSchema),
    config: {
        listAccountIds: function (cfg) { return (0, accounts_js_1.listZalouserAccountIds)(cfg); },
        resolveAccount: function (cfg, accountId) { return (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId }); },
        defaultAccountId: function (cfg) { return (0, accounts_js_1.resolveDefaultZalouserAccountId)(cfg); },
        setAccountEnabled: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, enabled = _a.enabled;
            return (0, plugin_sdk_1.setAccountEnabledInConfigSection)({
                cfg: cfg,
                sectionKey: "zalouser",
                accountId: accountId,
                enabled: enabled,
                allowTopLevel: true,
            });
        },
        deleteAccount: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId;
            return (0, plugin_sdk_1.deleteAccountFromConfigSection)({
                cfg: cfg,
                sectionKey: "zalouser",
                accountId: accountId,
                clearBaseFields: [
                    "profile",
                    "name",
                    "dmPolicy",
                    "allowFrom",
                    "groupPolicy",
                    "groups",
                    "messagePrefix",
                ],
            });
        },
        isConfigured: function (account) { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "status"], {
                            profile: account.profile,
                            timeout: 5000,
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.ok];
                }
            });
        }); },
        describeAccount: function (account) { return ({
            accountId: account.accountId,
            name: account.name,
            enabled: account.enabled,
            configured: undefined,
        }); },
        resolveAllowFrom: function (_a) {
            var _b;
            var cfg = _a.cfg, accountId = _a.accountId;
            return ((_b = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId }).config.allowFrom) !== null && _b !== void 0 ? _b : []).map(function (entry) {
                return String(entry);
            });
        },
        formatAllowFrom: function (_a) {
            var allowFrom = _a.allowFrom;
            return allowFrom
                .map(function (entry) { return String(entry).trim(); })
                .filter(Boolean)
                .map(function (entry) { return entry.replace(/^(zalouser|zlu):/i, ""); })
                .map(function (entry) { return entry.toLowerCase(); });
        },
    },
    security: {
        resolveDmPolicy: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var cfg = _a.cfg, accountId = _a.accountId, account = _a.account;
            var resolvedAccountId = (_b = accountId !== null && accountId !== void 0 ? accountId : account.accountId) !== null && _b !== void 0 ? _b : plugin_sdk_1.DEFAULT_ACCOUNT_ID;
            var useAccountPath = Boolean((_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalouser) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e[resolvedAccountId]);
            var basePath = useAccountPath
                ? "channels.zalouser.accounts.".concat(resolvedAccountId, ".")
                : "channels.zalouser.";
            return {
                policy: (_f = account.config.dmPolicy) !== null && _f !== void 0 ? _f : "pairing",
                allowFrom: (_g = account.config.allowFrom) !== null && _g !== void 0 ? _g : [],
                policyPath: "".concat(basePath, "dmPolicy"),
                allowFromPath: basePath,
                approveHint: (0, plugin_sdk_1.formatPairingApproveHint)("zalouser"),
                normalizeEntry: function (raw) { return raw.replace(/^(zalouser|zlu):/i, ""); },
            };
        },
    },
    groups: {
        resolveRequireMention: function () { return true; },
        resolveToolPolicy: resolveZalouserGroupToolPolicy,
    },
    threading: {
        resolveReplyToMode: function () { return "off"; },
    },
    setup: {
        resolveAccountId: function (_a) {
            var accountId = _a.accountId;
            return (0, plugin_sdk_1.normalizeAccountId)(accountId);
        },
        applyAccountName: function (_a) {
            var cfg = _a.cfg, accountId = _a.accountId, name = _a.name;
            return (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "zalouser",
                accountId: accountId,
                name: name,
            });
        },
        validateInput: function () { return null; },
        applyAccountConfig: function (_a) {
            var _b;
            var _c, _d, _e, _f, _g, _h, _j;
            var cfg = _a.cfg, accountId = _a.accountId, input = _a.input;
            var namedConfig = (0, plugin_sdk_1.applyAccountNameToChannelSection)({
                cfg: cfg,
                channelKey: "zalouser",
                accountId: accountId,
                name: input.name,
            });
            var next = accountId !== plugin_sdk_1.DEFAULT_ACCOUNT_ID
                ? (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                    cfg: namedConfig,
                    channelKey: "zalouser",
                })
                : namedConfig;
            if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalouser: __assign(__assign({}, (_c = next.channels) === null || _c === void 0 ? void 0 : _c.zalouser), { enabled: true }) }) });
            }
            return __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalouser: __assign(__assign({}, (_d = next.channels) === null || _d === void 0 ? void 0 : _d.zalouser), { enabled: true, accounts: __assign(__assign({}, (_f = (_e = next.channels) === null || _e === void 0 ? void 0 : _e.zalouser) === null || _f === void 0 ? void 0 : _f.accounts), (_b = {}, _b[accountId] = __assign(__assign({}, (_j = (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.zalouser) === null || _h === void 0 ? void 0 : _h.accounts) === null || _j === void 0 ? void 0 : _j[accountId]), { enabled: true }), _b)) }) }) });
        },
    },
    messaging: {
        normalizeTarget: function (raw) {
            var trimmed = raw === null || raw === void 0 ? void 0 : raw.trim();
            if (!trimmed) {
                return undefined;
            }
            return trimmed.replace(/^(zalouser|zlu):/i, "");
        },
        targetResolver: {
            looksLikeId: function (raw) {
                var trimmed = raw.trim();
                if (!trimmed) {
                    return false;
                }
                return /^\d{3,}$/.test(trimmed);
            },
            hint: "<threadId>",
        },
    },
    directory: {
        self: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ok, account, result, parsed;
            var _c, _d;
            var cfg = _b.cfg, accountId = _b.accountId, runtime = _b.runtime;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        ok = _e.sent();
                        if (!ok) {
                            throw new Error("Missing dependency: `zca` not found in PATH");
                        }
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, (0, zca_js_1.runZca)(["me", "info", "-j"], {
                                profile: account.profile,
                                timeout: 10000,
                            })];
                    case 2:
                        result = _e.sent();
                        if (!result.ok) {
                            runtime.error(result.stderr || "Failed to fetch profile");
                            return [2 /*return*/, null];
                        }
                        parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                        if (!(parsed === null || parsed === void 0 ? void 0 : parsed.userId)) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, mapUser({
                                id: String(parsed.userId),
                                name: (_c = parsed.displayName) !== null && _c !== void 0 ? _c : null,
                                avatarUrl: (_d = parsed.avatar) !== null && _d !== void 0 ? _d : null,
                                raw: parsed,
                            })];
                }
            });
        }); },
        listPeers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ok, account, args, result, parsed, rows;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        ok = _c.sent();
                        if (!ok) {
                            throw new Error("Missing dependency: `zca` not found in PATH");
                        }
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        args = (query === null || query === void 0 ? void 0 : query.trim()) ? ["friend", "find", query.trim()] : ["friend", "list", "-j"];
                        return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: account.profile, timeout: 15000 })];
                    case 2:
                        result = _c.sent();
                        if (!result.ok) {
                            throw new Error(result.stderr || "Failed to list peers");
                        }
                        parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                        rows = Array.isArray(parsed)
                            ? parsed.map(function (f) {
                                var _a, _b;
                                return mapUser({
                                    id: String(f.userId),
                                    name: (_a = f.displayName) !== null && _a !== void 0 ? _a : null,
                                    avatarUrl: (_b = f.avatar) !== null && _b !== void 0 ? _b : null,
                                    raw: f,
                                });
                            })
                            : [];
                        return [2 /*return*/, typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows];
                }
            });
        }); },
        listGroups: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ok, account, result, parsed, rows, q;
            var cfg = _b.cfg, accountId = _b.accountId, query = _b.query, limit = _b.limit;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        ok = _c.sent();
                        if (!ok) {
                            throw new Error("Missing dependency: `zca` not found in PATH");
                        }
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, (0, zca_js_1.runZca)(["group", "list", "-j"], {
                                profile: account.profile,
                                timeout: 15000,
                            })];
                    case 2:
                        result = _c.sent();
                        if (!result.ok) {
                            throw new Error(result.stderr || "Failed to list groups");
                        }
                        parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                        rows = Array.isArray(parsed)
                            ? parsed.map(function (g) {
                                var _a;
                                return mapGroup({
                                    id: String(g.groupId),
                                    name: (_a = g.name) !== null && _a !== void 0 ? _a : null,
                                    raw: g,
                                });
                            })
                            : [];
                        q = query === null || query === void 0 ? void 0 : query.trim().toLowerCase();
                        if (q) {
                            rows = rows.filter(function (g) { var _a; return ((_a = g.name) !== null && _a !== void 0 ? _a : "").toLowerCase().includes(q) || g.id.includes(q); });
                        }
                        return [2 /*return*/, typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows];
                }
            });
        }); },
        listGroupMembers: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var ok, account, result, parsed, rows, sliced;
            var cfg = _b.cfg, accountId = _b.accountId, groupId = _b.groupId, limit = _b.limit;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        ok = _c.sent();
                        if (!ok) {
                            throw new Error("Missing dependency: `zca` not found in PATH");
                        }
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, (0, zca_js_1.runZca)(["group", "members", groupId, "-j"], {
                                profile: account.profile,
                                timeout: 20000,
                            })];
                    case 2:
                        result = _c.sent();
                        if (!result.ok) {
                            throw new Error(result.stderr || "Failed to list group members");
                        }
                        parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                        rows = Array.isArray(parsed)
                            ? parsed
                                .map(function (m) {
                                var _a, _b, _c;
                                var id = (_a = m.userId) !== null && _a !== void 0 ? _a : m.id;
                                if (!id) {
                                    return null;
                                }
                                return mapUser({
                                    id: String(id),
                                    name: (_b = m.displayName) !== null && _b !== void 0 ? _b : null,
                                    avatarUrl: (_c = m.avatar) !== null && _c !== void 0 ? _c : null,
                                    raw: m,
                                });
                            })
                                .filter(Boolean)
                            : [];
                        sliced = typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
                        return [2 /*return*/, sliced];
                }
            });
        }); },
    },
    resolver: {
        resolveTargets: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var results, _loop_1, _i, inputs_1, input;
            var _c, _d, _e, _f;
            var cfg = _b.cfg, accountId = _b.accountId, inputs = _b.inputs, kind = _b.kind, runtime = _b.runtime;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        results = [];
                        _loop_1 = function (input) {
                            var trimmed, account, args, result, parsed, matches, best, parsed, matches, best, err_1;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        trimmed = input.trim();
                                        if (!trimmed) {
                                            results.push({ input: input, resolved: false, note: "empty input" });
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (/^\d+$/.test(trimmed)) {
                                            results.push({ input: input, resolved: true, id: trimmed });
                                            return [2 /*return*/, "continue"];
                                        }
                                        _h.label = 1;
                                    case 1:
                                        _h.trys.push([1, 3, , 4]);
                                        account = (0, accounts_js_1.resolveZalouserAccountSync)({
                                            cfg: cfg,
                                            accountId: accountId !== null && accountId !== void 0 ? accountId : plugin_sdk_1.DEFAULT_ACCOUNT_ID,
                                        });
                                        args = kind === "user"
                                            ? trimmed
                                                ? ["friend", "find", trimmed]
                                                : ["friend", "list", "-j"]
                                            : ["group", "list", "-j"];
                                        return [4 /*yield*/, (0, zca_js_1.runZca)(args, { profile: account.profile, timeout: 15000 })];
                                    case 2:
                                        result = _h.sent();
                                        if (!result.ok) {
                                            throw new Error(result.stderr || "zca lookup failed");
                                        }
                                        if (kind === "user") {
                                            parsed = (_c = (0, zca_js_1.parseJsonOutput)(result.stdout)) !== null && _c !== void 0 ? _c : [];
                                            matches = Array.isArray(parsed)
                                                ? parsed.map(function (f) {
                                                    var _a;
                                                    return ({
                                                        id: String(f.userId),
                                                        name: (_a = f.displayName) !== null && _a !== void 0 ? _a : undefined,
                                                    });
                                                })
                                                : [];
                                            best = matches[0];
                                            results.push({
                                                input: input,
                                                resolved: Boolean(best === null || best === void 0 ? void 0 : best.id),
                                                id: best === null || best === void 0 ? void 0 : best.id,
                                                name: best === null || best === void 0 ? void 0 : best.name,
                                                note: matches.length > 1 ? "multiple matches; chose first" : undefined,
                                            });
                                        }
                                        else {
                                            parsed = (_d = (0, zca_js_1.parseJsonOutput)(result.stdout)) !== null && _d !== void 0 ? _d : [];
                                            matches = Array.isArray(parsed)
                                                ? parsed.map(function (g) {
                                                    var _a;
                                                    return ({
                                                        id: String(g.groupId),
                                                        name: (_a = g.name) !== null && _a !== void 0 ? _a : undefined,
                                                    });
                                                })
                                                : [];
                                            best = (_e = matches.find(function (g) { var _a; return ((_a = g.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === trimmed.toLowerCase(); })) !== null && _e !== void 0 ? _e : matches[0];
                                            results.push({
                                                input: input,
                                                resolved: Boolean(best === null || best === void 0 ? void 0 : best.id),
                                                id: best === null || best === void 0 ? void 0 : best.id,
                                                name: best === null || best === void 0 ? void 0 : best.name,
                                                note: matches.length > 1 ? "multiple matches; chose first" : undefined,
                                            });
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_1 = _h.sent();
                                        (_f = runtime.error) === null || _f === void 0 ? void 0 : _f.call(runtime, "zalouser resolve failed: ".concat(String(err_1)));
                                        results.push({ input: input, resolved: false, note: "lookup failed" });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, inputs_1 = inputs;
                        _g.label = 1;
                    case 1:
                        if (!(_i < inputs_1.length)) return [3 /*break*/, 4];
                        input = inputs_1[_i];
                        return [5 /*yield**/, _loop_1(input)];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        }); },
    },
    pairing: {
        idLabel: "zalouserUserId",
        normalizeAllowEntry: function (entry) { return entry.replace(/^(zalouser|zlu):/i, ""); },
        notifyApproval: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, authenticated;
            var cfg = _b.cfg, id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg });
                        return [4 /*yield*/, (0, accounts_js_1.checkZcaAuthenticated)(account.profile)];
                    case 1:
                        authenticated = _c.sent();
                        if (!authenticated) {
                            throw new Error("Zalouser not authenticated");
                        }
                        return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(id, "Your pairing request has been approved.", {
                                profile: account.profile,
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    },
    auth: {
        login: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, ok, result;
            var cfg = _b.cfg, accountId = _b.accountId, runtime = _b.runtime;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({
                            cfg: cfg,
                            accountId: accountId !== null && accountId !== void 0 ? accountId : plugin_sdk_1.DEFAULT_ACCOUNT_ID,
                        });
                        return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        ok = _c.sent();
                        if (!ok) {
                            throw new Error("Missing dependency: `zca` not found in PATH. See docs.openclaw.ai/channels/zalouser");
                        }
                        runtime.log("Scan the QR code in this terminal to link Zalo Personal (account: ".concat(account.accountId, ", profile: ").concat(account.profile, ")."));
                        return [4 /*yield*/, (0, zca_js_1.runZcaInteractive)(["auth", "login"], { profile: account.profile })];
                    case 2:
                        result = _c.sent();
                        if (!result.ok) {
                            throw new Error(result.stderr || "Zalouser login failed");
                        }
                        return [2 /*return*/];
                }
            });
        }); },
    },
    outbound: {
        deliveryMode: "direct",
        chunker: function (text, limit) {
            if (!text) {
                return [];
            }
            if (limit <= 0 || text.length <= limit) {
                return [text];
            }
            var chunks = [];
            var remaining = text;
            while (remaining.length > limit) {
                var window_1 = remaining.slice(0, limit);
                var lastNewline = window_1.lastIndexOf("\n");
                var lastSpace = window_1.lastIndexOf(" ");
                var breakIdx = lastNewline > 0 ? lastNewline : lastSpace;
                if (breakIdx <= 0) {
                    breakIdx = limit;
                }
                var rawChunk = remaining.slice(0, breakIdx);
                var chunk = rawChunk.trimEnd();
                if (chunk.length > 0) {
                    chunks.push(chunk);
                }
                var brokeOnSeparator = breakIdx < remaining.length && /\s/.test(remaining[breakIdx]);
                var nextStart = Math.min(remaining.length, breakIdx + (brokeOnSeparator ? 1 : 0));
                remaining = remaining.slice(nextStart).trimStart();
            }
            if (remaining.length) {
                chunks.push(remaining);
            }
            return chunks;
        },
        chunkerMode: "text",
        textChunkLimit: 2000,
        sendText: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, result;
            var _c;
            var to = _b.to, text = _b.text, accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(to, text, { profile: account.profile })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, {
                                channel: "zalouser",
                                ok: result.ok,
                                messageId: (_c = result.messageId) !== null && _c !== void 0 ? _c : "",
                                error: result.error ? new Error(result.error) : undefined,
                            }];
                }
            });
        }); },
        sendMedia: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account, result;
            var _c;
            var to = _b.to, text = _b.text, mediaUrl = _b.mediaUrl, accountId = _b.accountId, cfg = _b.cfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                        return [4 /*yield*/, (0, send_js_1.sendMessageZalouser)(to, text, {
                                profile: account.profile,
                                mediaUrl: mediaUrl,
                            })];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, {
                                channel: "zalouser",
                                ok: result.ok,
                                messageId: (_c = result.messageId) !== null && _c !== void 0 ? _c : "",
                                error: result.error ? new Error(result.error) : undefined,
                            }];
                }
            });
        }); },
    },
    status: {
        defaultRuntime: {
            accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID,
            running: false,
            lastStartAt: null,
            lastStopAt: null,
            lastError: null,
        },
        collectStatusIssues: status_issues_js_1.collectZalouserStatusIssues,
        buildChannelSummary: function (_a) {
            var _b, _c, _d, _e, _f, _g;
            var snapshot = _a.snapshot;
            return ({
                configured: (_b = snapshot.configured) !== null && _b !== void 0 ? _b : false,
                running: (_c = snapshot.running) !== null && _c !== void 0 ? _c : false,
                lastStartAt: (_d = snapshot.lastStartAt) !== null && _d !== void 0 ? _d : null,
                lastStopAt: (_e = snapshot.lastStopAt) !== null && _e !== void 0 ? _e : null,
                lastError: (_f = snapshot.lastError) !== null && _f !== void 0 ? _f : null,
                probe: snapshot.probe,
                lastProbeAt: (_g = snapshot.lastProbeAt) !== null && _g !== void 0 ? _g : null,
            });
        },
        probeAccount: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var account = _b.account, timeoutMs = _b.timeoutMs;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, probe_js_1.probeZalouser)(account.profile, timeoutMs)];
            });
        }); },
        buildAccountSnapshot: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var zcaInstalled, configured, _c, configError;
            var _d, _e, _f, _g, _h, _j, _k, _l;
            var account = _b.account, runtime = _b.runtime;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                    case 1:
                        zcaInstalled = _m.sent();
                        if (!zcaInstalled) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, accounts_js_1.checkZcaAuthenticated)(account.profile)];
                    case 2:
                        _c = _m.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = false;
                        _m.label = 4;
                    case 4:
                        configured = _c;
                        configError = zcaInstalled ? "not authenticated" : "zca CLI not found in PATH";
                        return [2 /*return*/, {
                                accountId: account.accountId,
                                name: account.name,
                                enabled: account.enabled,
                                configured: configured,
                                running: (_d = runtime === null || runtime === void 0 ? void 0 : runtime.running) !== null && _d !== void 0 ? _d : false,
                                lastStartAt: (_e = runtime === null || runtime === void 0 ? void 0 : runtime.lastStartAt) !== null && _e !== void 0 ? _e : null,
                                lastStopAt: (_f = runtime === null || runtime === void 0 ? void 0 : runtime.lastStopAt) !== null && _f !== void 0 ? _f : null,
                                lastError: configured ? ((_g = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _g !== void 0 ? _g : null) : ((_h = runtime === null || runtime === void 0 ? void 0 : runtime.lastError) !== null && _h !== void 0 ? _h : configError),
                                lastInboundAt: (_j = runtime === null || runtime === void 0 ? void 0 : runtime.lastInboundAt) !== null && _j !== void 0 ? _j : null,
                                lastOutboundAt: (_k = runtime === null || runtime === void 0 ? void 0 : runtime.lastOutboundAt) !== null && _k !== void 0 ? _k : null,
                                dmPolicy: (_l = account.config.dmPolicy) !== null && _l !== void 0 ? _l : "pairing",
                            }];
                }
            });
        }); },
    },
    gateway: {
        startAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var account, userLabel, userInfo, _a, monitorZalouserProvider;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = ctx.account;
                        userLabel = "";
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, accounts_js_1.getZcaUserInfo)(account.profile)];
                    case 2:
                        userInfo = _c.sent();
                        if (userInfo === null || userInfo === void 0 ? void 0 : userInfo.displayName) {
                            userLabel = " (".concat(userInfo.displayName, ")");
                        }
                        ctx.setStatus({
                            accountId: account.accountId,
                            user: userInfo,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        (_b = ctx.log) === null || _b === void 0 ? void 0 : _b.info("[".concat(account.accountId, "] starting zalouser provider").concat(userLabel));
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("./monitor.js"); })];
                    case 5:
                        monitorZalouserProvider = (_c.sent()).monitorZalouserProvider;
                        return [2 /*return*/, monitorZalouserProvider({
                                account: account,
                                config: ctx.cfg,
                                runtime: ctx.runtime,
                                abortSignal: ctx.abortSignal,
                                statusSink: function (patch) { return ctx.setStatus(__assign({ accountId: ctx.accountId }, patch)); },
                            })];
                }
            });
        }); },
        loginWithQrStart: function (params) { return __awaiter(void 0, void 0, void 0, function () {
            var profile, result, qrMatch;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        profile = resolveZalouserQrProfile(params.accountId);
                        return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "login", "--qr-base64"], {
                                profile: profile,
                                timeout: (_a = params.timeoutMs) !== null && _a !== void 0 ? _a : 30000,
                            })];
                    case 1:
                        result = _b.sent();
                        if (!result.ok) {
                            return [2 /*return*/, { message: result.stderr || "Failed to start QR login" }];
                        }
                        qrMatch = result.stdout.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/);
                        if (qrMatch) {
                            return [2 /*return*/, { qrDataUrl: qrMatch[0], message: "Scan QR code with Zalo app" }];
                        }
                        return [2 /*return*/, { message: result.stdout || "QR login started" }];
                }
            });
        }); },
        loginWithQrWait: function (params) { return __awaiter(void 0, void 0, void 0, function () {
            var profile, statusResult;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        profile = resolveZalouserQrProfile(params.accountId);
                        return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "status"], {
                                profile: profile,
                                timeout: (_a = params.timeoutMs) !== null && _a !== void 0 ? _a : 60000,
                            })];
                    case 1:
                        statusResult = _b.sent();
                        return [2 /*return*/, {
                                connected: statusResult.ok,
                                message: statusResult.ok ? "Login successful" : statusResult.stderr || "Login pending",
                            }];
                }
            });
        }); },
        logoutAccount: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, zca_js_1.runZca)(["auth", "logout"], {
                            profile: ctx.account.profile,
                            timeout: 10000,
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                cleared: result.ok,
                                loggedOut: result.ok,
                                message: result.ok ? "Logged out" : result.stderr,
                            }];
                }
            });
        }); },
    },
};
