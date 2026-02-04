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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTelegramRunnerOptions = createTelegramRunnerOptions;
exports.monitorTelegramProvider = monitorTelegramProvider;
var runner_1 = require("@grammyjs/runner");
var agent_limits_js_1 = require("../config/agent-limits.js");
var config_js_1 = require("../config/config.js");
var backoff_js_1 = require("../infra/backoff.js");
var errors_js_1 = require("../infra/errors.js");
var format_duration_js_1 = require("../infra/format-duration.js");
var unhandled_rejections_js_1 = require("../infra/unhandled-rejections.js");
var accounts_js_1 = require("./accounts.js");
var allowed_updates_js_1 = require("./allowed-updates.js");
var bot_js_1 = require("./bot.js");
var network_errors_js_1 = require("./network-errors.js");
var proxy_js_1 = require("./proxy.js");
var update_offset_store_js_1 = require("./update-offset-store.js");
var webhook_js_1 = require("./webhook.js");
function createTelegramRunnerOptions(cfg) {
    return {
        sink: {
            concurrency: (0, agent_limits_js_1.resolveAgentMaxConcurrent)(cfg),
        },
        runner: {
            fetch: {
                // Match grammY defaults
                timeout: 30,
                // Request reactions without dropping default update types.
                allowed_updates: (0, allowed_updates_js_1.resolveTelegramAllowedUpdates)(),
            },
            // Suppress grammY getUpdates stack traces; we log concise errors ourselves.
            silent: true,
            // Retry transient failures for a limited window before surfacing errors.
            maxRetryTime: 5 * 60 * 1000,
            retryInterval: "exponential",
        },
    };
}
var TELEGRAM_POLL_RESTART_POLICY = {
    initialMs: 2000,
    maxMs: 30000,
    factor: 1.8,
    jitter: 0.25,
};
var isGetUpdatesConflict = function (err) {
    var _a;
    if (!err || typeof err !== "object") {
        return false;
    }
    var typed = err;
    var errorCode = (_a = typed.error_code) !== null && _a !== void 0 ? _a : typed.errorCode;
    if (errorCode !== 409) {
        return false;
    }
    var haystack = [typed.method, typed.description, typed.message]
        .filter(function (value) { return typeof value === "string"; })
        .join(" ")
        .toLowerCase();
    return haystack.includes("getupdates");
};
/** Check if error is a Grammy HttpError (used to scope unhandled rejection handling) */
var isGrammyHttpError = function (err) {
    if (!err || typeof err !== "object") {
        return false;
    }
    return err.name === "HttpError";
};
function monitorTelegramProvider() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var log, unregisterHandler, cfg, account_1, token, proxyFetch, lastUpdateId_1, persistUpdateId, bot, restartAttempts, _loop_1, state_1;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    log = (_b = (_a = opts.runtime) === null || _a === void 0 ? void 0 : _a.error) !== null && _b !== void 0 ? _b : console.error;
                    unregisterHandler = (0, unhandled_rejections_js_1.registerUnhandledRejectionHandler)(function (err) {
                        if (isGrammyHttpError(err) && (0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, { context: "polling" })) {
                            log("[telegram] Suppressed network error: ".concat((0, errors_js_1.formatErrorMessage)(err)));
                            return true; // handled - don't crash
                        }
                        return false;
                    });
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, , 8, 9]);
                    cfg = (_c = opts.config) !== null && _c !== void 0 ? _c : (0, config_js_1.loadConfig)();
                    account_1 = (0, accounts_js_1.resolveTelegramAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    token = ((_d = opts.token) === null || _d === void 0 ? void 0 : _d.trim()) || account_1.token;
                    if (!token) {
                        throw new Error("Telegram bot token missing for account \"".concat(account_1.accountId, "\" (set channels.telegram.accounts.").concat(account_1.accountId, ".botToken/tokenFile or TELEGRAM_BOT_TOKEN for default)."));
                    }
                    proxyFetch = (_e = opts.proxyFetch) !== null && _e !== void 0 ? _e : (account_1.config.proxy ? (0, proxy_js_1.makeProxyFetch)(account_1.config.proxy) : undefined);
                    return [4 /*yield*/, (0, update_offset_store_js_1.readTelegramUpdateOffset)({
                            accountId: account_1.accountId,
                        })];
                case 2:
                    lastUpdateId_1 = _o.sent();
                    persistUpdateId = function (updateId) { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (lastUpdateId_1 !== null && updateId <= lastUpdateId_1) {
                                        return [2 /*return*/];
                                    }
                                    lastUpdateId_1 = updateId;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, update_offset_store_js_1.writeTelegramUpdateOffset)({
                                            accountId: account_1.accountId,
                                            updateId: updateId,
                                        })];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _c.sent();
                                    ((_b = (_a = opts.runtime) === null || _a === void 0 ? void 0 : _a.error) !== null && _b !== void 0 ? _b : console.error)("telegram: failed to persist update offset: ".concat(String(err_1)));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    bot = (0, bot_js_1.createTelegramBot)({
                        token: token,
                        runtime: opts.runtime,
                        proxyFetch: proxyFetch,
                        config: cfg,
                        accountId: account_1.accountId,
                        updateOffset: {
                            lastUpdateId: lastUpdateId_1,
                            onUpdateId: persistUpdateId,
                        },
                    });
                    if (!opts.useWebhook) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, webhook_js_1.startTelegramWebhook)({
                            token: token,
                            accountId: account_1.accountId,
                            config: cfg,
                            path: opts.webhookPath,
                            port: opts.webhookPort,
                            secret: opts.webhookSecret,
                            runtime: opts.runtime,
                            fetch: proxyFetch,
                            abortSignal: opts.abortSignal,
                            publicUrl: opts.webhookUrl,
                        })];
                case 3:
                    _o.sent();
                    return [2 /*return*/];
                case 4:
                    restartAttempts = 0;
                    _loop_1 = function () {
                        var runner, stopOnAbort, err_2, isConflict, isRecoverable, delayMs, reason, errMsg, sleepErr_1;
                        return __generator(this, function (_p) {
                            switch (_p.label) {
                                case 0:
                                    runner = (0, runner_1.run)(bot, createTelegramRunnerOptions(cfg));
                                    stopOnAbort = function () {
                                        var _a;
                                        if ((_a = opts.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
                                            void runner.stop();
                                        }
                                    };
                                    (_g = opts.abortSignal) === null || _g === void 0 ? void 0 : _g.addEventListener("abort", stopOnAbort, { once: true });
                                    _p.label = 1;
                                case 1:
                                    _p.trys.push([1, 3, 8, 9]);
                                    // runner.task() returns a promise that resolves when the runner stops
                                    return [4 /*yield*/, runner.task()];
                                case 2:
                                    // runner.task() returns a promise that resolves when the runner stops
                                    _p.sent();
                                    return [2 /*return*/, { value: void 0 }];
                                case 3:
                                    err_2 = _p.sent();
                                    if ((_h = opts.abortSignal) === null || _h === void 0 ? void 0 : _h.aborted) {
                                        throw err_2;
                                    }
                                    isConflict = isGetUpdatesConflict(err_2);
                                    isRecoverable = (0, network_errors_js_1.isRecoverableTelegramNetworkError)(err_2, { context: "polling" });
                                    if (!isConflict && !isRecoverable) {
                                        throw err_2;
                                    }
                                    restartAttempts += 1;
                                    delayMs = (0, backoff_js_1.computeBackoff)(TELEGRAM_POLL_RESTART_POLICY, restartAttempts);
                                    reason = isConflict ? "getUpdates conflict" : "network error";
                                    errMsg = (0, errors_js_1.formatErrorMessage)(err_2);
                                    ((_k = (_j = opts.runtime) === null || _j === void 0 ? void 0 : _j.error) !== null && _k !== void 0 ? _k : console.error)("Telegram ".concat(reason, ": ").concat(errMsg, "; retrying in ").concat((0, format_duration_js_1.formatDurationMs)(delayMs), "."));
                                    _p.label = 4;
                                case 4:
                                    _p.trys.push([4, 6, , 7]);
                                    return [4 /*yield*/, (0, backoff_js_1.sleepWithAbort)(delayMs, opts.abortSignal)];
                                case 5:
                                    _p.sent();
                                    return [3 /*break*/, 7];
                                case 6:
                                    sleepErr_1 = _p.sent();
                                    if ((_l = opts.abortSignal) === null || _l === void 0 ? void 0 : _l.aborted) {
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    throw sleepErr_1;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    (_m = opts.abortSignal) === null || _m === void 0 ? void 0 : _m.removeEventListener("abort", stopOnAbort);
                                    return [7 /*endfinally*/];
                                case 9: return [2 /*return*/];
                            }
                        });
                    };
                    _o.label = 5;
                case 5:
                    if (!!((_f = opts.abortSignal) === null || _f === void 0 ? void 0 : _f.aborted)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1()];
                case 6:
                    state_1 = _o.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 5];
                case 7: return [3 /*break*/, 9];
                case 8:
                    unregisterHandler();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
