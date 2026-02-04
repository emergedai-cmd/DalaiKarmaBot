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
exports.channelsRemoveCommand = channelsRemoveCommand;
var helpers_js_1 = require("../../channels/plugins/helpers.js");
var index_js_1 = require("../../channels/plugins/index.js");
var config_js_1 = require("../../config/config.js");
var session_key_js_1 = require("../../routing/session-key.js");
var runtime_js_1 = require("../../runtime.js");
var clack_prompter_js_1 = require("../../wizard/clack-prompter.js");
var shared_js_1 = require("./shared.js");
function listAccountIds(cfg, channel) {
    var plugin = (0, index_js_1.getChannelPlugin)(channel);
    if (!plugin) {
        return [];
    }
    return plugin.config.listAccountIds(cfg);
}
function channelsRemoveCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime, params) {
        var cfg, useWizard, prompter, channel, accountId, deleteConfig, selectedChannel_1, wantsDisable, confirm_1, ok, plugin, resolvedAccountId, accountKey, next;
        var _this = this;
        var _a;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _b.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    useWizard = (0, shared_js_1.shouldUseWizard)(params);
                    prompter = useWizard ? (0, clack_prompter_js_1.createClackPrompter)() : null;
                    channel = (0, index_js_1.normalizeChannelId)(opts.channel);
                    accountId = (0, session_key_js_1.normalizeAccountId)(opts.account);
                    deleteConfig = Boolean(opts.delete);
                    if (!(useWizard && prompter)) return [3 /*break*/, 8];
                    return [4 /*yield*/, prompter.intro("Remove channel account")];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, prompter.select({
                            message: "Channel",
                            options: (0, index_js_1.listChannelPlugins)().map(function (plugin) { return ({
                                value: plugin.id,
                                label: plugin.meta.label,
                            }); }),
                        })];
                case 3:
                    selectedChannel_1 = _b.sent();
                    channel = selectedChannel_1;
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var ids, choice;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        ids = listAccountIds(cfg, selectedChannel_1);
                                        return [4 /*yield*/, prompter.select({
                                                message: "Account",
                                                options: ids.map(function (id) { return ({
                                                    value: id,
                                                    label: id === session_key_js_1.DEFAULT_ACCOUNT_ID ? "default (primary)" : id,
                                                }); }),
                                                initialValue: (_a = ids[0]) !== null && _a !== void 0 ? _a : session_key_js_1.DEFAULT_ACCOUNT_ID,
                                            })];
                                    case 1:
                                        choice = _b.sent();
                                        return [2 /*return*/, (0, session_key_js_1.normalizeAccountId)(choice)];
                                }
                            });
                        }); })()];
                case 4:
                    accountId = _b.sent();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Disable ".concat((0, shared_js_1.channelLabel)(selectedChannel_1), " account \"").concat(accountId, "\"? (keeps config)"),
                            initialValue: true,
                        })];
                case 5:
                    wantsDisable = _b.sent();
                    if (!!wantsDisable) return [3 /*break*/, 7];
                    return [4 /*yield*/, prompter.outro("Cancelled.")];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
                case 7: return [3 /*break*/, 10];
                case 8:
                    if (!channel) {
                        runtime.error("Channel is required. Use --channel <name>.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!!deleteConfig) return [3 /*break*/, 10];
                    confirm_1 = (0, clack_prompter_js_1.createClackPrompter)();
                    return [4 /*yield*/, confirm_1.confirm({
                            message: "Disable ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountId, "\"? (keeps config)"),
                            initialValue: true,
                        })];
                case 9:
                    ok = _b.sent();
                    if (!ok) {
                        return [2 /*return*/];
                    }
                    _b.label = 10;
                case 10:
                    plugin = (0, index_js_1.getChannelPlugin)(channel);
                    if (!plugin) {
                        runtime.error("Unknown channel: ".concat(channel));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    resolvedAccountId = (_a = (0, session_key_js_1.normalizeAccountId)(accountId)) !== null && _a !== void 0 ? _a : (0, helpers_js_1.resolveChannelDefaultAccountId)({ plugin: plugin, cfg: cfg });
                    accountKey = resolvedAccountId || session_key_js_1.DEFAULT_ACCOUNT_ID;
                    next = __assign({}, cfg);
                    if (deleteConfig) {
                        if (!plugin.config.deleteAccount) {
                            runtime.error("Channel ".concat(channel, " does not support delete."));
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                        next = plugin.config.deleteAccount({
                            cfg: next,
                            accountId: resolvedAccountId,
                        });
                    }
                    else {
                        if (!plugin.config.setAccountEnabled) {
                            runtime.error("Channel ".concat(channel, " does not support disable."));
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                        next = plugin.config.setAccountEnabled({
                            cfg: next,
                            accountId: resolvedAccountId,
                            enabled: false,
                        });
                    }
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(next)];
                case 11:
                    _b.sent();
                    if (!(useWizard && prompter)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prompter.outro(deleteConfig
                            ? "Deleted ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountKey, "\".")
                            : "Disabled ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountKey, "\"."))];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13:
                    runtime.log(deleteConfig
                        ? "Deleted ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountKey, "\".")
                        : "Disabled ".concat((0, shared_js_1.channelLabel)(channel), " account \"").concat(accountKey, "\"."));
                    _b.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    });
}
