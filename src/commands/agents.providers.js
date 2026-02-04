"use strict";
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
exports.buildProviderStatusIndex = buildProviderStatusIndex;
exports.summarizeBindings = summarizeBindings;
exports.listProvidersForAgent = listProvidersForAgent;
var helpers_js_1 = require("../channels/plugins/helpers.js");
var index_js_1 = require("../channels/plugins/index.js");
var session_key_js_1 = require("../routing/session-key.js");
function providerAccountKey(provider, accountId) {
    return "".concat(provider, ":").concat(accountId !== null && accountId !== void 0 ? accountId : session_key_js_1.DEFAULT_ACCOUNT_ID);
}
function formatChannelAccountLabel(params) {
    var _a, _b, _c;
    var label = (_b = (_a = (0, index_js_1.getChannelPlugin)(params.provider)) === null || _a === void 0 ? void 0 : _a.meta.label) !== null && _b !== void 0 ? _b : params.provider;
    var account = ((_c = params.name) === null || _c === void 0 ? void 0 : _c.trim())
        ? "".concat(params.accountId, " (").concat(params.name.trim(), ")")
        : params.accountId;
    return "".concat(label, " ").concat(account);
}
function formatProviderState(entry) {
    var parts = [entry.state];
    if (entry.enabled === false && entry.state !== "disabled") {
        parts.push("disabled");
    }
    return parts.join(", ");
}
function buildProviderStatusIndex(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var map, _i, _a, plugin, accountIds, _b, accountIds_1, accountId, account, snapshot, enabled, configured, _c, resolvedEnabled, resolvedConfigured, state, name_1;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    map = new Map();
                    _i = 0, _a = (0, index_js_1.listChannelPlugins)();
                    _k.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    plugin = _a[_i];
                    accountIds = plugin.config.listAccountIds(cfg);
                    _b = 0, accountIds_1 = accountIds;
                    _k.label = 2;
                case 2:
                    if (!(_b < accountIds_1.length)) return [3 /*break*/, 7];
                    accountId = accountIds_1[_b];
                    account = plugin.config.resolveAccount(cfg, accountId);
                    snapshot = (_e = (_d = plugin.config).describeAccount) === null || _e === void 0 ? void 0 : _e.call(_d, account, cfg);
                    enabled = plugin.config.isEnabled
                        ? plugin.config.isEnabled(account, cfg)
                        : typeof (snapshot === null || snapshot === void 0 ? void 0 : snapshot.enabled) === "boolean"
                            ? snapshot.enabled
                            : account.enabled;
                    if (!plugin.config.isConfigured) return [3 /*break*/, 4];
                    return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
                case 3:
                    _c = _k.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = snapshot === null || snapshot === void 0 ? void 0 : snapshot.configured;
                    _k.label = 5;
                case 5:
                    configured = _c;
                    resolvedEnabled = typeof enabled === "boolean" ? enabled : true;
                    resolvedConfigured = typeof configured === "boolean" ? configured : true;
                    state = (_h = (_g = (_f = plugin.status) === null || _f === void 0 ? void 0 : _f.resolveAccountState) === null || _g === void 0 ? void 0 : _g.call(_f, {
                        account: account,
                        cfg: cfg,
                        configured: resolvedConfigured,
                        enabled: resolvedEnabled,
                    })) !== null && _h !== void 0 ? _h : (typeof (snapshot === null || snapshot === void 0 ? void 0 : snapshot.linked) === "boolean"
                        ? snapshot.linked
                            ? "linked"
                            : "not linked"
                        : resolvedConfigured
                            ? "configured"
                            : "not configured");
                    name_1 = (_j = snapshot === null || snapshot === void 0 ? void 0 : snapshot.name) !== null && _j !== void 0 ? _j : account.name;
                    map.set(providerAccountKey(plugin.id, accountId), {
                        provider: plugin.id,
                        accountId: accountId,
                        name: name_1,
                        state: state,
                        enabled: enabled,
                        configured: configured,
                    });
                    _k.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 2];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, map];
            }
        });
    });
}
function resolveDefaultAccountId(cfg, provider) {
    var plugin = (0, index_js_1.getChannelPlugin)(provider);
    if (!plugin) {
        return session_key_js_1.DEFAULT_ACCOUNT_ID;
    }
    return (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg });
}
function shouldShowProviderEntry(entry, cfg) {
    var plugin = (0, index_js_1.getChannelPlugin)(entry.provider);
    if (!plugin) {
        return Boolean(entry.configured);
    }
    if (plugin.meta.showConfigured === false) {
        var providerConfig = cfg[plugin.id];
        return Boolean(entry.configured) || Boolean(providerConfig);
    }
    return Boolean(entry.configured);
}
function formatProviderEntry(entry) {
    var label = formatChannelAccountLabel({
        provider: entry.provider,
        accountId: entry.accountId,
        name: entry.name,
    });
    return "".concat(label, ": ").concat(formatProviderState(entry));
}
function summarizeBindings(cfg, bindings) {
    var _a;
    if (bindings.length === 0) {
        return [];
    }
    var seen = new Map();
    for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
        var binding = bindings_1[_i];
        var channel = (0, index_js_1.normalizeChannelId)(binding.match.channel);
        if (!channel) {
            continue;
        }
        var accountId = (_a = binding.match.accountId) !== null && _a !== void 0 ? _a : resolveDefaultAccountId(cfg, channel);
        var key = providerAccountKey(channel, accountId);
        if (!seen.has(key)) {
            var label = formatChannelAccountLabel({
                provider: channel,
                accountId: accountId,
            });
            seen.set(key, label);
        }
    }
    return __spreadArray([], seen.values(), true);
}
function listProvidersForAgent(params) {
    var _a;
    var allProviderEntries = __spreadArray([], params.providerStatus.values(), true);
    var providerLines = [];
    if (params.bindings.length > 0) {
        var seen = new Set();
        for (var _i = 0, _b = params.bindings; _i < _b.length; _i++) {
            var binding = _b[_i];
            var channel = (0, index_js_1.normalizeChannelId)(binding.match.channel);
            if (!channel) {
                continue;
            }
            var accountId = (_a = binding.match.accountId) !== null && _a !== void 0 ? _a : resolveDefaultAccountId(params.cfg, channel);
            var key = providerAccountKey(channel, accountId);
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            var status_1 = params.providerStatus.get(key);
            if (status_1) {
                providerLines.push(formatProviderEntry(status_1));
            }
            else {
                providerLines.push("".concat(formatChannelAccountLabel({ provider: channel, accountId: accountId }), ": unknown"));
            }
        }
        return providerLines;
    }
    if (params.summaryIsDefault) {
        for (var _c = 0, allProviderEntries_1 = allProviderEntries; _c < allProviderEntries_1.length; _c++) {
            var entry = allProviderEntries_1[_c];
            if (shouldShowProviderEntry(entry, params.cfg)) {
                providerLines.push(formatProviderEntry(entry));
            }
        }
    }
    return providerLines;
}
