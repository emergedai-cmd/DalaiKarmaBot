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
exports.zalouserOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var zca_js_1 = require("./zca.js");
var channel = "zalouser";
function setZalouserDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, plugin_sdk_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalouser), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function noteZalouserHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "Zalo Personal Account login via QR code.",
                        "",
                        "Prerequisites:",
                        "1) Install zca-cli",
                        "2) You'll scan a QR code with your Zalo app",
                        "",
                        "Docs: https://docs.openclaw.ai/channels/zalouser",
                    ].join("\n"), "Zalo Personal Setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function promptZalouserAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, accountId, resolved, existingAllowFrom, parseInput, resolveUserId, _loop_1, state_1;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, accountId = params.accountId;
                    resolved = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                    existingAllowFrom = (_a = resolved.config.allowFrom) !== null && _a !== void 0 ? _a : [];
                    parseInput = function (raw) {
                        return raw
                            .split(/[\n,;]+/g)
                            .map(function (entry) { return entry.trim(); })
                            .filter(Boolean);
                    };
                    resolveUserId = function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var trimmed, ok, result, parsed, rows, match;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    trimmed = input.trim();
                                    if (!trimmed) {
                                        return [2 /*return*/, null];
                                    }
                                    if (/^\d+$/.test(trimmed)) {
                                        return [2 /*return*/, trimmed];
                                    }
                                    return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                                case 1:
                                    ok = _b.sent();
                                    if (!ok) {
                                        return [2 /*return*/, null];
                                    }
                                    return [4 /*yield*/, (0, zca_js_1.runZca)(["friend", "find", trimmed], {
                                            profile: resolved.profile,
                                            timeout: 15000,
                                        })];
                                case 2:
                                    result = _b.sent();
                                    if (!result.ok) {
                                        return [2 /*return*/, null];
                                    }
                                    parsed = (0, zca_js_1.parseJsonOutput)(result.stdout);
                                    rows = Array.isArray(parsed) ? parsed : [];
                                    match = rows[0];
                                    if (!(match === null || match === void 0 ? void 0 : match.userId)) {
                                        return [2 /*return*/, null];
                                    }
                                    if (!(rows.length > 1)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, prompter.note("Multiple matches for \"".concat(trimmed, "\", using ").concat((_a = match.displayName) !== null && _a !== void 0 ? _a : match.userId, "."), "Zalo Personal allowlist")];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: return [2 /*return*/, String(match.userId)];
                            }
                        });
                    }); };
                    _loop_1 = function () {
                        var entry, parts, results, unresolved, merged, unique;
                        var _q;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0: return [4 /*yield*/, prompter.text({
                                        message: "Zalouser allowFrom (username or user id)",
                                        placeholder: "Alice, 123456789",
                                        initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                                        validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                                    })];
                                case 1:
                                    entry = _r.sent();
                                    parts = parseInput(String(entry));
                                    return [4 /*yield*/, Promise.all(parts.map(function (part) { return resolveUserId(part); }))];
                                case 2:
                                    results = _r.sent();
                                    unresolved = parts.filter(function (_, idx) { return !results[idx]; });
                                    if (!(unresolved.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, prompter.note("Could not resolve: ".concat(unresolved.join(", "), ". Use numeric user ids or ensure zca is available."), "Zalo Personal allowlist")];
                                case 3:
                                    _r.sent();
                                    return [2 /*return*/, "continue"];
                                case 4:
                                    merged = __spreadArray(__spreadArray([], existingAllowFrom.map(function (item) { return String(item).trim(); }).filter(Boolean), true), results.filter(Boolean), true);
                                    unique = __spreadArray([], new Set(merged), true);
                                    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                                        return [2 /*return*/, { value: __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.zalouser), { enabled: true, dmPolicy: "allowlist", allowFrom: unique }) }) }) }];
                                    }
                                    return [2 /*return*/, { value: __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalouser), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.zalouser) === null || _e === void 0 ? void 0 : _e.accounts), (_q = {}, _q[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.zalouser) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.zalouser) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, dmPolicy: "allowlist", allowFrom: unique }), _q)) }) }) }) }];
                            }
                        });
                    };
                    _p.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _p.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setZalouserGroupPolicy(cfg, accountId, groupPolicy) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.zalouser), { enabled: true, groupPolicy: groupPolicy }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalouser), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.zalouser) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.zalouser) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.zalouser) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, groupPolicy: groupPolicy }), _a)) }) }) });
}
function setZalouserGroupAllowlist(cfg, accountId, groupKeys) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var groups = Object.fromEntries(groupKeys.map(function (key) { return [key, { allow: true }]; }));
    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.zalouser), { enabled: true, groups: groups }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { zalouser: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.zalouser), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.zalouser) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.zalouser) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: (_o = (_m = (_l = (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.zalouser) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]) === null || _m === void 0 ? void 0 : _m.enabled) !== null && _o !== void 0 ? _o : true, groups: groups }), _a)) }) }) });
}
function resolveZalouserGroups(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, result, groups, byName, _i, groups_1, group, name_1, list;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: params.cfg, accountId: params.accountId });
                    return [4 /*yield*/, (0, zca_js_1.runZca)(["group", "list", "-j"], {
                            profile: account.profile,
                            timeout: 15000,
                        })];
                case 1:
                    result = _d.sent();
                    if (!result.ok) {
                        throw new Error(result.stderr || "Failed to list groups");
                    }
                    groups = ((_a = (0, zca_js_1.parseJsonOutput)(result.stdout)) !== null && _a !== void 0 ? _a : []).filter(function (group) {
                        return Boolean(group.groupId);
                    });
                    byName = new Map();
                    for (_i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                        group = groups_1[_i];
                        name_1 = (_b = group.name) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                        if (!name_1) {
                            continue;
                        }
                        list = (_c = byName.get(name_1)) !== null && _c !== void 0 ? _c : [];
                        list.push(group);
                        byName.set(name_1, list);
                    }
                    return [2 /*return*/, params.entries.map(function (input) {
                            var _a;
                            var trimmed = input.trim();
                            if (!trimmed) {
                                return { input: input, resolved: false };
                            }
                            if (/^\d+$/.test(trimmed)) {
                                return { input: input, resolved: true, id: trimmed };
                            }
                            var matches = (_a = byName.get(trimmed.toLowerCase())) !== null && _a !== void 0 ? _a : [];
                            var match = matches[0];
                            return (match === null || match === void 0 ? void 0 : match.groupId)
                                ? { input: input, resolved: true, id: String(match.groupId) }
                                : { input: input, resolved: false };
                        })];
            }
        });
    });
}
var dmPolicy = {
    label: "Zalo Personal",
    channel: channel,
    policyKey: "channels.zalouser.dmPolicy",
    allowFromKey: "channels.zalouser.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return ((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.zalouser) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"); },
    setPolicy: function (cfg, policy) { return setZalouserDmPolicy(cfg, policy); },
    promptAllowFrom: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id;
        var _c;
        var cfg = _b.cfg, prompter = _b.prompter, accountId = _b.accountId;
        return __generator(this, function (_d) {
            id = accountId && (0, plugin_sdk_1.normalizeAccountId)(accountId)
                ? ((_c = (0, plugin_sdk_1.normalizeAccountId)(accountId)) !== null && _c !== void 0 ? _c : plugin_sdk_1.DEFAULT_ACCOUNT_ID)
                : (0, accounts_js_1.resolveDefaultZalouserAccountId)(cfg);
            return [2 /*return*/, promptZalouserAllowFrom({
                    cfg: cfg,
                    prompter: prompter,
                    accountId: id,
                })];
        });
    }); },
};
exports.zalouserOnboardingAdapter = {
    channel: channel,
    dmPolicy: dmPolicy,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var ids, configured, _i, ids_1, accountId, account, isAuth;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ids = (0, accounts_js_1.listZalouserAccountIds)(cfg);
                    configured = false;
                    _i = 0, ids_1 = ids;
                    _c.label = 1;
                case 1:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                    accountId = ids_1[_i];
                    account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: cfg, accountId: accountId });
                    return [4 /*yield*/, (0, accounts_js_1.checkZcaAuthenticated)(account.profile)];
                case 2:
                    isAuth = _c.sent();
                    if (isAuth) {
                        configured = true;
                        return [3 /*break*/, 4];
                    }
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        channel: channel,
                        configured: configured,
                        statusLines: ["Zalo Personal: ".concat(configured ? "logged in" : "needs QR login")],
                        selectionHint: configured ? "recommended · logged in" : "recommended · QR login",
                        quickstartScore: configured ? 1 : 15,
                    }];
            }
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var zcaInstalled, zalouserOverride, defaultAccountId, accountId, next, account, alreadyAuthenticated, wantsLogin, result, isNowAuth, keepSession, accessConfig, keys, resolved, resolvedIds, unresolved, err_1;
        var _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, zca_js_1.checkZcaInstalled)()];
                case 1:
                    zcaInstalled = _p.sent();
                    if (!!zcaInstalled) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter.note([
                            "The `zca` binary was not found in PATH.",
                            "",
                            "Install zca-cli, then re-run onboarding:",
                            "Docs: https://docs.openclaw.ai/channels/zalouser",
                        ].join("\n"), "Missing Dependency")];
                case 2:
                    _p.sent();
                    return [2 /*return*/, { cfg: cfg, accountId: plugin_sdk_1.DEFAULT_ACCOUNT_ID }];
                case 3:
                    zalouserOverride = (_d = accountOverrides.zalouser) === null || _d === void 0 ? void 0 : _d.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultZalouserAccountId)(cfg);
                    accountId = zalouserOverride ? (0, plugin_sdk_1.normalizeAccountId)(zalouserOverride) : defaultAccountId;
                    if (!(shouldPromptAccountIds && !zalouserOverride)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Zalo Personal",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listZalouserAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 4:
                    accountId = _p.sent();
                    _p.label = 5;
                case 5:
                    next = cfg;
                    account = (0, accounts_js_1.resolveZalouserAccountSync)({ cfg: next, accountId: accountId });
                    return [4 /*yield*/, (0, accounts_js_1.checkZcaAuthenticated)(account.profile)];
                case 6:
                    alreadyAuthenticated = _p.sent();
                    if (!!alreadyAuthenticated) return [3 /*break*/, 16];
                    return [4 /*yield*/, noteZalouserHelp(prompter)];
                case 7:
                    _p.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Login via QR code now?",
                            initialValue: true,
                        })];
                case 8:
                    wantsLogin = _p.sent();
                    if (!wantsLogin) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.note("A QR code will appear in your terminal.\nScan it with your Zalo app to login.", "QR Login")];
                case 9:
                    _p.sent();
                    return [4 /*yield*/, (0, zca_js_1.runZcaInteractive)(["auth", "login"], {
                            profile: account.profile,
                        })];
                case 10:
                    result = _p.sent();
                    if (!!result.ok) return [3 /*break*/, 12];
                    return [4 /*yield*/, prompter.note("Login failed: ".concat(result.stderr || "Unknown error"), "Error")];
                case 11:
                    _p.sent();
                    return [3 /*break*/, 15];
                case 12: return [4 /*yield*/, (0, accounts_js_1.checkZcaAuthenticated)(account.profile)];
                case 13:
                    isNowAuth = _p.sent();
                    if (!isNowAuth) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.note("Login successful!", "Success")];
                case 14:
                    _p.sent();
                    _p.label = 15;
                case 15: return [3 /*break*/, 20];
                case 16: return [4 /*yield*/, prompter.confirm({
                        message: "Zalo Personal already logged in. Keep session?",
                        initialValue: true,
                    })];
                case 17:
                    keepSession = _p.sent();
                    if (!!keepSession) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, zca_js_1.runZcaInteractive)(["auth", "logout"], { profile: account.profile })];
                case 18:
                    _p.sent();
                    return [4 /*yield*/, (0, zca_js_1.runZcaInteractive)(["auth", "login"], { profile: account.profile })];
                case 19:
                    _p.sent();
                    _p.label = 20;
                case 20:
                    // Enable the channel
                    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalouser: __assign(__assign({}, (_e = next.channels) === null || _e === void 0 ? void 0 : _e.zalouser), { enabled: true, profile: account.profile !== "default" ? account.profile : undefined }) }) });
                    }
                    else {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { zalouser: __assign(__assign({}, (_f = next.channels) === null || _f === void 0 ? void 0 : _f.zalouser), { enabled: true, accounts: __assign(__assign({}, (_h = (_g = next.channels) === null || _g === void 0 ? void 0 : _g.zalouser) === null || _h === void 0 ? void 0 : _h.accounts), (_c = {}, _c[accountId] = __assign(__assign({}, (_l = (_k = (_j = next.channels) === null || _j === void 0 ? void 0 : _j.zalouser) === null || _k === void 0 ? void 0 : _k.accounts) === null || _l === void 0 ? void 0 : _l[accountId]), { enabled: true, profile: account.profile }), _c)) }) }) });
                    }
                    if (!forceAllowFrom) return [3 /*break*/, 22];
                    return [4 /*yield*/, promptZalouserAllowFrom({
                            cfg: next,
                            prompter: prompter,
                            accountId: accountId,
                        })];
                case 21:
                    next = _p.sent();
                    _p.label = 22;
                case 22: return [4 /*yield*/, (0, plugin_sdk_1.promptChannelAccessConfig)({
                        prompter: prompter,
                        label: "Zalo groups",
                        currentPolicy: (_m = account.config.groupPolicy) !== null && _m !== void 0 ? _m : "open",
                        currentEntries: Object.keys((_o = account.config.groups) !== null && _o !== void 0 ? _o : {}),
                        placeholder: "Family, Work, 123456789",
                        updatePrompt: Boolean(account.config.groups),
                    })];
                case 23:
                    accessConfig = _p.sent();
                    if (!accessConfig) return [3 /*break*/, 32];
                    if (!(accessConfig.policy !== "allowlist")) return [3 /*break*/, 24];
                    next = setZalouserGroupPolicy(next, accountId, accessConfig.policy);
                    return [3 /*break*/, 32];
                case 24:
                    keys = accessConfig.entries;
                    if (!(accessConfig.entries.length > 0)) return [3 /*break*/, 31];
                    _p.label = 25;
                case 25:
                    _p.trys.push([25, 29, , 31]);
                    return [4 /*yield*/, resolveZalouserGroups({
                            cfg: next,
                            accountId: accountId,
                            entries: accessConfig.entries,
                        })];
                case 26:
                    resolved = _p.sent();
                    resolvedIds = resolved
                        .filter(function (entry) { return entry.resolved && entry.id; })
                        .map(function (entry) { return entry.id; });
                    unresolved = resolved
                        .filter(function (entry) { return !entry.resolved; })
                        .map(function (entry) { return entry.input; });
                    keys = __spreadArray(__spreadArray([], resolvedIds, true), unresolved.map(function (entry) { return entry.trim(); }).filter(Boolean), true);
                    if (!(resolvedIds.length > 0 || unresolved.length > 0)) return [3 /*break*/, 28];
                    return [4 /*yield*/, prompter.note([
                            resolvedIds.length > 0 ? "Resolved: ".concat(resolvedIds.join(", ")) : undefined,
                            unresolved.length > 0
                                ? "Unresolved (kept as typed): ".concat(unresolved.join(", "))
                                : undefined,
                        ]
                            .filter(Boolean)
                            .join("\n"), "Zalo groups")];
                case 27:
                    _p.sent();
                    _p.label = 28;
                case 28: return [3 /*break*/, 31];
                case 29:
                    err_1 = _p.sent();
                    return [4 /*yield*/, prompter.note("Group lookup failed; keeping entries as typed. ".concat(String(err_1)), "Zalo groups")];
                case 30:
                    _p.sent();
                    return [3 /*break*/, 31];
                case 31:
                    next = setZalouserGroupPolicy(next, accountId, "allowlist");
                    next = setZalouserGroupAllowlist(next, accountId, keys);
                    _p.label = 32;
                case 32: return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
};
