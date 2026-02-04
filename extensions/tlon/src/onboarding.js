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
exports.tlonOnboardingAdapter = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var types_js_1 = require("./types.js");
var channel = "tlon";
function isConfigured(account) {
    return Boolean(account.ship && account.url && account.code);
}
function applyAccountConfig(params) {
    var _a;
    var _b, _c, _d, _e;
    var cfg = params.cfg, accountId = params.accountId, input = params.input;
    var useDefault = accountId === plugin_sdk_1.DEFAULT_ACCOUNT_ID;
    var base = (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.tlon) !== null && _c !== void 0 ? _c : {};
    if (useDefault) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, base), { enabled: true }), (input.name ? { name: input.name } : {})), (input.ship ? { ship: input.ship } : {})), (input.url ? { url: input.url } : {})), (input.code ? { code: input.code } : {})), (input.groupChannels ? { groupChannels: input.groupChannels } : {})), (input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {})), (typeof input.autoDiscoverChannels === "boolean"
                    ? { autoDiscoverChannels: input.autoDiscoverChannels }
                    : {})) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { tlon: __assign(__assign({}, base), { enabled: (_d = base.enabled) !== null && _d !== void 0 ? _d : true, accounts: __assign(__assign({}, base.accounts), (_a = {}, _a[accountId] = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (_e = base.accounts) === null || _e === void 0 ? void 0 : _e[accountId]), { enabled: true }), (input.name ? { name: input.name } : {})), (input.ship ? { ship: input.ship } : {})), (input.url ? { url: input.url } : {})), (input.code ? { code: input.code } : {})), (input.groupChannels ? { groupChannels: input.groupChannels } : {})), (input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {})), (typeof input.autoDiscoverChannels === "boolean"
                    ? { autoDiscoverChannels: input.autoDiscoverChannels }
                    : {})), _a)) }) }) });
}
function noteTlonHelp(prompter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompter.note([
                        "You need your Urbit ship URL and login code.",
                        "Example URL: https://your-ship-host",
                        "Example ship: ~sampel-palnet",
                        "Docs: ".concat((0, plugin_sdk_1.formatDocsLink)("/channels/tlon", "channels/tlon")),
                    ].join("\n"), "Tlon setup")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function parseList(value) {
    return value
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
exports.tlonOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var accountIds, configured;
        var cfg = _b.cfg;
        return __generator(this, function (_c) {
            accountIds = (0, types_js_1.listTlonAccountIds)(cfg);
            configured = accountIds.length > 0
                ? accountIds.some(function (accountId) { return isConfigured((0, types_js_1.resolveTlonAccount)(cfg, accountId)); })
                : isConfigured((0, types_js_1.resolveTlonAccount)(cfg, plugin_sdk_1.DEFAULT_ACCOUNT_ID));
            return [2 /*return*/, {
                    channel: channel,
                    configured: configured,
                    statusLines: ["Tlon: ".concat(configured ? "configured" : "needs setup")],
                    selectionHint: configured ? "configured" : "urbit messenger",
                    quickstartScore: configured ? 1 : 4,
                }];
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var override, defaultAccountId, accountId, resolved, ship, url, code, wantsGroupChannels, groupChannels, entry, parsed, wantsAllowlist, dmAllowlist, entry, parsed, autoDiscoverChannels, next;
        var _c, _d, _e, _f, _g;
        var cfg = _b.cfg, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    override = (_c = accountOverrides[channel]) === null || _c === void 0 ? void 0 : _c.trim();
                    defaultAccountId = plugin_sdk_1.DEFAULT_ACCOUNT_ID;
                    accountId = override ? (0, plugin_sdk_1.normalizeAccountId)(override) : defaultAccountId;
                    if (!(shouldPromptAccountIds && !override)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, plugin_sdk_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Tlon",
                            currentId: accountId,
                            listAccountIds: types_js_1.listTlonAccountIds,
                            defaultAccountId: defaultAccountId,
                        })];
                case 1:
                    accountId = _h.sent();
                    _h.label = 2;
                case 2:
                    resolved = (0, types_js_1.resolveTlonAccount)(cfg, accountId);
                    return [4 /*yield*/, noteTlonHelp(prompter)];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "Ship name",
                            placeholder: "~sampel-palnet",
                            initialValue: (_d = resolved.ship) !== null && _d !== void 0 ? _d : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 4:
                    ship = _h.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "Ship URL",
                            placeholder: "https://your-ship-host",
                            initialValue: (_e = resolved.url) !== null && _e !== void 0 ? _e : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 5:
                    url = _h.sent();
                    return [4 /*yield*/, prompter.text({
                            message: "Login code",
                            placeholder: "lidlut-tabwed-pillex-ridrup",
                            initialValue: (_f = resolved.code) !== null && _f !== void 0 ? _f : undefined,
                            validate: function (value) { return (String(value !== null && value !== void 0 ? value : "").trim() ? undefined : "Required"); },
                        })];
                case 6:
                    code = _h.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Add group channels manually? (optional)",
                            initialValue: false,
                        })];
                case 7:
                    wantsGroupChannels = _h.sent();
                    if (!wantsGroupChannels) return [3 /*break*/, 9];
                    return [4 /*yield*/, prompter.text({
                            message: "Group channels (comma-separated)",
                            placeholder: "chat/~host-ship/general, chat/~host-ship/support",
                        })];
                case 8:
                    entry = _h.sent();
                    parsed = parseList(String(entry !== null && entry !== void 0 ? entry : ""));
                    groupChannels = parsed.length > 0 ? parsed : undefined;
                    _h.label = 9;
                case 9: return [4 /*yield*/, prompter.confirm({
                        message: "Restrict DMs with an allowlist?",
                        initialValue: false,
                    })];
                case 10:
                    wantsAllowlist = _h.sent();
                    if (!wantsAllowlist) return [3 /*break*/, 12];
                    return [4 /*yield*/, prompter.text({
                            message: "DM allowlist (comma-separated ship names)",
                            placeholder: "~zod, ~nec",
                        })];
                case 11:
                    entry = _h.sent();
                    parsed = parseList(String(entry !== null && entry !== void 0 ? entry : ""));
                    dmAllowlist = parsed.length > 0 ? parsed : undefined;
                    _h.label = 12;
                case 12: return [4 /*yield*/, prompter.confirm({
                        message: "Enable auto-discovery of group channels?",
                        initialValue: (_g = resolved.autoDiscoverChannels) !== null && _g !== void 0 ? _g : true,
                    })];
                case 13:
                    autoDiscoverChannels = _h.sent();
                    next = applyAccountConfig({
                        cfg: cfg,
                        accountId: accountId,
                        input: {
                            ship: String(ship).trim(),
                            url: String(url).trim(),
                            code: String(code).trim(),
                            groupChannels: groupChannels,
                            dmAllowlist: dmAllowlist,
                            autoDiscoverChannels: autoDiscoverChannels,
                        },
                    });
                    return [2 /*return*/, { cfg: next, accountId: accountId }];
            }
        });
    }); },
};
