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
exports.maybeRepairAnthropicOAuthProfileId = maybeRepairAnthropicOAuthProfileId;
exports.maybeRemoveDeprecatedCliAuthProfiles = maybeRemoveDeprecatedCliAuthProfiles;
exports.noteAuthProfileHealth = noteAuthProfileHealth;
var auth_health_js_1 = require("../agents/auth-health.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var store_js_1 = require("../agents/auth-profiles/store.js");
var command_format_js_1 = require("../cli/command-format.js");
var note_js_1 = require("../terminal/note.js");
function maybeRepairAnthropicOAuthProfileId(cfg, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var store, repair, apply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)();
                    repair = (0, auth_profiles_js_1.repairOAuthProfileIdMismatch)({
                        cfg: cfg,
                        store: store,
                        provider: "anthropic",
                        legacyProfileId: "anthropic:default",
                    });
                    if (!repair.migrated || repair.changes.length === 0) {
                        return [2 /*return*/, cfg];
                    }
                    (0, note_js_1.note)(repair.changes.map(function (c) { return "- ".concat(c); }).join("\n"), "Auth profiles");
                    return [4 /*yield*/, prompter.confirm({
                            message: "Update Anthropic OAuth profile id in config now?",
                            initialValue: true,
                        })];
                case 1:
                    apply = _a.sent();
                    if (!apply) {
                        return [2 /*return*/, cfg];
                    }
                    return [2 /*return*/, repair.config];
            }
        });
    });
}
function pruneAuthOrder(order, profileIds) {
    if (!order) {
        return { next: order, changed: false };
    }
    var changed = false;
    var next = {};
    for (var _i = 0, _a = Object.entries(order); _i < _a.length; _i++) {
        var _b = _a[_i], provider = _b[0], list = _b[1];
        var filtered = list.filter(function (id) { return !profileIds.has(id); });
        if (filtered.length !== list.length) {
            changed = true;
        }
        if (filtered.length > 0) {
            next[provider] = filtered;
        }
    }
    return { next: Object.keys(next).length > 0 ? next : undefined, changed: changed };
}
function pruneAuthProfiles(cfg, profileIds) {
    var _a, _b;
    var profiles = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles;
    var order = (_b = cfg.auth) === null || _b === void 0 ? void 0 : _b.order;
    var nextProfiles = profiles ? __assign({}, profiles) : undefined;
    var changed = false;
    if (nextProfiles) {
        for (var _i = 0, profileIds_1 = profileIds; _i < profileIds_1.length; _i++) {
            var id = profileIds_1[_i];
            if (id in nextProfiles) {
                delete nextProfiles[id];
                changed = true;
            }
        }
    }
    var prunedOrder = pruneAuthOrder(order, profileIds);
    if (prunedOrder.changed) {
        changed = true;
    }
    if (!changed) {
        return { next: cfg, changed: false };
    }
    var nextAuth = nextProfiles || prunedOrder.next
        ? __assign(__assign({}, cfg.auth), { profiles: nextProfiles && Object.keys(nextProfiles).length > 0 ? nextProfiles : undefined, order: prunedOrder.next }) : undefined;
    return {
        next: __assign(__assign({}, cfg), { auth: nextAuth }),
        changed: true,
    };
}
function maybeRemoveDeprecatedCliAuthProfiles(cfg, prompter) {
    return __awaiter(this, void 0, void 0, function () {
        var store, deprecated, lines, shouldRemove, pruned;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(undefined, { allowKeychainPrompt: false });
                    deprecated = new Set();
                    if (store.profiles[auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID] || ((_b = (_a = cfg.auth) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b[auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID])) {
                        deprecated.add(auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID);
                    }
                    if (store.profiles[auth_profiles_js_1.CODEX_CLI_PROFILE_ID] || ((_d = (_c = cfg.auth) === null || _c === void 0 ? void 0 : _c.profiles) === null || _d === void 0 ? void 0 : _d[auth_profiles_js_1.CODEX_CLI_PROFILE_ID])) {
                        deprecated.add(auth_profiles_js_1.CODEX_CLI_PROFILE_ID);
                    }
                    if (deprecated.size === 0) {
                        return [2 /*return*/, cfg];
                    }
                    lines = ["Deprecated external CLI auth profiles detected (no longer supported):"];
                    if (deprecated.has(auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID)) {
                        lines.push("- ".concat(auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID, " (Anthropic): use setup-token \u2192 ").concat((0, command_format_js_1.formatCliCommand)("openclaw models auth setup-token")));
                    }
                    if (deprecated.has(auth_profiles_js_1.CODEX_CLI_PROFILE_ID)) {
                        lines.push("- ".concat(auth_profiles_js_1.CODEX_CLI_PROFILE_ID, " (OpenAI Codex): use OAuth \u2192 ").concat((0, command_format_js_1.formatCliCommand)("openclaw models auth login --provider openai-codex")));
                    }
                    (0, note_js_1.note)(lines.join("\n"), "Auth profiles");
                    return [4 /*yield*/, prompter.confirmRepair({
                            message: "Remove deprecated CLI auth profiles now?",
                            initialValue: true,
                        })];
                case 1:
                    shouldRemove = _e.sent();
                    if (!shouldRemove) {
                        return [2 /*return*/, cfg];
                    }
                    return [4 /*yield*/, (0, store_js_1.updateAuthProfileStoreWithLock)({
                            updater: function (nextStore) {
                                var _a;
                                var mutated = false;
                                for (var _i = 0, deprecated_1 = deprecated; _i < deprecated_1.length; _i++) {
                                    var id = deprecated_1[_i];
                                    if (nextStore.profiles[id]) {
                                        delete nextStore.profiles[id];
                                        mutated = true;
                                    }
                                    if ((_a = nextStore.usageStats) === null || _a === void 0 ? void 0 : _a[id]) {
                                        delete nextStore.usageStats[id];
                                        mutated = true;
                                    }
                                }
                                if (nextStore.order) {
                                    for (var _b = 0, _c = Object.entries(nextStore.order); _b < _c.length; _b++) {
                                        var _d = _c[_b], provider = _d[0], list = _d[1];
                                        var filtered = list.filter(function (id) { return !deprecated.has(id); });
                                        if (filtered.length !== list.length) {
                                            mutated = true;
                                            if (filtered.length > 0) {
                                                nextStore.order[provider] = filtered;
                                            }
                                            else {
                                                delete nextStore.order[provider];
                                            }
                                        }
                                    }
                                }
                                if (nextStore.lastGood) {
                                    for (var _e = 0, _f = Object.entries(nextStore.lastGood); _e < _f.length; _e++) {
                                        var _g = _f[_e], provider = _g[0], profileId = _g[1];
                                        if (deprecated.has(profileId)) {
                                            delete nextStore.lastGood[provider];
                                            mutated = true;
                                        }
                                    }
                                }
                                return mutated;
                            },
                        })];
                case 2:
                    _e.sent();
                    pruned = pruneAuthProfiles(cfg, deprecated);
                    if (pruned.changed) {
                        (0, note_js_1.note)(Array.from(deprecated.values())
                            .map(function (id) { return "- removed ".concat(id, " from config"); })
                            .join("\n"), "Doctor changes");
                    }
                    return [2 /*return*/, pruned.next];
            }
        });
    });
}
function formatAuthIssueHint(issue) {
    if (issue.provider === "anthropic" && issue.profileId === auth_profiles_js_1.CLAUDE_CLI_PROFILE_ID) {
        return "Deprecated profile. Use ".concat((0, command_format_js_1.formatCliCommand)("openclaw models auth setup-token"), " or ").concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), ".");
    }
    if (issue.provider === "openai-codex" && issue.profileId === auth_profiles_js_1.CODEX_CLI_PROFILE_ID) {
        return "Deprecated profile. Use ".concat((0, command_format_js_1.formatCliCommand)("openclaw models auth login --provider openai-codex"), " or ").concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), ".");
    }
    return "Re-auth via `".concat((0, command_format_js_1.formatCliCommand)("openclaw configure"), "` or `").concat((0, command_format_js_1.formatCliCommand)("openclaw onboard"), "`.");
}
function formatAuthIssueLine(issue) {
    var remaining = issue.remainingMs !== undefined ? " (".concat((0, auth_health_js_1.formatRemainingShort)(issue.remainingMs), ")") : "";
    var hint = formatAuthIssueHint(issue);
    return "- ".concat(issue.profileId, ": ").concat(issue.status).concat(remaining).concat(hint ? " \u2014 ".concat(hint) : "");
}
function noteAuthProfileHealth(params) {
    return __awaiter(this, void 0, void 0, function () {
        var store, unusable, summary, findIssues, issues, shouldRefresh, refreshTargets, errors, _i, refreshTargets_1, profile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, auth_profiles_js_1.ensureAuthProfileStore)(undefined, {
                        allowKeychainPrompt: params.allowKeychainPrompt,
                    });
                    unusable = (function () {
                        var _a, _b;
                        var now = Date.now();
                        var out = [];
                        for (var _i = 0, _c = Object.keys((_a = store.usageStats) !== null && _a !== void 0 ? _a : {}); _i < _c.length; _i++) {
                            var profileId = _c[_i];
                            var until = (0, auth_profiles_js_1.resolveProfileUnusableUntilForDisplay)(store, profileId);
                            if (!until || now >= until) {
                                continue;
                            }
                            var stats = (_b = store.usageStats) === null || _b === void 0 ? void 0 : _b[profileId];
                            var remaining = (0, auth_health_js_1.formatRemainingShort)(until - now);
                            var kind = typeof (stats === null || stats === void 0 ? void 0 : stats.disabledUntil) === "number" && now < stats.disabledUntil
                                ? "disabled".concat(stats.disabledReason ? ":".concat(stats.disabledReason) : "")
                                : "cooldown";
                            var hint = kind.startsWith("disabled:billing")
                                ? "Top up credits (provider billing) or switch provider."
                                : "Wait for cooldown or switch provider.";
                            out.push("- ".concat(profileId, ": ").concat(kind, " (").concat(remaining, ")").concat(hint ? " \u2014 ".concat(hint) : ""));
                        }
                        return out;
                    })();
                    if (unusable.length > 0) {
                        (0, note_js_1.note)(unusable.join("\n"), "Auth profile cooldowns");
                    }
                    summary = (0, auth_health_js_1.buildAuthHealthSummary)({
                        store: store,
                        cfg: params.cfg,
                        warnAfterMs: auth_health_js_1.DEFAULT_OAUTH_WARN_MS,
                    });
                    findIssues = function () {
                        return summary.profiles.filter(function (profile) {
                            return (profile.type === "oauth" || profile.type === "token") &&
                                (profile.status === "expired" ||
                                    profile.status === "expiring" ||
                                    profile.status === "missing");
                        });
                    };
                    issues = findIssues();
                    if (issues.length === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, params.prompter.confirmRepair({
                            message: "Refresh expiring OAuth tokens now? (static tokens need re-auth)",
                            initialValue: true,
                        })];
                case 1:
                    shouldRefresh = _a.sent();
                    if (!shouldRefresh) return [3 /*break*/, 8];
                    refreshTargets = issues.filter(function (issue) {
                        return issue.type === "oauth" && ["expired", "expiring", "missing"].includes(issue.status);
                    });
                    errors = [];
                    _i = 0, refreshTargets_1 = refreshTargets;
                    _a.label = 2;
                case 2:
                    if (!(_i < refreshTargets_1.length)) return [3 /*break*/, 7];
                    profile = refreshTargets_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, auth_profiles_js_1.resolveApiKeyForProfile)({
                            cfg: params.cfg,
                            store: store,
                            profileId: profile.profileId,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    errors.push("- ".concat(profile.profileId, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (errors.length > 0) {
                        (0, note_js_1.note)(errors.join("\n"), "OAuth refresh errors");
                    }
                    summary = (0, auth_health_js_1.buildAuthHealthSummary)({
                        store: (0, auth_profiles_js_1.ensureAuthProfileStore)(undefined, {
                            allowKeychainPrompt: false,
                        }),
                        cfg: params.cfg,
                        warnAfterMs: auth_health_js_1.DEFAULT_OAUTH_WARN_MS,
                    });
                    issues = findIssues();
                    _a.label = 8;
                case 8:
                    if (issues.length > 0) {
                        (0, note_js_1.note)(issues
                            .map(function (issue) {
                            return formatAuthIssueLine({
                                profileId: issue.profileId,
                                provider: issue.provider,
                                status: issue.status,
                                remainingMs: issue.remainingMs,
                            });
                        })
                            .join("\n"), "Model auth");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
