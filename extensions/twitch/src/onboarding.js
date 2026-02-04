"use strict";
/**
 * Twitch onboarding adapter for CLI setup wizard.
 */
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
exports.twitchOnboardingAdapter = void 0;
exports.promptToken = promptToken;
exports.promptUsername = promptUsername;
exports.promptClientId = promptClientId;
exports.promptChannelName = promptChannelName;
exports.promptRefreshTokenSetup = promptRefreshTokenSetup;
exports.configureWithEnvToken = configureWithEnvToken;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var config_js_1 = require("./config.js");
var twitch_js_1 = require("./utils/twitch.js");
var channel = "twitch";
/**
 * Set Twitch account configuration
 */
function setTwitchAccount(cfg, account) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var existing = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
    var merged = {
        username: (_c = (_b = account.username) !== null && _b !== void 0 ? _b : existing === null || existing === void 0 ? void 0 : existing.username) !== null && _c !== void 0 ? _c : "",
        accessToken: (_e = (_d = account.accessToken) !== null && _d !== void 0 ? _d : existing === null || existing === void 0 ? void 0 : existing.accessToken) !== null && _e !== void 0 ? _e : "",
        clientId: (_g = (_f = account.clientId) !== null && _f !== void 0 ? _f : existing === null || existing === void 0 ? void 0 : existing.clientId) !== null && _g !== void 0 ? _g : "",
        channel: (_j = (_h = account.channel) !== null && _h !== void 0 ? _h : existing === null || existing === void 0 ? void 0 : existing.channel) !== null && _j !== void 0 ? _j : "",
        enabled: (_l = (_k = account.enabled) !== null && _k !== void 0 ? _k : existing === null || existing === void 0 ? void 0 : existing.enabled) !== null && _l !== void 0 ? _l : true,
        allowFrom: (_m = account.allowFrom) !== null && _m !== void 0 ? _m : existing === null || existing === void 0 ? void 0 : existing.allowFrom,
        allowedRoles: (_o = account.allowedRoles) !== null && _o !== void 0 ? _o : existing === null || existing === void 0 ? void 0 : existing.allowedRoles,
        requireMention: (_p = account.requireMention) !== null && _p !== void 0 ? _p : existing === null || existing === void 0 ? void 0 : existing.requireMention,
        clientSecret: (_q = account.clientSecret) !== null && _q !== void 0 ? _q : existing === null || existing === void 0 ? void 0 : existing.clientSecret,
        refreshToken: (_r = account.refreshToken) !== null && _r !== void 0 ? _r : existing === null || existing === void 0 ? void 0 : existing.refreshToken,
        expiresIn: (_s = account.expiresIn) !== null && _s !== void 0 ? _s : existing === null || existing === void 0 ? void 0 : existing.expiresIn,
        obtainmentTimestamp: (_t = account.obtainmentTimestamp) !== null && _t !== void 0 ? _t : existing === null || existing === void 0 ? void 0 : existing.obtainmentTimestamp,
    };
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { twitch: __assign(__assign({}, (_u = cfg.channels) === null || _u === void 0 ? void 0 : _u.twitch), { enabled: true, accounts: __assign(__assign({}, (_w = (_v = cfg.channels) === null || _v === void 0 ? void 0 : _v.twitch) === null || _w === void 0 ? void 0 : _w.accounts), (_a = {}, _a[config_js_1.DEFAULT_ACCOUNT_ID] = merged, _a)) }) }) });
}
/**
 * Note about Twitch setup
 */
function noteTwitchSetupHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "Twitch requires a bot account with OAuth token.",
                        "1. Create a Twitch application at https://dev.twitch.tv/console",
                        "2. Generate a token with scopes: chat:read and chat:write",
                        "   Use https://twitchtokengenerator.com/ or https://twitchapps.com/tmi/",
                        "3. Copy the token (starts with 'oauth:') and Client ID",
                        "Env vars supported: OPENCLAW_TWITCH_ACCESS_TOKEN",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/twitch", "channels/twitch")),
                    ].join("\n"), "Twitch setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Prompt for Twitch OAuth token with early returns.
 */
function promptToken(prompter, account, envToken) {
    return __awaiter(this, void 0, void 0, function () {
        var existingToken, keepToken, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    existingToken = (_b = account === null || account === void 0 ? void 0 : account.accessToken) !== null && _b !== void 0 ? _b : "";
                    if (!(existingToken && !envToken)) return [3 /*break*/, 2];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Access token already configured. Keep it?",
                            initialValue: true,
                        })];
                case 1:
                    keepToken = _c.sent();
                    if (keepToken) {
                        return [2 /*return*/, existingToken];
                    }
                    _c.label = 2;
                case 2:
                    _a = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch OAuth token (oauth:...)",
                            initialValue: envToken !== null && envToken !== void 0 ? envToken : "",
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                if (!raw.startsWith("oauth:")) {
                                    return "Token should start with 'oauth:'";
                                }
                                return undefined;
                            },
                        })];
                case 3: 
                // Prompt for new token
                return [2 /*return*/, _a.apply(void 0, [_c.sent()]).trim()];
            }
        });
    });
}
/**
 * Prompt for Twitch username.
 */
