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
exports.signalOnboardingAdapter = void 0;
var command_format_js_1 = require("../../../cli/command-format.js");
var onboard_helpers_js_1 = require("../../../commands/onboard-helpers.js");
var signal_install_js_1 = require("../../../commands/signal-install.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var accounts_js_1 = require("../../../signal/accounts.js");
var links_js_1 = require("../../../terminal/links.js");
var utils_js_1 = require("../../../utils.js");
var helpers_js_1 = require("./helpers.js");
var channel = "signal";
function setSignalDmPolicy(cfg, dmPolicy) {
    var _a, _b, _c;
    var allowFrom = dmPolicy === "open" ? (0, helpers_js_1.addWildcardAllowFrom)((_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) === null || _b === void 0 ? void 0 : _b.allowFrom) : undefined;
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { signal: __assign(__assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.signal), { dmPolicy: dmPolicy }), (allowFrom ? { allowFrom: allowFrom } : {})) }) });
}
function setSignalAllowFrom(cfg, accountId, allowFrom) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h;
    if (accountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
        return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { signal: __assign(__assign({}, (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.signal), { allowFrom: allowFrom }) }) });
    }
    return __assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { signal: __assign(__assign({}, (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.signal), { accounts: __assign(__assign({}, (_e = (_d = cfg.channels) === null || _d === void 0 ? void 0 : _d.signal) === null || _e === void 0 ? void 0 : _e.accounts), (_a = {}, _a[accountId] = __assign(__assign({}, (_h = (_g = (_f = cfg.channels) === null || _f === void 0 ? void 0 : _f.signal) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h[accountId]), { allowFrom: allowFrom }), _a)) }) }) });
}
function parseSignalAllowFromInput(raw) {
    return raw
        .split(/[\n,;]+/g)
        .map(function (entry) { return entry.trim(); })
        .filter(Boolean);
}
function isUuidLike(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
function promptSignalAllowFrom(params) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, resolved, existing, entry, parts, normalized, unique;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    accountId = params.accountId && (0, session_key_js_1.normalizeAccountId)(params.accountId)
                        ? ((_a = (0, session_key_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID)
                        : (0, accounts_js_1.resolveDefaultSignalAccountId)(params.cfg);
                    resolved = (0, accounts_js_1.resolveSignalAccount)({ cfg: params.cfg, accountId: accountId });
                    existing = (_b = resolved.config.allowFrom) !== null && _b !== void 0 ? _b : [];
                    return [4 /*yield*/, params.prompter.note([
                            "Allowlist Signal DMs by sender id.",
                            "Examples:",
                            "- +15555550123",
                            "- uuid:123e4567-e89b-12d3-a456-426614174000",
                            "Multiple entries: comma-separated.",
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/signal", "signal")),
                        ].join("\n"), "Signal allowlist")];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, params.prompter.text({
                            message: "Signal allowFrom (E.164 or uuid)",
                            placeholder: "+15555550123, uuid:123e4567-e89b-12d3-a456-426614174000",
                            initialValue: existing[0] ? String(existing[0]) : undefined,
                            validate: function (value) {
                                var raw = String(value !== null && value !== void 0 ? value : "").trim();
                                if (!raw) {
                                    return "Required";
                                }
                                var parts = parseSignalAllowFromInput(raw);
                                for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                                    var part = parts_1[_i];
                                    if (part === "*") {
                                        continue;
                                    }
                                    if (part.toLowerCase().startsWith("uuid:")) {
                                        if (!part.slice("uuid:".length).trim()) {
                                            return "Invalid uuid entry";
                                        }
                                        continue;
                                    }
                                    if (isUuidLike(part)) {
                                        continue;
                                    }
                                    if (!(0, utils_js_1.normalizeE164)(part)) {
                                        return "Invalid entry: ".concat(part);
                                    }
                                }
                                return undefined;
                            },
                        })];
                case 2:
                    entry = _c.sent();
                    parts = parseSignalAllowFromInput(String(entry));
                    normalized = parts
                        .map(function (part) {
                        if (part === "*") {
                            return "*";
                        }
                        if (part.toLowerCase().startsWith("uuid:")) {
                            return "uuid:".concat(part.slice(5).trim());
                        }
                        if (isUuidLike(part)) {
                            return "uuid:".concat(part);
                        }
                        return (0, utils_js_1.normalizeE164)(part);
                    })
                        .filter(Boolean);
                    unique = __spreadArray([], new Set(normalized), true);
                    return [2 /*return*/, setSignalAllowFrom(params.cfg, accountId, unique)];
            }
        });
    });
}
var dmPolicy = {
    label: "Signal",
    channel: channel,
    policyKey: "channels.signal.dmPolicy",
    allowFromKey: "channels.signal.allowFrom",
    getCurrent: function (cfg) { var _a, _b, _c; return (_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal) === null || _b === void 0 ? void 0 : _b.dmPolicy) !== null && _c !== void 0 ? _c : "pairing"; },
    setPolicy: function (cfg, policy) { return setSignalDmPolicy(cfg, policy); },
    promptAllowFrom: promptSignalAllowFrom,
};
exports.signalOnboardingAdapter = {
    channel: channel,
    getStatus: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var configured, signalCliPath, signalCliDetected;
        var _c, _d, _e;
        var cfg = _b.cfg;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    configured = (0, accounts_js_1.listSignalAccountIds)(cfg).some(function (accountId) { return (0, accounts_js_1.resolveSignalAccount)({ cfg: cfg, accountId: accountId }).configured; });
                    signalCliPath = (_e = (_d = (_c = cfg.channels) === null || _c === void 0 ? void 0 : _c.signal) === null || _d === void 0 ? void 0 : _d.cliPath) !== null && _e !== void 0 ? _e : "signal-cli";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)(signalCliPath)];
                case 1:
                    signalCliDetected = _f.sent();
                    return [2 /*return*/, {
                            channel: channel,
                            configured: configured,
                            statusLines: [
                                "Signal: ".concat(configured ? "configured" : "needs setup"),
                                "signal-cli: ".concat(signalCliDetected ? "found" : "missing", " (").concat(signalCliPath, ")"),
                            ],
                            selectionHint: signalCliDetected ? "signal-cli found" : "signal-cli missing",
                            quickstartScore: signalCliDetected ? 1 : 0,
                        }];
            }
        });
    }); },
    configure: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var signalOverride, defaultSignalAccountId, signalAccountId, next, resolvedAccount, accountConfig, resolvedCliPath, cliDetected, wantsInstall, result, err_1, account, keep, _c;
        var _d;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var cfg = _b.cfg, runtime = _b.runtime, prompter = _b.prompter, accountOverrides = _b.accountOverrides, shouldPromptAccountIds = _b.shouldPromptAccountIds, options = _b.options;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    signalOverride = (_e = accountOverrides.signal) === null || _e === void 0 ? void 0 : _e.trim();
                    defaultSignalAccountId = (0, accounts_js_1.resolveDefaultSignalAccountId)(cfg);
                    signalAccountId = signalOverride
                        ? (0, session_key_js_1.normalizeAccountId)(signalOverride)
                        : defaultSignalAccountId;
                    if (!(shouldPromptAccountIds && !signalOverride)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, helpers_js_1.promptAccountId)({
                            cfg: cfg,
                            prompter: prompter,
                            label: "Signal",
                            currentId: signalAccountId,
                            listAccountIds: accounts_js_1.listSignalAccountIds,
                            defaultAccountId: defaultSignalAccountId,
                        })];
                case 1:
                    signalAccountId = _w.sent();
                    _w.label = 2;
                case 2:
                    next = cfg;
                    resolvedAccount = (0, accounts_js_1.resolveSignalAccount)({
                        cfg: next,
                        accountId: signalAccountId,
                    });
                    accountConfig = resolvedAccount.config;
                    resolvedCliPath = (_f = accountConfig.cliPath) !== null && _f !== void 0 ? _f : "signal-cli";
                    return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)(resolvedCliPath)];
                case 3:
                    cliDetected = _w.sent();
                    if (!(options === null || options === void 0 ? void 0 : options.allowSignalInstall)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.confirm({
                            message: cliDetected
                                ? "signal-cli detected. Reinstall/update now?"
                                : "signal-cli not found. Install now?",
                            initialValue: !cliDetected,
                        })];
                case 4:
                    wantsInstall = _w.sent();
                    if (!wantsInstall) return [3 /*break*/, 13];
                    _w.label = 5;
                case 5:
                    _w.trys.push([5, 11, , 13]);
                    return [4 /*yield*/, (0, signal_install_js_1.installSignalCli)(runtime)];
                case 6:
                    result = _w.sent();
                    if (!(result.ok && result.cliPath)) return [3 /*break*/, 8];
                    cliDetected = true;
                    resolvedCliPath = result.cliPath;
                    return [4 /*yield*/, prompter.note("Installed signal-cli at ".concat(result.cliPath), "Signal")];
                case 7:
                    _w.sent();
                    return [3 /*break*/, 10];
                case 8:
                    if (!!result.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, prompter.note((_g = result.error) !== null && _g !== void 0 ? _g : "signal-cli install failed.", "Signal")];
                case 9:
                    _w.sent();
                    _w.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11:
                    err_1 = _w.sent();
                    return [4 /*yield*/, prompter.note("signal-cli install failed: ".concat(String(err_1)), "Signal")];
                case 12:
                    _w.sent();
                    return [3 /*break*/, 13];
                case 13:
                    if (!!cliDetected) return [3 /*break*/, 15];
                    return [4 /*yield*/, prompter.note("signal-cli not found. Install it, then rerun this step or set channels.signal.cliPath.", "Signal")];
                case 14:
                    _w.sent();
                    _w.label = 15;
                case 15:
                    account = (_h = accountConfig.account) !== null && _h !== void 0 ? _h : "";
                    if (!account) return [3 /*break*/, 17];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Signal account set (".concat(account, "). Keep it?"),
                            initialValue: true,
                        })];
                case 16:
                    keep = _w.sent();
                    if (!keep) {
                        account = "";
                    }
                    _w.label = 17;
                case 17:
                    if (!!account) return [3 /*break*/, 19];
                    _c = String;
                    return [4 /*yield*/, prompter.text({
                            message: "Signal bot number (E.164)",
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 18:
                    account = _c.apply(void 0, [_w.sent()]).trim();
                    _w.label = 19;
                case 19:
                    if (account) {
                        if (signalAccountId === session_key_js_1.DEFAULT_ACCOUNT_ID) {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { signal: __assign(__assign({}, (_j = next.channels) === null || _j === void 0 ? void 0 : _j.signal), { enabled: true, account: account, cliPath: resolvedCliPath !== null && resolvedCliPath !== void 0 ? resolvedCliPath : "signal-cli" }) }) });
                        }
                        else {
                            next = __assign(__assign({}, next), { channels: __assign(__assign({}, next.channels), { signal: __assign(__assign({}, (_k = next.channels) === null || _k === void 0 ? void 0 : _k.signal), { enabled: true, accounts: __assign(__assign({}, (_m = (_l = next.channels) === null || _l === void 0 ? void 0 : _l.signal) === null || _m === void 0 ? void 0 : _m.accounts), (_d = {}, _d[signalAccountId] = __assign(__assign({}, (_q = (_p = (_o = next.channels) === null || _o === void 0 ? void 0 : _o.signal) === null || _p === void 0 ? void 0 : _p.accounts) === null || _q === void 0 ? void 0 : _q[signalAccountId]), { enabled: (_v = (_u = (_t = (_s = (_r = next.channels) === null || _r === void 0 ? void 0 : _r.signal) === null || _s === void 0 ? void 0 : _s.accounts) === null || _t === void 0 ? void 0 : _t[signalAccountId]) === null || _u === void 0 ? void 0 : _u.enabled) !== null && _v !== void 0 ? _v : true, account: account, cliPath: resolvedCliPath !== null && resolvedCliPath !== void 0 ? resolvedCliPath : "signal-cli" }), _d)) }) }) });
                        }
                    }
                    return [4 /*yield*/, prompter.note([
                            'Link device with: signal-cli link -n "OpenClaw"',
                            "Scan QR in Signal → Linked Devices",
                            "Then run: ".concat((0, command_format_js_1.formatCliCommand)("openclaw gateway call channels.status --params '{\"probe\":true}'")),
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/signal", "signal")),
                        ].join("\n"), "Signal next steps")];
                case 20:
                    _w.sent();
                    return [2 /*return*/, { cfg: next, accountId: signalAccountId }];
            }
        });
    }); },
    dmPolicy: dmPolicy,
    disable: function (cfg) {
        var _a;
        return (__assign(__assign({}, cfg), { channels: __assign(__assign({}, cfg.channels), { signal: __assign(__assign({}, (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.signal), { enabled: false }) }) }));
    },
};
