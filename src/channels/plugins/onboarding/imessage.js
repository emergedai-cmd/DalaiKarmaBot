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
exports.imessageOnboardingAdapter = void 0;
var onboard_helpers_js_1 = require("../../../commands/onboard-helpers.js");
var accounts_js_1 = require("../../../imessage/accounts.js");
var targets_js_1 = require("../../../imessage/targets.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var links_js_1 = require("../../../terminal/links.js");
var helpers_js_1 = require("./helpers.js");
var channel = "imessage";
function setIMessageDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, helpers_js_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { imessage: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.imessage), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function setIMessageAllowFrom(cfg, accountId, allowFrom) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h;
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { imessage: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.imessage), { allowFrom: allowFrom }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { imessage: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.imessage), { accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.imessage) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.imessage) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { allowFrom: allowFrom }), _a)) }) }) });
}
function parseIMessageAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function promptIMessageAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, resolved, existing, entry, parts, unique;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    accountId = params.accountId && (0, session_key_js_1.normalizeAccountId)(params.accountId)
                        ? ((_a = (0, session_key_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID)
                        : (0, accounts_js_1.resolveDefaultIMessageAccountId)(params.cfg);
                    resolved = (0, accounts_js_1.resolveIMessageAccount)({ cfg: params.cfg, accountId: accountId });
                    existing = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist iMessage DMs by handle or chat target.",
                            "Examples:",
                            "- +15555550123",
                            "- user@example.com",
                            "- chat_id:123",
                            "- chat_guid:... or chat_identifier:...",
                            "Multiple entries: comma-separated.",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/imessage", "imessage")),
                        ].join("\n"), "iMessage allowlist")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, params.prompter.text({
                            message: "iMessage allowFrom (handle or chat_id)",
                            placeholder: "+15555550123, user@example.com, chat_id:123",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                var parts = parseIMessageAllowFromInput(raw);
                                for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                                    var part = parts_1[_i];
                                    if (part === "*") {
                                        continue;
                                    }
                                    if (part.toLowerCase().startsWith("chat_id:")) {
                                        var id = part.slice("chat_id:".length).trim();
                                        if (!/^\d+$/.test(id)) {
                                            return "Invalid chat_id: ".concat(part);
                                        }
                                        continue;
                                    }
                                    if (part.toLowerCase().startsWith("chat_guid:")) {
                                        if (!part.slice("chat_guid:".length).trim()) {
                                            return "Invalid chat_guid entry";
                                        }
                                        continue;
                                    }
                                    if (part.toLowerCase().startsWith("chat_identifier:")) {
                                        if (!part.slice("chat_identifier:".length).trim()) {
                                            return "Invalid chat_identifier entry";
                                        }
                                        continue;
                                    }
                                    if (!(0, targets_js_1.normalizeIMessageHandle)(part)) {
                                        return "Invalid handle: ".concat(part);
                                    }
                                }
                                return undefined;
                            },
                        })];
                case 2:
                    entry = _c.sent();
                    parts = parseIMessageAllowFromInput(String(entry));
                    unique = __spreadArray([], new Set(parts), true);
                    return [2 /*return*/, setIMessageAllowFrom(params.cfg, accountId, unique)];
            }
        });
    });
}
var dmPolicy = {
    label: "iMessage",
    channel: channel,
    policyKey: "channels.imessage.dmPolicy",
    allowFromKey: "channels.imessage.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setIMessageDmPolicy(cfg, policy); },
    promptAllowFrom: promptIMessageAllowFrom,
};
exports.imessageOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured, imessageCliPath, imessageCliDetected;
        var _c, _d, _e;
        var cfg = _b.cfg;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    configured = (0, accounts_js_1.listIMessageAccountIds)(cfg).some(function (accountId) {
                        var account = (0, accounts_js_1.resolveIMessageAccount)({ cfg: cfg, accountId: accountId });
                        return Boolean(account.config.cliPath ||
                            account.config.dbPath ||
                            account.config.allowFrom ||
                            account.config.service ||
                            account.config.region);
                    });
                    imessageCliPath = (_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.imessage) === null || _d === void 0 ? void 0 : _d.cliPath) !== null && _e !== void 0 ? _e : "imsg";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)(imessageCliPath)];
                case 1:
                    imessageCliDetected = _f.sent();
                    return [2 /*return*/, {
                            channel: channel,
                            configured: configured,
                            statusLines: [
                                "iMessage: ".concat(configured ? "configured" : "needs setup"),
                                "imsg: ".concat(imessageCliDetected ? "found" : "missing", " (").concat(imessageCliPath, ")"),
                            ],
                            selectionHint: imessageCliDetected ? "imsg found" : "imsg missing",
                            quickstartScore: imessageCliDetected ? 1 : 0,
                        }];
            }
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var imessageOverride, defaultIMessageAccountId, imessageAccountId, next, resolvedAccount, resolvedCliPath, cliDetected, entered;
        var _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    imessageOverride = (_d = accountOverrides.imessage) === null || _d === void 0 ? void 0 : _d.trim();
                    defaultIMessageAccountId = (0, accounts_js_1.resolveDefaultIMessageAccountId)(cfg);
                    imessageAccountId = imessageOverride
                        ? (0, session_key_js_1.normalizeAccountId)(imessageOverride)
                        : defaultIMessageAccountId;
                    if (!(shouldPromptAccountIds && !imessageOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "iMessage",
                            currentId: imessageAccountId,
                            listAccountIds: accounts_js_1.listIMessageAccountIds,
                            defaultAccountId: defaultIMessageAccountId,
                        })];
                case 1:
                    imessageAccountId = _t.sent();
                    _t.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveIMessageAccount)({
                        cfg: next,
                        accountId: imessageAccountId,
                    });
                    resolvedCliPath = (_e = resolvedAccount.config.cliPath) !== null && _e !== void 0 ? _e : "imsg";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)(resolvedCliPath)];
                case 3:
                    cliDetected = _t.sent();
                    if (!!cliDetected) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.text({
                            message: "imsg CLI path",
                            initialValue: resolvedCliPath,
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 4:
                    entered = _t.sent();
                    resolvedCliPath = String(entered).trim();
                    if (!!resolvedCliPath) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompter.note("imsg CLI path required to enable iMessage.", "iMessage")];
                case 5:
                    _t.sent();
                    _t.label = 6;
                case 6:
                    if (resolvedCliPath) {
                        if (imessageAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { imessage: __assign(__assign({}, (_f = next.channels) === null || _f === void 0 ? void 0 : _f.imessage), { enabled: true, cliPath: resolvedCliPath }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { imessage: __assign(__assign({}, (_g = next.channels) === null || _g === void 0 ? void 0 : _g.imessage), { enabled: true, accounts: __assign(__assign({}, (_j = (_h = next.channels) === null || _h === void 0 ? void 0 : _h.imessage) === null || _j === void 0 ? void 0 : _j.accounts), (_c = {}, _c[imessageAccountId] = __assign(__assign({}, (_m = (_l = (_k = next.channels) === null || _k === void 0 ? void 0 : _k.imessage) === null || _l === void 0 ? void 0 : _l.accounts) === null || _m === void 0 ? void 0 : _m[imessageAccountId]), { enabled: (_s = (_r = (_q = (_p = (_o = next.channels) === null || _o === void 0 ? void 0 : _o.imessage) === null || _p === void 0 ? void 0 : _p.accounts) === null || _q === void 0 ? void 0 : _q[imessageAccountId]) === null || _r === void 0 ? void 0 : _r.enabled) !== null && _s !== void 0 ? _s : true, cliPath: resolvedCliPath }), _c)) }) }) });
                        }
                    }
                    return [4 /*yield*/, prompter.note([
                            "This is still a work in progress.",
                            "Ensure OpenClaw has Full Disk Access to Messages DB.",
                            "Grant Automation permission for Messages when prompted.",
                            "List chats with: imsg chats --limit 20",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/imessage", "imessage")),
                        ].join("\n"), "iMessage next steps")];
                case 7:
                    _t.sent();
                    return [2 /*return*/, { cfg: next, accountId: imessageAccountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { imessage: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.imessage), { enabled: false }) }) }));
    },
};
