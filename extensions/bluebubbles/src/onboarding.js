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
exports.blueBubblesOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var targets_js_1 = require("./targets.js");
var types_js_1 = require("./types.js");
var channel = "bluebubbles";
function setBlueBubblesDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, plugin_sdk_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { bluebubbles: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.bluebubbles), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function setBlueBubblesAllowFrom(cfg, accountId, allowFrom) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h;
    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { bluebubbles: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.bluebubbles), { allowFrom: allowFrom }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { bluebubbles: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.bluebubbles), { accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.bluebubbles) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.bluebubbles) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { allowFrom: allowFrom }), _a)) }) }) });
}
function parseBlueBubblesAllowFromInput(raw) {
    return raw
        .split(/[\n,]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function promptBlueBubblesAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, resolved, existing, entry, parts, unique;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    accountId = params.accountId && (0, plugin_sdk_1.normalizeAccountId)(params.accountId)
                        ? ((_a = (0, plugin_sdk_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : plugin_sdk_1.DEFAULT_ACCOUNT_ID)
                        : (0, accounts_js_1.resolveDefaultBlueBubblesAccountId)(params.cfg);
                    resolved = (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: params.cfg, accountId: accountId });
                    existing = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist BlueBubbles DMs by handle or chat target.",
                            "Examples:",
                            "- +15555550123",
                            "- user@example.com",
                            "- chat_id:123",
                            "- chat_guid:iMessage;-;+15555550123",
                            "Multiple entries: comma- or newline-separated.",
                            "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/bluebubbles", "bluebubbles")),
                        ].join("\n"), "BlueBubbles allowlist")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, params.prompter.text({
                            message: "BlueBubbles allowFrom (handle or chat_id)",
                            placeholder: "+15555550123, user@example.com, chat_id:123",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                var parts = parseBlueBubblesAllowFromInput(raw);
                                for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                                    var part = parts_1[_i];
                                    if (part === "*") {
                                        continue;
                                    }
                                    var parsed = (0, targets_js_1.parseBlueBubblesAllowTarget)(part);
                                    if (parsed.kind === "handle" && !parsed.handle) {
                                        return "Invalid entry: ".concat(part);
                                    }
                                }
                                return undefined;
                            },
                        })];
                case 2:
                    entry = _c.sent();
                    parts = parseBlueBubblesAllowFromInput(String(entry));
                    unique = __spreadArray([], new Set(parts), true);
                    return [2 /*return*/, setBlueBubblesAllowFrom(params.cfg, accountId, unique)];
            }
        });
    });
}
var dmPolicy = {
    label: "BlueBubbles",
    channel: channel,
    policyKey: "channels.bluebubbles.dmPolicy",
    allowFromKey: "channels.bluebubbles.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setBlueBubblesDmPolicy(cfg, policy); },
    promptAllowFrom: promptBlueBubblesAllowFrom,
};
exports.blueBubblesOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listBlueBubblesAccountIds)(cfg).some(function (accountId) {
                var account = (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: cfg, accountId: accountId });
                return account.configured;
            });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["BlueBubbles: ".concat(configured ? "configured" : "needs setup")],
                    selectionHint: configured ? "configured" : "iMessage via BlueBubbles app",
                    quickstartScore: configured ? 1 : 0,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var blueBubblesOverride, defaultAccountId, accountId, next, resolvedAccount, serverUrl, entered, keepUrl, entered, password, entered, keepPassword, entered, existingWebhookPath, wantsWebhook, webhookPath, entered;
        var _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    blueBubblesOverride = (_d = accountOverrides.bluebubbles) === null || _d === void 0 ? void 0 : _d.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultBlueBubblesAccountId)(cfg);
                    accountId = blueBubblesOverride
                        ? (0, plugin_sdk_1.normalizeAccountId)(blueBubblesOverride)
                        : defaultAccountId;
                    if (!(shouldPromptAccountIds && !blueBubblesOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "BlueBubbles",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listBlueBubblesAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 1:
                    accountId = _v.sent();
                    _v.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: next, accountId: accountId });
                    serverUrl = (_e = resolvedAccount.config.serverUrl) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!!serverUrl) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.note([
                            "Enter the BlueBubbles server URL (e.g., http://192.168.1.100:1234).",
                            "Find this in the BlueBubbles Server app under Connection.",
                            "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/bluebubbles", "bluebubbles")),
                        ].join("\n"), "BlueBubbles server URL")];
                case 3:
                    _v.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "BlueBubbles server URL",
                            placeholder: "http://192.168.1.100:1234",
                            validate: function (value) {
                                var trimmed = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!trimmed) {
                                    return "Required";
                                }
                                try {
                                    var normalized = (0, types_js_1.normalizeBlueBubblesServerUrl)(trimmed);
                                    new URL(normalized);
                                    return undefined;
                                }
                                catch (_a) {
                                    return "Invalid URL format";
                                }
                            },
                        })];
                case 4:
                    entered = _v.sent();
                    serverUrl = String(entered).trim();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, prompter.confirm({
                        message: "BlueBubbles server URL already set (".concat(serverUrl, "). Keep it?"),
                        initialValue: true,
                    })];
                case 6:
                    keepUrl = _v.sent();
                    if (!!keepUrl) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.text({
                            message: "BlueBubbles server URL",
                            placeholder: "http://192.168.1.100:1234",
                            initialValue: serverUrl,
                            validate: function (value) {
                                var trimmed = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!trimmed) {
                                    return "Required";
                                }
                                try {
                                    var normalized = (0, types_js_1.normalizeBlueBubblesServerUrl)(trimmed);
                                    new URL(normalized);
                                    return undefined;
                                }
                                catch (_a) {
                                    return "Invalid URL format";
                                }
                            },
                        })];
                case 7:
                    entered = _v.sent();
                    serverUrl = String(entered).trim();
                    _v.label = 8;
                case 8:
                    password = (_f = resolvedAccount.config.password) === null || _f === void 0 ? void 0 : _f.trim();
                    if (!!password) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.note([
                            "Enter the BlueBubbles server password.",
                            "Find this in the BlueBubbles Server app under Settings.",
                        ].join("\n"), "BlueBubbles password")];
                case 9:
                    _v.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "BlueBubbles password",
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 10:
                    entered = _v.sent();
                    password = String(entered).trim();
                    return [3 /*break*/, 14];
                case 11: return [4 /*yield*/, prompter.confirm({
                        message: "BlueBubbles password already set. Keep it?",
                        initialValue: true,
                    })];
                case 12:
                    keepPassword = _v.sent();
                    if (!!keepPassword) return [3 /*break*/, 14];
                    return [4 /*yield*/, prompter.text({
                            message: "BlueBubbles password",
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 13:
                    entered = _v.sent();
                    password = String(entered).trim();
                    _v.label = 14;
                case 14:
                    existingWebhookPath = (_g = resolvedAccount.config.webhookPath) === null || _g === void 0 ? void 0 : _g.trim();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Configure a custom webhook path? (default: /bluebubbles-webhook)",
                            initialValue: Boolean(existingWebhookPath && existingWebhookPath !== "/bluebubbles-webhook"),
                        })];
                case 15:
                    wantsWebhook = _v.sent();
                    webhookPath = "/bluebubbles-webhook";
                    if (!wantsWebhook) return [3 /*break*/, 17];
                    return [4 /*yield*/, prompter.text({
                            message: "Webhook path",
                            placeholder: "/bluebubbles-webhook",
                            initialValue: existingWebhookPath || "/bluebubbles-webhook",
                            validate: function (value) {
                                var trimmed = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!trimmed) {
                                    return "Required";
                                }
                                if (!trimmed.startsWith("/")) {
                                    return "Path must start with /";
                                }
                                return undefined;
                            },
                        })];
                case 16:
                    entered = _v.sent();
                    webhookPath = String(entered).trim();
                    _v.label = 17;
                case 17:
                    // Apply config
                    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { bluebubbles: __assign(__assign({}, (_h = next.channels) === null || _h === void 0 ? void 0 : _h.bluebubbles), { enabled: true, serverUrl: serverUrl, password: password, webhookPath: webhookPath }) }) });
                    }
                    else {
                        next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { bluebubbles: __assign(__assign({}, (_j = next.channels) === null || _j === void 0 ? void 0 : _j.bluebubbles), { enabled: true, accounts: __assign(__assign({}, (_l = (_k = next.channels) === null || _k === void 0 ? void 0 : _k.bluebubbles) === null || _l === void 0 ? void 0 : _l.accounts), (_c = {}, _c[accountId] = __assign(__assign({}, (_p = (_o = (_m = next.channels) === null || _m === void 0 ? void 0 : _m.bluebubbles) === null || _o === void 0 ? void 0 : _o.accounts) === null || _p === void 0 ? void 0 : _p[accountId]), { enabled: (_u = (_t = (_s = (_r = (_q = next.channels) === null || _q === void 0 ? void 0 : _q.bluebubbles) === null || _r === void 0 ? void 0 : _r.accounts) === null || _s === void 0 ? void 0 : _s[accountId]) === null || _t === void 0 ? void 0 : _t.enabled) !== null && _u !== void 0 ? _u : true, serverUrl: serverUrl, password: password, webhookPath: webhookPath }), _c)) }) }) });
                    }
                    return [4 /*yield*/, prompter.note([
                            "Configure the webhook URL in BlueBubbles Server:",
                            "1. Open BlueBubbles Server → Settings → Webhooks",
                            "2. Add your OpenClaw gateway URL + webhook path",
                            "   Example: https://your-gateway-host:3000/bluebubbles-webhook",
                            "3. Enable the webhook and save",
                            "",
                            "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/bluebubbles", "bluebubbles")),
                        ].join("\n"), "BlueBubbles next steps")];
                case 18:
                    _v.sent();
                    return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { bluebubbles: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.bluebubbles), { enabled: false }) }) }));
    },
};
