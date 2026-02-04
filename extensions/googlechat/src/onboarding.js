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
exports.googlechatOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var channel = "googlechat";
var ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
var ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
function setGoogleChatDmPolicy(cfg, policy) {
    var _a, _b, _c, _d, _e, _f;
    var allowFrom = policy === "open"
        ? (0, plugin_sdk_1.addWildcardAllowFrom)((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom)
        : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { googlechat: __assign(__assign({}, (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d["googlechat"]), { dm: __assign(__assign(__assign({}, (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e["googlechat"]) === null || _f === void 0 ? void 0 : _f.dm), { policy: policy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) }) });
}
function parseAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function promptAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var current, entry, parts, unique;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    current = (_d = (_c = (_b = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.allowFrom) !== null && _d !== void 0 ? _d : [];
                    return [4 /*yield*/, params.prompter.text({
                            message: "Google Chat allowFrom (user id or email)",
                            placeholder: "users/123456789, name@example.com",
                            initialValue: current[0] ? String(current[0]) : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 1:
                    entry = _h.sent();
                    parts = parseAllowFromInput(String(entry));
                    unique = __spreadArray([], new Set(parts), true);
                    return [2 /*return*/, __assign(__assign({}, params.cfg), { channels: __assign(__assign({}, params.cfg.channels), { googlechat: __assign(__assign({}, (_e = params.cfg.channels) === null || _e === void 0 ? void 0 : _e["googlechat"]), { enabled: true, dm: __assign(__assign({}, (_g = (_f = params.cfg.channels) === null || _f === void 0 ? void 0 : _f["googlechat"]) === null || _g === void 0 ? void 0 : _g.dm), { policy: "allowlist", allowFrom: unique }) }) }) })];
            }
        });
    });
}
var dmPolicy = {
    label: "Google Chat",
    channel: channel,
    policyKey: "channels.googlechat.dm.policy",
    allowFromKey: "channels.googlechat.dm.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a["googlechat"]) === null || _b === void 0 ? void 0 : _b.dm) === null || _c === void 0 ? void 0 : _c.policy) !== null && _d !== void 0 ? _d : "pairing"; },
    setPolicy: function (cfg, policy) { return setGoogleChatDmPolicy(cfg, policy); },
    promptAllowFrom: promptAllowFrom,
};
function applyAccountConfig(params) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h;
    var cfg = params.cfg, accountId = params.accountId, patch = params.patch;
    if (accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { googlechat: __assign(__assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b["googlechat"]), { enabled: true }), patch) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { googlechat: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c["googlechat"]), { enabled: true, accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d["googlechat"]) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f["googlechat"]) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { enabled: true }), patch), _a)) }) }) });
}
function promptCredentials(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, prompter, accountId, envReady, useEnv, method, path, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = params.cfg, prompter = params.prompter, accountId = params.accountId;
                    envReady = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID &&
                        (Boolean(process.env[ENV_SERVICE_ACCOUNT]) || Boolean(process.env[ENV_SERVICE_ACCOUNT_FILE]));
                    if (!envReady) return [3 /*break*/, 2];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Use GOOGLE_CHAT_SERVICE_ACCOUNT env vars?",
                            initialValue: true,
                        })];
                case 1:
                    useEnv = _a.sent();
                    if (useEnv) {
                        return [2 /*return*/, applyAccountConfig({ cfg: cfg, accountId: accountId, patch: {} })];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, prompter.select({
                        message: "Google Chat auth method",
                        options: [
                            { value: "file", label: "Service account JSON file" },
                            { value: "inline", label: "Paste service account JSON" },
                        ],
                        initialValue: "file",
                    })];
                case 3:
                    method = _a.sent();
                    if (!(method === "file")) return [3 /*break*/, 5];
                    return [4 /*yield*/, prompter.text({
                            message: "Service account JSON path",
                            placeholder: "/path/to/service-account.json",
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 4:
                    path = _a.sent();
                    return [2 /*return*/, applyAccountConfig({
                            cfg: cfg,
                            accountId: accountId,
                            patch: { serviceAccountFile: String(path).trim() },
                        })];
                case 5: return [4 /*yield*/, prompter.text({
                        message: "Service account JSON (single line)",
                        placeholder: '{"type":"service_account", ... }',
                        validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                    })];
                case 6:
                    json = _a.sent();
                    return [2 /*return*/, applyAccountConfig({
                            cfg: cfg,
                            accountId: accountId,
                            patch: { serviceAccount: String(json).trim() },
                        })];
            }
        });
    });
}
function promptAudience(params) {
    return __awaiter(this, void 0, void 0, function () {
        var account, currentType, currentAudience, audienceType, audience;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    account = (0, accounts_js_1.resolveGoogleChatAccount)({
                        cfg: params.cfg,
                        accountId: params.accountId,
                    });
                    currentType = (_a = account.config.audienceType) !== null && _a !== void 0 ? _a : "app-url";
                    currentAudience = (_b = account.config.audience) !== null && _b !== void 0 ? _b : "";
                    return [4 /*yield*/, params.prompter.select({
                            message: "Webhook audience type",
                            options: [
                                { value: "app-url", label: "App URL (recommended)" },
                                { value: "project-number", label: "Project number" },
                            ],
                            initialValue: currentType === "project-number" ? "project-number" : "app-url",
                        })];
                case 1:
                    audienceType = _c.sent();
                    return [4 /*yield*/, params.prompter.text({
                            message: audienceType === "project-number" ? "Project number" : "App URL",
                            placeholder: audienceType === "project-number" ? "1234567890" : "https://your.host/googlechat",
                            initialValue: currentAudience || undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 2:
                    audience = _c.sent();
                    return [2 /*return*/, applyAccountConfig({
                            cfg: params.cfg,
                            accountId: params.accountId,
                            patch: { audienceType: audienceType, audience: String(audience).trim() },
                        })];
            }
        });
    });
}
function noteGoogleChatSetup(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "Google Chat apps use service-account auth and an HTTPS webhook.",
                        "Set the Chat API scopes in your service account and configure the Chat app URL.",
                        "Webhook verification requires audience type + audience value.",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/googlechat", "channels/googlechat")),
                    ].join("\n"), "Google Chat setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.googlechatOnboardingAdapter = {
    channel: channel,
    dmPolicy: dmPolicy,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            configured = (0, accounts_js_1.listGoogleChatAccountIds)(cfg).some(function (accountId) { return (0, accounts_js_1.resolveGoogleChatAccount)({ cfg: cfg, accountId: accountId }).credentialSource !== "none"; });
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Google Chat: ".concat(configured ? "configured" : "needs service account")],
                    selectionHint: configured ? "configured" : "needs auth",
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var override, defaultAccountId, accountId, next, namedConfig;
        var _c;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    override = (_c = accountOverrides["googlechat"]) === null || _c === void 0 ? void 0 : _c.trim();
                    defaultAccountId = (0, accounts_js_1.resolveDefaultGoogleChatAccountId)(cfg);
                    accountId = override ? (0, plugin_sdk_1.normalizeAccountId)(override) : defaultAccountId;
                    if (!(shouldPromptAccountIds && !override)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Google Chat",
                            currentId: accountId,
                            listAccountIds: accounts_js_1.listGoogleChatAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 1:
                    accountId = _d.sent();
                    _d.label = 2;
                case 2:
                    next = cfg;
                    return [4 /*yield*/, noteGoogleChatSetup(prompter)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, promptCredentials({ cfg: next, prompter: prompter, accountId: accountId })];
                case 4:
                    next = _d.sent();
                    return [4 /*yield*/, promptAudience({ cfg: next, prompter: prompter, accountId: accountId })];
                case 5:
                    next = _d.sent();
                    namedConfig = (0, plugin_sdk_1.migrateBaseNameToDefaultAccount)({
                        cfg: next,
                        channelKey: "googlechat",
                    });
                    return [2 /*return*/, { cfg: namedConfig, accountId: accountId }];
            }
        });
    }); },
};
