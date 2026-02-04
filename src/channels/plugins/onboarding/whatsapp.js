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
exports.whatsappOnboardingAdapter = void 0;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var channel_web_js_1 = require("../../../channel-web.js");
var command_format_js_1 = require("../../../cli/command-format.js");
var merge_config_js_1 = require("../../../config/merge-config.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var links_js_1 = require("../../../terminal/links.js");
var utils_js_1 = require("../../../utils.js");
var accounts_js_1 = require("../../../web/accounts.js");
var helpers_js_1 = require("./helpers.js");
var channel = "whatsapp";
function setWhatsAppDmPolicy(cfg, dmPolicy) {
    return (0, merge_config_js_1.mergeWhatsAppConfig)(cfg, { dmPolicy: dmPolicy });
}
function setWhatsAppAllowFrom(cfg, allowFrom) {
    return (0, merge_config_js_1.mergeWhatsAppConfig)(cfg, { allowFrom: allowFrom }, { unsetOnUndefined: ["allowFrom"] });
}
function setWhatsAppSelfChatMode(cfg, selfChatMode) {
    return (0, merge_config_js_1.mergeWhatsAppConfig)(cfg, { selfChatMode: selfChatMode });
}
function pathExists(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(filePath)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function detectWhatsAppLinked(cfg, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var authDir, credsPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({ cfg: cfg, accountId: accountId }).authDir;
                    credsPath = node_path_1.default.join(authDir, "creds.json");
                    return [4 /*yield*/, pathExists(credsPath)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function promptWhatsAppAllowFrom(cfg, _runtime, prompter, options) {
    return __awaiter(this, void 0, void 0, function () {
        var existingPolicy, existingAllowFrom, existingLabel, entry, normalized, merged, unique, next_1, phoneMode, entry, normalized, merged, unique, next_2, policy, next, allowOptions, mode, allowRaw, parts, normalized, unique;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    existingPolicy = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing";
                    existingAllowFrom = (_f = (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.whatsapp) === null || _e === void 0 ? void 0 : _e.allowFrom) !== null && _f !== void 0 ? _f : [];
                    existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
                    if (!(options === null || options === void 0 ? void 0 : options.forceAllowlist)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prompter.note("We need the sender/owner number so OpenClaw can allowlist you.", "WhatsApp number")];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "Your personal WhatsApp number (the phone you will message from)",
                            placeholder: "+15555550123",
                            initialValue: existingAllowFrom[0],
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                var normalized = (0, utils_js_1.normalizeE164)(raw);
                                if (!normalized) {
                                    return "Invalid number: ".concat(raw);
                                }
                                return undefined;
                            },
                        })];
                case 2:
                    entry = _g.sent();
                    normalized = (0, utils_js_1.normalizeE164)(String(entry).trim());
                    merged = __spreadArray(__spreadArray([], existingAllowFrom
                        .filter(function (item) { return item !== "*"; })
                        .map(function (item) { return (0, utils_js_1.normalizeE164)(item); })
                        .filter(Boolean), true), [
                        normalized,
                    ], false);
                    unique = __spreadArray([], new Set(merged.filter(Boolean)), true);
                    next_1 = setWhatsAppSelfChatMode(cfg, true);
                    next_1 = setWhatsAppDmPolicy(next_1, "allowlist");
                    next_1 = setWhatsAppAllowFrom(next_1, unique);
                    return [4 /*yield*/, prompter.note(["Allowlist mode enabled.", "- allowFrom includes ".concat(normalized)].join("\n"), "WhatsApp allowlist")];
                case 3:
                    _g.sent();
                    return [2 /*return*/, next_1];
                case 4: return [4 /*yield*/, prompter.note([
                        "WhatsApp direct chats are gated by `channels.whatsapp.dmPolicy` + `channels.whatsapp.allowFrom`.",
                        "- pairing (default): unknown senders get a pairing code; owner approves",
                        "- allowlist: unknown senders are blocked",
                        '- open: public inbound DMs (requires allowFrom to include "*")',
                        "- disabled: ignore WhatsApp DMs",
                        "",
                        "Current: dmPolicy=".concat(existingPolicy, ", allowFrom=").concat(existingLabel),
                        "Docs: ".concat((0, links_js_1.formatDocsLink)("/whatsapp", "whatsapp")),
                    ].join("\n"), "WhatsApp DM access")];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, prompter.select({
                            message: "WhatsApp phone setup",
                            options: [
                                { value: "personal", label: "This is my personal phone number" },
                                { value: "separate", label: "Separate phone just for OpenClaw" },
                            ],
                        })];
                case 6:
                    phoneMode = _g.sent();
                    if (!(phoneMode === "personal")) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.note("We need the sender/owner number so OpenClaw can allowlist you.", "WhatsApp number")];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "Your personal WhatsApp number (the phone you will message from)",
                            placeholder: "+15555550123",
                            initialValue: existingAllowFrom[0],
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                var normalized = (0, utils_js_1.normalizeE164)(raw);
                                if (!normalized) {
                                    return "Invalid number: ".concat(raw);
                                }
                                return undefined;
                            },
                        })];
                case 8:
                    entry = _g.sent();
                    normalized = (0, utils_js_1.normalizeE164)(String(entry).trim());
                    merged = __spreadArray(__spreadArray([], existingAllowFrom
                        .filter(function (item) { return item !== "*"; })
                        .map(function (item) { return (0, utils_js_1.normalizeE164)(item); })
                        .filter(Boolean), true), [
                        normalized,
                    ], false);
                    unique = __spreadArray([], new Set(merged.filter(Boolean)), true);
                    next_2 = setWhatsAppSelfChatMode(cfg, true);
                    next_2 = setWhatsAppDmPolicy(next_2, "allowlist");
                    next_2 = setWhatsAppAllowFrom(next_2, unique);
                    return [4 /*yield*/, prompter.note([
                            "Personal phone mode enabled.",
                            "- dmPolicy set to allowlist (pairing skipped)",
                            "- allowFrom includes ".concat(normalized),
                        ].join("\n"), "WhatsApp personal phone")];
                case 9:
                    _g.sent();
                    return [2 /*return*/, next_2];
                case 10: return [4 /*yield*/, prompter.select({
                        message: "WhatsApp DM policy",
                        options: [
                            { value: "pairing", label: "Pairing (recommended)" },
                            { value: "allowlist", label: "Allowlist only (block unknown senders)" },
                            { value: "open", label: "Open (public inbound DMs)" },
                            { value: "disabled", label: "Disabled (ignore WhatsApp DMs)" },
                        ],
                    })];
                case 11:
                    policy = (_g.sent());
                    next = setWhatsAppSelfChatMode(cfg, false);
                    next = setWhatsAppDmPolicy(next, policy);
                    if (policy === "open") {
                        next = setWhatsAppAllowFrom(next, ["*"]);
                    }
                    if (policy === "disabled") {
                        return [2 /*return*/, next];
                    }
                    allowOptions = existingAllowFrom.length > 0
                        ? [
                            { value: "keep", label: "Keep current allowFrom" },
                            {
                                value: "unset",
                                label: "Unset allowFrom (use pairing approvals only)",
                            },
                            { value: "list", label: "Set allowFrom to specific numbers" },
                        ]
                        : [
                            { value: "unset", label: "Unset allowFrom (default)" },
                            { value: "list", label: "Set allowFrom to specific numbers" },
                        ];
                    return [4 /*yield*/, prompter.select({
                            message: "WhatsApp allowFrom (optional pre-allowlist)",
                            options: allowOptions.map(function (opt) { return ({
                                value: opt.value,
                                label: opt.label,
                            }); }),
                        })];
                case 12:
                    mode = _g.sent();
                    if (!(mode === "keep")) return [3 /*break*/, 13];
                    return [3 /*break*/, 16];
                case 13:
                    if (!(mode === "unset")) return [3 /*break*/, 14];
                    next = setWhatsAppAllowFrom(next, undefined);
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, prompter.text({
                        message: "Allowed sender numbers (comma-separated, E.164)",
                        placeholder: "+15555550123, +447700900123",
                        validate: function (value) {
                            var raw = String(value !== null && value !== void 0 ? value : "").trim();
                            if (!raw) {
                                return "Required";
                            }
                            var parts = raw
                                .split(/[\n,;]+/g)
                                .map(function (p) { return p.trim(); })
                                .filter(Boolean);
                            if (parts.length === 0) {
                                return "Required";
                            }
                            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                                var part = parts_1[_i];
                                if (part === "*") {
                                    continue;
                                }
                                var normalized_1 = (0, utils_js_1.normalizeE164)(part);
                                if (!normalized_1) {
                                    return "Invalid number: ".concat(part);
                                }
                            }
                            return undefined;
                        },
                    })];
                case 15:
                    allowRaw = _g.sent();
                    parts = String(allowRaw)
                        .split(/[\n,;]+/g)
                        .map(function (p) { return p.trim(); })
                        .filter(Boolean);
                    normalized = parts.map(function (part) { return (part === "*" ? "*" : (0, utils_js_1.normalizeE164)(part)); });
                    unique = __spreadArray([], new Set(normalized.filter(Boolean)), true);
                    next = setWhatsAppAllowFrom(next, unique);
                    _g.label = 16;
                case 16: return [2 /*return*/, next];
            }
        });
    });
}
exports.whatsappOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var overrideId, defaultAccountId, accountId, linked, accountLabel;
        var _c;
        var cfg = _b.cfg, accountOverrides = _b.accountOverrides;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    overrideId = (_c = accountOverrides.whatsapp) === null || _c === void 0 ? void 0 : _c.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultWhatsAppAccountId)(cfg);
                    accountId = overrideId ? (0, session_key_js_1.normalizeAccountId)(overrideId) : defaultAccountId;
                    return [4 /*yield*/, detectWhatsAppLinked(cfg, accountId)];
                case 1:
                    linked = _d.sent();
                    accountLabel = accountId === session_key_js_1.DEFAULT_ACCOUNT_ID ? "default" : accountId;
                    return [2 /*return*/, {
                            channel: channel,
                            configured: linked,
                            statusLines: ["WhatsApp (".concat(accountLabel, "): ").concat(linked ? "linked" : "not linked")],
                            selectionHint: linked ? "linked" : "not linked",
                            quickstartScore: linked ? 5 : 4,
                        }];
            }
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var overrideId, accountId, next, linked, authDir, wantsLink, err_1;
        var _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var cfg = _b.cfg, runtime = _b.runtime, prompter = _b.prompter, options = _b.options, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    overrideId = (_d = accountOverrides.whatsapp) === null || _d === void 0 ? void 0 : _d.trim();
                    accountId = overrideId
                        ? (0, session_key_js_1.normalizeAccountId)(overrideId)
                        : (0, accounts_js_1.resolveDefaultWhatsAppAccountId)(cfg);
                    if (!(shouldPromptAccountIds || (options === null || options === void 0 ? void 0 : options.promptWhatsAppAccountId))) return [3 /*break*/, 2];
                    if (!!overrideId) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "WhatsApp",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listWhatsAppAccountIds,
                            defaultAccountId: (0, accounts_js_1.resolveDefaultWhatsAppAccountId)(cfg),
                        })];
                case 1:
                    accountId = _r.sent();
                    _r.label = 2;
                case 2:
                    next = cfg;
                    if (accountId !== session_key_js_1.DEFAULT_ACCOUNT_ID) {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { whatsapp: __assign(__assign({}, (_e = next.channels) === null || _e === void 0 ? void 0 : _e.whatsapp), { accounts: __assign(__assign({}, (_g = (_f = next.channels) === null || _f === void 0 ? void 0 : _f.whatsapp) === null || _g === void 0 ? void 0 : _g.accounts), (_c = {}, _c[accountId] = __assign(__assign({}, (_k = (_j = (_h = next.channels) === null || _h === void 0 ? void 0 : _h.whatsapp) === null || _j === void 0 ? void 0 : _j.accounts) === null || _k === void 0 ? void 0 : _k[accountId]), { enabled: (_q = (_p = (_o = (_m = (_l = next.channels) === null || _l === void 0 ? void 0 : _l.whatsapp) === null || _m === void 0 ? void 0 : _m.accounts) === null || _o === void 0 ? void 0 : _o[accountId]) === null || _p === void 0 ? void 0 : _p.enabled) !== null && _q !== void 0 ? _q : true }), _c)) }) }) });
                    }
                    return [4 /*yield*/, detectWhatsAppLinked(next, accountId)];
                case 3:
                    linked = _r.sent();
                    authDir = (0, accounts_js_1.resolveWhatsAppAuthDir)({
                        cfg: next,
                        accountId: accountId,
                    }).authDir;
                    if (!!linked) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.note([
                            "Scan the QR with WhatsApp on your phone.",
                            "Credentials are stored under ".concat(authDir, "/ for future runs."),
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/whatsapp", "whatsapp")),
                        ].join("\n"), "WhatsApp linking")];
                case 4:
                    _r.sent();
                    _r.label = 5;
                case 5: return [4 /*yield*/, prompter.confirm({
                        message: linked ? "WhatsApp already linked. Re-link now?" : "Link WhatsApp now (QR)?",
                        initialValue: !linked,
                    })];
                case 6:
                    wantsLink = _r.sent();
                    if (!wantsLink) return [3 /*break*/, 12];
                    _r.label = 7;
                case 7:
                    _r.trys.push([7, 9, , 11]);
                    return [4 /*yield*/, (0, channel_web_js_1.loginWeb)(false, undefined, runtime, accountId)];
                case 8:
                    _r.sent();
                    return [3 /*break*/, 11];
                case 9:
                    err_1 = _r.sent();
                    runtime.error("WhatsApp login failed: ".concat(String(err_1)));
                    return [4 /*yield*/, prompter.note("Docs: ".concat((0, links_js_1.formatDocsLink)("/whatsapp", "whatsapp")), "WhatsApp help")];
                case 10:
                    _r.sent();
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 14];
                case 12:
                    if (!!linked) return [3 /*break*/, 14];
                    return [4 /*yield*/, prompter.note("Run `".concat((0, command_format_js_1.formatCliCommand)("openclaw channels login"), "` later to link WhatsApp."), "WhatsApp")];
                case 13:
                    _r.sent();
                    _r.label = 14;
                case 14: return [4 /*yield*/, promptWhatsAppAllowFrom(next, runtime, prompter, {
                        forceAllowlist: forceAllowFrom,
                    })];
                case 15:
                    next = _r.sent();
                    return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
    onAccountRecorded: function (accountId, options) {
        var _a;
        (_a = options === null || options === void 0 ? void 0 : options.onWhatsAppAccountId) === null || _a === void 0 ? void 0 : _a.call(options, accountId);
    },
};