function promptUsername(prompter, account) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch bot username",
                            initialValue: (_b = account === null || account === void 0 ? void 0 : account.username) !== null && _b !== void 0 ? _b : "",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent()]).trim()];
            }
        });
    });
}
/**
 * Prompt for Twitch Client ID.
 */
function promptClientId(prompter, account) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch Client ID",
                            initialValue: (_b = account === null || account === void 0 ? void 0 : account.clientId) !== null && _b !== void 0 ? _b : "",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent()]).trim()];
            }
        });
    });
}
/**
 * Prompt for optional channel name.
 */
function promptChannelName(prompter, account) {
    return __awaiter(this, void 0, void 0, function () {
        var channelName, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Channel to join",
                            initialValue: (_b = account === null || account === void 0 ? void 0 : account.channel) !== null && _b !== void 0 ? _b : "",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 1:
                    channelName = _a.apply(void 0, [_c.sent()]).trim();
                    return [2 /*return*/, channelName];
            }
        });
    });
}
/**
 * Prompt for token refresh credentials (client secret and refresh token).
 */
function promptRefreshTokenSetup(prompter, account) {
    return __awaiter(this, void 0, void 0, function () {
        var useRefresh, clientSecret, _a, refreshToken, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, prompter.confirm({
                        message: "Enable automatic token refresh (requires client secret and refresh token)?",
                        initialValue: Boolean((account === null || account === void 0 ? void 0 : account.clientSecret) && (account === null || account === void 0 ? void 0 : account.refreshToken)),
                    })];
                case 1:
                    useRefresh = _e.sent();
                    if (!useRefresh) {
                        return [2 /*return*/, {}];
                    }
                    _a = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch Client Secret (for token refresh)",
                            initialValue: (_c = account === null || account === void 0 ? void 0 : account.clientSecret) !== null && _c !== void 0 ? _c : "",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 2:
                    clientSecret = _a.apply(void 0, [_e.sent()]).trim() || undefined;
                    _b = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch Refresh Token",
                            initialValue: (_d = account === null || account === void 0 ? void 0 : account.refreshToken) !== null && _d !== void 0 ? _d : "",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 3:
                    refreshToken = _b.apply(void 0, [_e.sent()]).trim() || undefined;
                    return [2 /*return*/, { clientSecret: clientSecret, refreshToken: refreshToken }];
            }
        });
    });
}
/**
 * Configure with env token path (returns early if user chooses env token).
 */
function configureWithEnvToken(cfg, prompter, account, envToken, forceAllowFrom, dmPolicy) {
    return __awaiter(this, void 0, void 0, function () {
        var useEnv, username, clientId, cfgWithAccount;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prompter.confirm({
                        message: "Twitch env var OPENCLAW_TWITCH_ACCESS_TOKEN detected. Use env token?",
                        initialValue: true,
                    })];
                case 1:
                    useEnv = _b.sent();
                    if (!useEnv) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, promptUsername(prompter, account)];
                case 2:
                    username = _b.sent();
                    return [4 /*yield*/, promptClientId(prompter, account)];
                case 3:
                    clientId = _b.sent();
                    cfgWithAccount = setTwitchAccount(cfg, {
                        username: username,
                        clientId: clientId,
                        accessToken: "", // Will use env var
                        enabled: true,
                    });
                    if (!(forceAllowFrom && dmPolicy.promptAllowFrom)) return [3 /*break*/, 5];
                    _a = {};
                    return [4 /*yield*/, dmPolicy.promptAllowFrom({ cfg: cfgWithAccount, prompter: prompter })];
                case 4: return [2 /*return*/, (_a.cfg = _b.sent(), _a)];
                case 5: return [2 /*return*/, { cfg: cfgWithAccount }];
            }
        });
    });
}
/**
 * Set Twitch access control (role-based)
 */
