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
exports.channelsListCommand = channelsListCommand;
var auth_profiles_js_1 = require("../../agents/auth-profiles.js");
var index_js_1 = require("../../channels/plugins/index.js");
var status_js_1 = require("../../channels/plugins/status.js");
var progress_js_1 = require("../../cli/progress.js");
var provider_usage_js_1 = require("../../infra/provider-usage.js");
var runtime_js_1 = require("../../runtime.js");
var links_js_1 = require("../../terminal/links.js");
var theme_js_1 = require("../../terminal/theme.js");
var shared_js_1 = require("./shared.js");
var colorValue = function (value) {
    if (value === "none") {
        return theme_js_1.theme.error(value);
    }
    if (value === "env") {
        return theme_js_1.theme.accent(value);
    }
    return theme_js_1.theme.success(value);
};
function formatEnabled(value) {
    return value === false ? theme_js_1.theme.error("disabled") : theme_js_1.theme.success("enabled");
}
function formatConfigured(value) {
    return value ? theme_js_1.theme.success("configured") : theme_js_1.theme.warn("not configured");
}
function formatTokenSource(source) {
    var value = source || "none";
    return "token=".concat(colorValue(value));
}
function formatSource(label, source) {
    var value = source || "none";
    return "".concat(label, "=").concat(colorValue(value));
}
function formatLinked(value) {
    return value ? theme_js_1.theme.success("linked") : theme_js_1.theme.warn("not linked");
}
function shouldShowConfigured(channel) {
    return channel.meta.showConfigured !== false;
}
function formatAccountLine(params) {
    var channel = params.channel, snapshot = params.snapshot;
    var label = (0, shared_js_1.formatChannelAccountLabel)({
        channel: channel.id,
        accountId: snapshot.accountId,
        name: snapshot.name,
        channelStyle: theme_js_1.theme.accent,
        accountStyle: theme_js_1.theme.heading,
    });
    var bits = [];
    if (snapshot.linked !== undefined) {
        bits.push(formatLinked(snapshot.linked));
    }
    if (shouldShowConfigured(channel) && typeof snapshot.configured === "boolean") {
        bits.push(formatConfigured(snapshot.configured));
    }
    if (snapshot.tokenSource) {
        bits.push(formatTokenSource(snapshot.tokenSource));
    }
    if (snapshot.botTokenSource) {
        bits.push(formatSource("bot", snapshot.botTokenSource));
    }
    if (snapshot.appTokenSource) {
        bits.push(formatSource("app", snapshot.appTokenSource));
    }
    if (snapshot.baseUrl) {
        bits.push("base=".concat(theme_js_1.theme.muted(snapshot.baseUrl)));
    }
    if (typeof snapshot.enabled === "boolean") {
        bits.push(formatEnabled(snapshot.enabled));
    }
    return "- ".concat(label, ": ").concat(bits.join(", "));
}
function loadUsageWithProgress(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, progress_js_1.withProgress)({ label: "Fetching usage snapshot…", indeterminate: true, enabled: true }, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    runtime.error(String(err_1));
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function channelsListCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var cfg, includeUsage, plugins, authStore, authProfiles, usage, _a, chat, _i, plugins_1, plugin, payload, lines, _b, plugins_2, plugin, accounts, _c, accounts_1, accountId, snapshot, _d, authProfiles_1, profile, external_1, usage, usageLines;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _e.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    includeUsage = opts.usage !== false;
                    plugins = (0, index_js_1.listChannelPlugins)();
                    authStore = (0, auth_profiles_js_1.loadAuthProfileStore)();
                    authProfiles = Object.entries(authStore.profiles).map(function (_a) {
                        var profileId = _a[0], profile = _a[1];
                        return ({
                            id: profileId,
                            provider: profile.provider,
                            type: profile.type,
                            isExternal: false,
                        });
                    });
                    if (!opts.json) return [3 /*break*/, 5];
                    if (!includeUsage) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, provider_usage_js_1.loadProviderUsageSummary)()];
                case 2:
                    _a = _e.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _e.label = 4;
                case 4:
                    usage = _a;
                    chat = {};
                    for (_i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
                        plugin = plugins_1[_i];
                        chat[plugin.id] = plugin.config.listAccountIds(cfg);
                    }
                    payload = __assign({ chat: chat, auth: authProfiles }, (usage ? { usage: usage } : {}));
                    runtime.log(JSON.stringify(payload, null, 2));
                    return [2 /*return*/];
                case 5:
                    lines = [];
                    lines.push(theme_js_1.theme.heading("Chat channels:"));
                    _b = 0, plugins_2 = plugins;
                    _e.label = 6;
                case 6:
                    if (!(_b < plugins_2.length)) return [3 /*break*/, 11];
                    plugin = plugins_2[_b];
                    accounts = plugin.config.listAccountIds(cfg);
                    if (!accounts || accounts.length === 0) {
                        return [3 /*break*/, 10];
                    }
                    _c = 0, accounts_1 = accounts;
                    _e.label = 7;
                case 7:
                    if (!(_c < accounts_1.length)) return [3 /*break*/, 10];
                    accountId = accounts_1[_c];
                    return [4 /*yield*/, (0, status_js_1.buildChannelAccountSnapshot)({
                            plugin: plugin,
                            cfg: cfg,
                            accountId: accountId,
                        })];
                case 8:
                    snapshot = _e.sent();
                    lines.push(formatAccountLine({
                        channel: plugin,
                        snapshot: snapshot,
                    }));
                    _e.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 7];
                case 10:
                    _b++;
                    return [3 /*break*/, 6];
                case 11:
                    lines.push("");
                    lines.push(theme_js_1.theme.heading("Auth providers (OAuth + API keys):"));
                    if (authProfiles.length === 0) {
                        lines.push(theme_js_1.theme.muted("- none"));
                    }
                    else {
                        for (_d = 0, authProfiles_1 = authProfiles; _d < authProfiles_1.length; _d++) {
                            profile = authProfiles_1[_d];
                            external_1 = profile.isExternal ? theme_js_1.theme.muted(" (synced)") : "";
                            lines.push("- ".concat(theme_js_1.theme.accent(profile.id), " (").concat(theme_js_1.theme.success(profile.type)).concat(external_1, ")"));
                        }
                    }
                    runtime.log(lines.join("\n"));
                    if (!includeUsage) return [3 /*break*/, 13];
                    runtime.log("");
                    return [4 /*yield*/, loadUsageWithProgress(runtime)];
                case 12:
                    usage = _e.sent();
                    if (usage) {
                        usageLines = (0, provider_usage_js_1.formatUsageReportLines)(usage);
                        if (usageLines.length > 0) {
                            usageLines[0] = theme_js_1.theme.accent(usageLines[0]);
                            runtime.log(usageLines.join("\n"));
                        }
                    }
                    _e.label = 13;
                case 13:
                    runtime.log("");
                    runtime.log("Docs: ".concat((0, links_js_1.formatDocsLink)("/gateway/configuration", "gateway/configuration")));
                    return [2 /*return*/];
            }
        });
    });
}