function setTwitchAccessControl(cfg, allowedRoles, requireMention) {
    var account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
    if (!account) {
        return cfg;
    }
    return setTwitchAccount(cfg, __assign(__assign({}, account), { allowedRoles: allowedRoles, requireMention: requireMention }));
}
var dmPolicy = {
    label: "Twitch",
    channel: channel,
    policyKey: "channels.twitch.allowedRoles", // Twitch uses roles instead of DM policy
    allowFromKey: "channels.twitch.accounts.default.allowFrom",
    getCurrent: function (cfg) {
        var _a;
        var account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
        // Map allowedRoles to policy equivalent
        if ((_a = account === null || account === void 0 ? void 0 : account.allowedRoles) === null || _a === void 0 ? void 0 : _a.includes("all")) {
            return "open";
        }
        if ((account === null || account === void 0 ? void 0 : account.allowFrom) && account.allowFrom.length > 0) {
            return "allowlist";
        }
        return "disabled";
    },
    setPolicy: function (cfg, policy) {
        var allowedRoles = policy === "open" ? ["all"] : policy === "allowlist" ? [] : ["moderator"];
        return setTwitchAccessControl(cfg, allowedRoles, true);
    },
    promptAllowFrom: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, existingAllowFrom, entry, allowFrom;
        var _c;
        var cfg = _b.cfg, prompter = _b.prompter;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
                    existingAllowFrom = (_c = account === null || account === void 0 ? void 0 : account.allowFrom) !== null && _c !== void 0 ? _c : [];
                    return [4 /*yield*/, prompter.text({
                            message: "Twitch allowFrom (user IDs, one per line, recommended for security)",
                            placeholder: "123456789",
                            initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
                        })];
                case 1:
                    entry = _d.sent();
                    allowFrom = String(entry !== null && entry !== void 0 ? entry : "")
                        .split(/[\n,;]+/g)
                        .map(function (s) { return s.trim(); })
                        .filter(Boolean);
                    return [2 /*return*/, setTwitchAccount(cfg, __assign(__assign({}, (account !== null && account !== void 0 ? account : undefined)), { allowFrom: allowFrom }))];
            }
        });
    }); },
};
exports.twitchOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
            configured = account ? (0, twitch_js_1.isAccountConfigured)(account) : false;
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Twitch: ".concat(configured ? "configured" : "needs username, token, and clientId")],
                    selectionHint: configured ? "configured" : "needs setup",
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, envToken, envResult, username, token, clientId, channelName, _c, clientSecret, refreshToken, cfgWithAccount, cfgWithAllowFrom, _d, accessConfig, allowedRoles, cfgWithAccessControl;
        var _e, _f, _g;
        var cfg = _b.cfg, prompter = _b.prompter, forceAllowFrom = _b.forceAllowFrom;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    account = (0, config_js_1.getAccountConfig)(cfg, config_js_1.DEFAULT_ACCOUNT_ID);
                    if (!(!account || !(0, twitch_js_1.isAccountConfigured)(account))) return [3 /*break*/, 2];
                    return [4 /*yield*/, noteTwitchSetupHelp(prompter)];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    envToken = (_e = process.env.OPENCLAW_TWITCH_ACCESS_TOKEN) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!(envToken && !(account === null || account === void 0 ? void 0 : account.accessToken))) return [3 /*break*/, 4];
                    return [4 /*yield*/, configureWithEnvToken(cfg, prompter, account, envToken, forceAllowFrom, dmPolicy)];
                case 3:
                    envResult = _h.sent();
                    if (envResult) {
                        return [2 /*return*/, envResult];
                    }
                    _h.label = 4;
                case 4: return [4 /*yield*/, promptUsername(prompter, account)];
                case 5:
                    username = _h.sent();
                    return [4 /*yield*/, promptToken(prompter, account, envToken)];
                case 6:
                    token = _h.sent();
                    return [4 /*yield*/, promptClientId(prompter, account)];
                case 7:
                    clientId = _h.sent();
                    return [4 /*yield*/, promptChannelName(prompter, account)];
                case 8:
                    channelName = _h.sent();
                    return [4 /*yield*/, promptRefreshTokenSetup(prompter, account)];
                case 9:
                    _c = _h.sent(), clientSecret = _c.clientSecret, refreshToken = _c.refreshToken;
                    cfgWithAccount = setTwitchAccount(cfg, {
                        username: username,
                        accessToken: token,
                        clientId: clientId,
                        channel: channelName,
                        clientSecret: clientSecret,
                        refreshToken: refreshToken,
                        enabled: true,
                    });
                    if (!(forceAllowFrom && dmPolicy.promptAllowFrom)) return [3 /*break*/, 11];
                    return [4 /*yield*/, dmPolicy.promptAllowFrom({ cfg: cfgWithAccount, prompter: prompter })];
                case 10:
                    _d = _h.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _d = cfgWithAccount;
                    _h.label = 12;
                case 12:
                    cfgWithAllowFrom = _d;
                    if (!(!(account === null || account === void 0 ? void 0 : account.allowFrom) || account.allowFrom.length === 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptChannelAccessConfig)({
                            prompter: prompter,
                            label: "Twitch chat",
                            currentPolicy: ((_f = account === null || account === void 0 ? void 0 : account.allowedRoles) === null || _f === void 0 ? void 0 : _f.includes("all"))
                                ? "open"
                                : ((_g = account === null || account === void 0 ? void 0 : account.allowedRoles) === null || _g === void 0 ? void 0 : _g.includes("moderator"))
                                    ? "allowlist"
                                    : "disabled",
                            currentEntries: [],
                            placeholder: "",
                            updatePrompt: false,
                        })];
                case 13:
                    accessConfig = _h.sent();
                    if (accessConfig) {
                        allowedRoles = accessConfig.policy === "open"
                            ? ["all"]
                            : accessConfig.policy === "allowlist"
                                ? ["moderator", "vip"]
                                : [];
                        cfgWithAccessControl = setTwitchAccessControl(cfgWithAllowFrom, allowedRoles, true);
                        return [2 /*return*/, { cfg: cfgWithAccessControl }];
                    }
                    _h.label = 14;
                case 14: return [2 /*return*/, { cfg: cfgWithAllowFrom }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        var twitch = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch;
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { twitch: __assign(__assign({}, twitch), { enabled: false }) }) });
    },
};
