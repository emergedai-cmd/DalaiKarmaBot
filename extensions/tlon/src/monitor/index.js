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
exports.monitorTlonProvider = monitorTlonProvider;
var node_util_1 = require("node:util");
var runtime_js_1 = require("../runtime.js");
var targets_js_1 = require("../targets.js");
var types_js_1 = require("../types.js");
var auth_js_1 = require("../urbit/auth.js");
var send_js_1 = require("../urbit/send.js");
var sse_client_js_1 = require("../urbit/sse-client.js");
var discovery_js_1 = require("./discovery.js");
var history_js_1 = require("./history.js");
var processed_messages_js_1 = require("./processed-messages.js");
var utils_js_1 = require("./utils.js");
function resolveChannelAuthorization(cfg, channelNest) {
    var _a, _b, _c, _d, _e, _f;
    var tlonConfig = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.tlon;
    var rules = (_c = (_b = tlonConfig === null || tlonConfig === void 0 ? void 0 : tlonConfig.authorization) === null || _b === void 0 ? void 0 : _b.channelRules) !== null && _c !== void 0 ? _c : {};
    var rule = rules[channelNest];
    var allowedShips = (_e = (_d = rule === null || rule === void 0 ? void 0 : rule.allowedShips) !== null && _d !== void 0 ? _d : tlonConfig === null || tlonConfig === void 0 ? void 0 : tlonConfig.defaultAuthorizedShips) !== null && _e !== void 0 ? _e : [];
    var mode = (_f = rule === null || rule === void 0 ? void 0 : rule.mode) !== null && _f !== void 0 ? _f : "restricted";
    return { mode: mode, allowedShips: allowedShips };
}
function monitorTlonProvider() {
    return __awaiter(this, arguments, void 0, function (opts) {
        function subscribeToChannel(channelNest) {
            return __awaiter(this, void 0, void 0, function () {
                var parsed, error_5;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (subscribedChannels.has(channelNest)) {
                                return [2 /*return*/];
                            }
                            parsed = (0, targets_js_1.parseChannelNest)(channelNest);
                            if (!parsed) {
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Invalid channel format: ".concat(channelNest));
                                return [2 /*return*/];
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, api.subscribe({
                                    app: "channels",
                                    path: "/".concat(channelNest),
                                    event: handleIncomingGroupMessage(channelNest),
                                    err: function (error) {
                                        var _a;
                                        (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Group subscription error for ".concat(channelNest, ": ").concat(String(error)));
                                    },
                                    quit: function () {
                                        var _a;
                                        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Group subscription ended for ".concat(channelNest));
                                        subscribedChannels.delete(channelNest);
                                    },
                                })];
                        case 2:
                            _e.sent();
                            subscribedChannels.add(channelNest);
                            (_b = runtime.log) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Subscribed to group channel: ".concat(channelNest));
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _e.sent();
                            (_c = runtime.error) === null || _c === void 0 ? void 0 : _c.call(runtime, "[tlon] Failed to subscribe to ".concat(channelNest, ": ").concat((_d = error_5 === null || error_5 === void 0 ? void 0 : error_5.message) !== null && _d !== void 0 ? _d : String(error_5)));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function subscribeToDM(dmShip) {
            return __awaiter(this, void 0, void 0, function () {
                var error_6;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (subscribedDMs.has(dmShip)) {
                                return [2 /*return*/];
                            }
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, api.subscribe({
                                    app: "chat",
                                    path: "/dm/".concat(dmShip),
                                    event: handleIncomingDM,
                                    err: function (error) {
                                        var _a;
                                        (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] DM subscription error for ".concat(dmShip, ": ").concat(String(error)));
                                    },
                                    quit: function () {
                                        var _a;
                                        (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] DM subscription ended for ".concat(dmShip));
                                        subscribedDMs.delete(dmShip);
                                    },
                                })];
                        case 2:
                            _d.sent();
                            subscribedDMs.add(dmShip);
                            (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Subscribed to DM with ".concat(dmShip));
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _d.sent();
                            (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Failed to subscribe to DM with ".concat(dmShip, ": ").concat((_c = error_6 === null || error_6 === void 0 ? void 0 : error_6.message) !== null && _c !== void 0 ? _c : String(error_6)));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function refreshChannelSubscriptions() {
            return __awaiter(this, void 0, void 0, function () {
                var dmShips, _i, dmShips_2, dmShip, discoveredChannels, _a, discoveredChannels_1, channelNest, error_7;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 11, , 12]);
                            return [4 /*yield*/, api.scry("/chat/dm.json")];
                        case 1:
                            dmShips = _d.sent();
                            if (!Array.isArray(dmShips)) return [3 /*break*/, 5];
                            _i = 0, dmShips_2 = dmShips;
                            _d.label = 2;
                        case 2:
                            if (!(_i < dmShips_2.length)) return [3 /*break*/, 5];
                            dmShip = dmShips_2[_i];
                            return [4 /*yield*/, subscribeToDM(dmShip)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            if (!(account.autoDiscoverChannels !== false)) return [3 /*break*/, 10];
                            return [4 /*yield*/, (0, discovery_js_1.fetchAllChannels)(api, runtime)];
                        case 6:
                            discoveredChannels = _d.sent();
                            _a = 0, discoveredChannels_1 = discoveredChannels;
                            _d.label = 7;
                        case 7:
                            if (!(_a < discoveredChannels_1.length)) return [3 /*break*/, 10];
                            channelNest = discoveredChannels_1[_a];
                            return [4 /*yield*/, subscribeToChannel(channelNest)];
                        case 8:
                            _d.sent();
                            _d.label = 9;
                        case 9:
                            _a++;
                            return [3 /*break*/, 7];
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            error_7 = _d.sent();
                            (_b = runtime.error) === null || _b === void 0 ? void 0 : _b.call(runtime, "[tlon] Channel refresh failed: ".concat((_c = error_7 === null || error_7 === void 0 ? void 0 : error_7.message) !== null && _c !== void 0 ? _c : String(error_7)));
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
        var core, cfg, logger, formatRuntimeMessage, runtime, account, botShipName, api, cookie, error_1, processedTracker, groupChannels, discoveredChannels, error_2, handleIncomingDM, handleIncomingGroupMessage, processMessage, subscribedChannels, subscribedDMs, dmShips, dmList, error_3, _i, dmShips_1, dmShip, _a, groupChannels_1, channelNest, pollInterval_1, error_4;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    core = (0, runtime_js_1.getTlonRuntime)();
                    cfg = core.config.loadConfig();
                    if (((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.tlon) === null || _c === void 0 ? void 0 : _c.enabled) === false) {
                        return [2 /*return*/];
                    }
                    logger = core.logging.getChildLogger({ module: "tlon-auto-reply" });
                    formatRuntimeMessage = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return node_util_1.format.apply(void 0, args);
                    };
                    runtime = (_d = opts.runtime) !== null && _d !== void 0 ? _d : {
                        log: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            logger.info(formatRuntimeMessage.apply(void 0, args));
                        },
                        error: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            logger.error(formatRuntimeMessage.apply(void 0, args));
                        },
                        exit: function (code) {
                            throw new Error("exit ".concat(code));
                        },
                    };
                    account = (0, types_js_1.resolveTlonAccount)(cfg, (_e = opts.accountId) !== null && _e !== void 0 ? _e : undefined);
                    if (!account.enabled) {
                        return [2 /*return*/];
                    }
                    if (!account.configured || !account.ship || !account.url || !account.code) {
                        throw new Error("Tlon account not configured (ship/url/code required)");
                    }
                    botShipName = (0, targets_js_1.normalizeShip)(account.ship);
                    (_f = runtime.log) === null || _f === void 0 ? void 0 : _f.call(runtime, "[tlon] Starting monitor for ".concat(botShipName));
                    api = null;
                    _y.label = 1;
                case 1:
                    _y.trys.push([1, 3, , 4]);
                    (_g = runtime.log) === null || _g === void 0 ? void 0 : _g.call(runtime, "[tlon] Attempting authentication to ".concat(account.url, "..."));
                    return [4 /*yield*/, (0, auth_js_1.authenticate)(account.url, account.code)];
                case 2:
                    cookie = _y.sent();
                    api = new sse_client_js_1.UrbitSSEClient(account.url, cookie, {
                        ship: botShipName,
                        logger: {
                            log: function (message) { var _a; return (_a = runtime.log) === null || _a === void 0 ? void 0 : _a.call(runtime, message); },
                            error: function (message) { var _a; return (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, message); },
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _y.sent();
                    (_h = runtime.error) === null || _h === void 0 ? void 0 : _h.call(runtime, "[tlon] Failed to authenticate: ".concat((_j = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _j !== void 0 ? _j : String(error_1)));
                    throw error_1;
                case 4:
                    processedTracker = (0, processed_messages_js_1.createProcessedMessageTracker)(2000);
                    groupChannels = [];
                    if (!(account.autoDiscoverChannels !== false)) return [3 /*break*/, 8];
                    _y.label = 5;
                case 5:
                    _y.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, discovery_js_1.fetchAllChannels)(api, runtime)];
                case 6:
                    discoveredChannels = _y.sent();
                    if (discoveredChannels.length > 0) {
                        groupChannels = discoveredChannels;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _y.sent();
                    (_k = runtime.error) === null || _k === void 0 ? void 0 : _k.call(runtime, "[tlon] Auto-discovery failed: ".concat((_l = error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _l !== void 0 ? _l : String(error_2)));
                    return [3 /*break*/, 8];
                case 8:
                    if (groupChannels.length === 0 && account.groupChannels.length > 0) {
                        groupChannels = account.groupChannels;
                        (_m = runtime.log) === null || _m === void 0 ? void 0 : _m.call(runtime, "[tlon] Using manual groupChannels config: ".concat(groupChannels.join(", ")));
                    }
                    if (groupChannels.length > 0) {
                        (_o = runtime.log) === null || _o === void 0 ? void 0 : _o.call(runtime, "[tlon] Monitoring ".concat(groupChannels.length, " group channel(s): ").concat(groupChannels.join(", ")));
                    }
                    else {
                        (_p = runtime.log) === null || _p === void 0 ? void 0 : _p.call(runtime, "[tlon] No group channels to monitor (DMs only)");
                    }
                    handleIncomingDM = function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var memo, messageId, senderShip, messageText, error_8;
                        var _a, _b, _c, _d, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 2, , 3]);
                                    memo = (_b = (_a = update === null || update === void 0 ? void 0 : update.response) === null || _a === void 0 ? void 0 : _a.add) === null || _b === void 0 ? void 0 : _b.memo;
                                    if (!memo) {
                                        return [2 /*return*/];
                                    }
                                    messageId = update.id;
                                    if (!processedTracker.mark(messageId)) {
                                        return [2 /*return*/];
                                    }
                                    senderShip = (0, targets_js_1.normalizeShip)((_c = memo.author) !== null && _c !== void 0 ? _c : "");
                                    if (!senderShip || senderShip === botShipName) {
                                        return [2 /*return*/];
                                    }
                                    messageText = (0, utils_js_1.extractMessageText)(memo.content);
                                    if (!messageText) {
                                        return [2 /*return*/];
                                    }
                                    if (!(0, utils_js_1.isDmAllowed)(senderShip, account.dmAllowlist)) {
                                        (_d = runtime.log) === null || _d === void 0 ? void 0 : _d.call(runtime, "[tlon] Blocked DM from ".concat(senderShip, ": not in allowlist"));
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, processMessage({
                                            messageId: messageId !== null && messageId !== void 0 ? messageId : "",
                                            senderShip: senderShip,
                                            messageText: messageText,
                                            isGroup: false,
                                            timestamp: memo.sent || Date.now(),
                                        })];
                                case 1:
                                    _g.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_8 = _g.sent();
                                    (_e = runtime.error) === null || _e === void 0 ? void 0 : _e.call(runtime, "[tlon] Error handling DM: ".concat((_f = error_8 === null || error_8 === void 0 ? void 0 : error_8.message) !== null && _f !== void 0 ? _f : String(error_8)));
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    handleIncomingGroupMessage = function (channelNest) { return function (update) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, essay, memo, content, isThreadReply, messageId, senderShip, messageText, mentioned, _a, mode, allowedShips, normalizedAllowed, seal, parentId, error_9;
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
                        return __generator(this, function (_8) {
                            switch (_8.label) {
                                case 0:
                                    _8.trys.push([0, 2, , 3]);
                                    parsed = (0, targets_js_1.parseChannelNest)(channelNest);
                                    if (!parsed) {
                                        return [2 /*return*/];
                                    }
                                    essay = (_e = (_d = (_c = (_b = update === null || update === void 0 ? void 0 : update.response) === null || _b === void 0 ? void 0 : _b.post) === null || _c === void 0 ? void 0 : _c["r-post"]) === null || _d === void 0 ? void 0 : _d.set) === null || _e === void 0 ? void 0 : _e.essay;
                                    memo = (_l = (_k = (_j = (_h = (_g = (_f = update === null || update === void 0 ? void 0 : update.response) === null || _f === void 0 ? void 0 : _f.post) === null || _g === void 0 ? void 0 : _g["r-post"]) === null || _h === void 0 ? void 0 : _h.reply) === null || _j === void 0 ? void 0 : _j["r-reply"]) === null || _k === void 0 ? void 0 : _k.set) === null || _l === void 0 ? void 0 : _l.memo;
                                    if (!essay && !memo) {
                                        return [2 /*return*/];
                                    }
                                    content = memo || essay;
                                    isThreadReply = Boolean(memo);
                                    messageId = isThreadReply
                                        ? (_q = (_p = (_o = (_m = update === null || update === void 0 ? void 0 : update.response) === null || _m === void 0 ? void 0 : _m.post) === null || _o === void 0 ? void 0 : _o["r-post"]) === null || _p === void 0 ? void 0 : _p.reply) === null || _q === void 0 ? void 0 : _q.id
                                        : (_s = (_r = update === null || update === void 0 ? void 0 : update.response) === null || _r === void 0 ? void 0 : _r.post) === null || _s === void 0 ? void 0 : _s.id;
                                    if (!processedTracker.mark(messageId)) {
                                        return [2 /*return*/];
                                    }
                                    senderShip = (0, targets_js_1.normalizeShip)((_t = content.author) !== null && _t !== void 0 ? _t : "");
                                    if (!senderShip || senderShip === botShipName) {
                                        return [2 /*return*/];
                                    }
                                    messageText = (0, utils_js_1.extractMessageText)(content.content);
                                    if (!messageText) {
                                        return [2 /*return*/];
                                    }
                                    (0, history_js_1.cacheMessage)(channelNest, {
                                        author: senderShip,
                                        content: messageText,
                                        timestamp: content.sent || Date.now(),
                                        id: messageId,
                                    });
                                    mentioned = (0, utils_js_1.isBotMentioned)(messageText, botShipName);
                                    if (!mentioned) {
                                        return [2 /*return*/];
                                    }
                                    _a = resolveChannelAuthorization(cfg, channelNest), mode = _a.mode, allowedShips = _a.allowedShips;
                                    if (mode === "restricted") {
                                        if (allowedShips.length === 0) {
                                            (_u = runtime.log) === null || _u === void 0 ? void 0 : _u.call(runtime, "[tlon] Access denied: ".concat(senderShip, " in ").concat(channelNest, " (no allowlist)"));
                                            return [2 /*return*/];
                                        }
                                        normalizedAllowed = allowedShips.map(targets_js_1.normalizeShip);
                                        if (!normalizedAllowed.includes(senderShip)) {
                                            (_v = runtime.log) === null || _v === void 0 ? void 0 : _v.call(runtime, "[tlon] Access denied: ".concat(senderShip, " in ").concat(channelNest, " (allowed: ").concat(allowedShips.join(", "), ")"));
                                            return [2 /*return*/];
                                        }
                                    }
                                    seal = isThreadReply
                                        ? (_1 = (_0 = (_z = (_y = (_x = (_w = update === null || update === void 0 ? void 0 : update.response) === null || _w === void 0 ? void 0 : _w.post) === null || _x === void 0 ? void 0 : _x["r-post"]) === null || _y === void 0 ? void 0 : _y.reply) === null || _z === void 0 ? void 0 : _z["r-reply"]) === null || _0 === void 0 ? void 0 : _0.set) === null || _1 === void 0 ? void 0 : _1.seal
                                        : (_5 = (_4 = (_3 = (_2 = update === null || update === void 0 ? void 0 : update.response) === null || _2 === void 0 ? void 0 : _2.post) === null || _3 === void 0 ? void 0 : _3["r-post"]) === null || _4 === void 0 ? void 0 : _4.set) === null || _5 === void 0 ? void 0 : _5.seal;
                                    parentId = (seal === null || seal === void 0 ? void 0 : seal["parent-id"]) || (seal === null || seal === void 0 ? void 0 : seal.parent) || null;
                                    return [4 /*yield*/, processMessage({
                                            messageId: messageId !== null && messageId !== void 0 ? messageId : "",
                                            senderShip: senderShip,
                                            messageText: messageText,
                                            isGroup: true,
                                            groupChannel: channelNest,
                                            groupName: "".concat(parsed.hostShip, "/").concat(parsed.channelName),
                                            timestamp: content.sent || Date.now(),
                                            parentId: parentId,
                                        })];
                                case 1:
                                    _8.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_9 = _8.sent();
                                    (_6 = runtime.error) === null || _6 === void 0 ? void 0 : _6.call(runtime, "[tlon] Error handling group message: ".concat((_7 = error_9 === null || error_9 === void 0 ? void 0 : error_9.message) !== null && _7 !== void 0 ? _7 : String(error_9)));
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }; };
                    processMessage = function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var messageId, senderShip, isGroup, groupChannel, groupName, timestamp, parentId, messageText, history_1, noHistoryMsg, parsed, historyText, error_10, errorMsg, parsed, route, fromLabel, body, ctxPayload, dispatchStartTime, responsePrefix, humanDelay;
                        var _this = this;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    messageId = params.messageId, senderShip = params.senderShip, isGroup = params.isGroup, groupChannel = params.groupChannel, groupName = params.groupName, timestamp = params.timestamp, parentId = params.parentId;
                                    messageText = params.messageText;
                                    if (!(isGroup && groupChannel && (0, utils_js_1.isSummarizationRequest)(messageText))) return [3 /*break*/, 15];
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 9, , 15]);
                                    return [4 /*yield*/, (0, history_js_1.getChannelHistory)(api, groupChannel, 50, runtime)];
                                case 2:
                                    history_1 = _c.sent();
                                    if (!(history_1.length === 0)) return [3 /*break*/, 8];
                                    noHistoryMsg = "I couldn't fetch any messages for this channel. It might be empty or there might be a permissions issue.";
                                    if (!isGroup) return [3 /*break*/, 5];
                                    parsed = (0, targets_js_1.parseChannelNest)(groupChannel);
                                    if (!parsed) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, send_js_1.sendGroupMessage)({
                                            api: api,
                                            fromShip: botShipName,
                                            hostShip: parsed.hostShip,
                                            channelName: parsed.channelName,
                                            text: noHistoryMsg,
                                        })];
                                case 3:
                                    _c.sent();
                                    _c.label = 4;
                                case 4: return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, (0, send_js_1.sendDm)({
                                        api: api,
                                        fromShip: botShipName,
                                        toShip: senderShip,
                                        text: noHistoryMsg,
                                    })];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7: return [2 /*return*/];
                                case 8:
                                    historyText = history_1
                                        .map(function (msg) { return "[".concat(new Date(msg.timestamp).toLocaleString(), "] ").concat(msg.author, ": ").concat(msg.content); })
                                        .join("\n");
                                    messageText =
                                        "Please summarize this channel conversation (".concat(history_1.length, " recent messages):\n\n").concat(historyText, "\n\n") +
                                            "Provide a concise summary highlighting:\n" +
                                            "1. Main topics discussed\n" +
                                            "2. Key decisions or conclusions\n" +
                                            "3. Action items if any\n" +
                                            "4. Notable participants";
                                    return [3 /*break*/, 15];
                                case 9:
                                    error_10 = _c.sent();
                                    errorMsg = "Sorry, I encountered an error while fetching the channel history: ".concat((_a = error_10 === null || error_10 === void 0 ? void 0 : error_10.message) !== null && _a !== void 0 ? _a : String(error_10));
                                    if (!(isGroup && groupChannel)) return [3 /*break*/, 12];
                                    parsed = (0, targets_js_1.parseChannelNest)(groupChannel);
                                    if (!parsed) return [3 /*break*/, 11];
                                    return [4 /*yield*/, (0, send_js_1.sendGroupMessage)({
                                            api: api,
                                            fromShip: botShipName,
                                            hostShip: parsed.hostShip,
                                            channelName: parsed.channelName,
                                            text: errorMsg,
                                        })];
                                case 10:
                                    _c.sent();
                                    _c.label = 11;
                                case 11: return [3 /*break*/, 14];
                                case 12: return [4 /*yield*/, (0, send_js_1.sendDm)({ api: api, fromShip: botShipName, toShip: senderShip, text: errorMsg })];
                                case 13:
                                    _c.sent();
                                    _c.label = 14;
                                case 14: return [2 /*return*/];
                                case 15:
                                    route = core.channel.routing.resolveAgentRoute({
                                        cfg: cfg,
                                        channel: "tlon",
                                        accountId: (_b = opts.accountId) !== null && _b !== void 0 ? _b : undefined,
                                        peer: {
                                            kind: isGroup ? "group" : "dm",
                                            id: isGroup ? (groupChannel !== null && groupChannel !== void 0 ? groupChannel : senderShip) : senderShip,
                                        },
                                    });
                                    fromLabel = isGroup ? "".concat(senderShip, " in ").concat(groupName) : senderShip;
                                    body = core.channel.reply.formatAgentEnvelope({
                                        channel: "Tlon",
                                        from: fromLabel,
                                        timestamp: timestamp,
                                        body: messageText,
                                    });
                                    ctxPayload = core.channel.reply.finalizeInboundContext({
                                        Body: body,
                                        RawBody: messageText,
                                        CommandBody: messageText,
                                        From: isGroup ? "tlon:group:".concat(groupChannel) : "tlon:".concat(senderShip),
                                        To: "tlon:".concat(botShipName),
                                        SessionKey: route.sessionKey,
                                        AccountId: route.accountId,
                                        ChatType: isGroup ? "group" : "direct",
                                        ConversationLabel: fromLabel,
                                        SenderName: senderShip,
                                        SenderId: senderShip,
                                        Provider: "tlon",
                                        Surface: "tlon",
                                        MessageSid: messageId,
                                        OriginatingChannel: "tlon",
                                        OriginatingTo: "tlon:".concat(isGroup ? groupChannel : botShipName),
                                    });
                                    dispatchStartTime = Date.now();
                                    responsePrefix = core.channel.reply.resolveEffectiveMessagesConfig(cfg, route.agentId).responsePrefix;
                                    humanDelay = core.channel.reply.resolveHumanDelayConfig(cfg, route.agentId);
                                    return [4 /*yield*/, core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
                                            ctx: ctxPayload,
                                            cfg: cfg,
                                            dispatcherOptions: {
                                                responsePrefix: responsePrefix,
                                                humanDelay: humanDelay,
                                                deliver: function (payload) { return __awaiter(_this, void 0, void 0, function () {
                                                    var replyText, showSignature, modelInfo, parsed;
                                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                                    return __generator(this, function (_j) {
                                                        switch (_j.label) {
                                                            case 0:
                                                                replyText = payload.text;
                                                                if (!replyText) {
                                                                    return [2 /*return*/];
                                                                }
                                                                showSignature = (_d = (_a = account.showModelSignature) !== null && _a !== void 0 ? _a : (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.tlon) === null || _c === void 0 ? void 0 : _c.showModelSignature) !== null && _d !== void 0 ? _d : false;
                                                                if (showSignature) {
                                                                    modelInfo = ((_e = payload.metadata) === null || _e === void 0 ? void 0 : _e.model) ||
                                                                        payload.model ||
                                                                        route.model ||
                                                                        ((_h = (_g = (_f = cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null || _g === void 0 ? void 0 : _g.model) === null || _h === void 0 ? void 0 : _h.primary);
                                                                    replyText = "".concat(replyText, "\n\n_[Generated by ").concat((0, utils_js_1.formatModelName)(modelInfo), "]_");
                                                                }
                                                                if (!(isGroup && groupChannel)) return [3 /*break*/, 2];
                                                                parsed = (0, targets_js_1.parseChannelNest)(groupChannel);
                                                                if (!parsed) {
                                                                    return [2 /*return*/];
                                                                }
                                                                return [4 /*yield*/, (0, send_js_1.sendGroupMessage)({
                                                                        api: api,
                                                                        fromShip: botShipName,
                                                                        hostShip: parsed.hostShip,
                                                                        channelName: parsed.channelName,
                                                                        text: replyText,
                                                                        replyToId: parentId !== null && parentId !== void 0 ? parentId : undefined,
                                                                    })];
                                                            case 1:
                                                                _j.sent();
                                                                return [3 /*break*/, 4];
                                                            case 2: return [4 /*yield*/, (0, send_js_1.sendDm)({ api: api, fromShip: botShipName, toShip: senderShip, text: replyText })];
                                                            case 3:
                                                                _j.sent();
                                                                _j.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                }); },
                                                onError: function (err, info) {
                                                    var _a;
                                                    var dispatchDuration = Date.now() - dispatchStartTime;
                                                    (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] ".concat(info.kind, " reply failed after ").concat(dispatchDuration, "ms: ").concat(String(err)));
                                                },
                                            },
                                        })];
                                case 16:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    subscribedChannels = new Set();
                    subscribedDMs = new Set();
                    _y.label = 9;
                case 9:
                    _y.trys.push([9, , 27, 31]);
                    (_q = runtime.log) === null || _q === void 0 ? void 0 : _q.call(runtime, "[tlon] Subscribing to updates...");
                    dmShips = [];
                    _y.label = 10;
                case 10:
                    _y.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, api.scry("/chat/dm.json")];
                case 11:
                    dmList = _y.sent();
                    if (Array.isArray(dmList)) {
                        dmShips = dmList;
                        (_r = runtime.log) === null || _r === void 0 ? void 0 : _r.call(runtime, "[tlon] Found ".concat(dmShips.length, " DM conversation(s)"));
                    }
                    return [3 /*break*/, 13];
                case 12:
                    error_3 = _y.sent();
                    (_s = runtime.error) === null || _s === void 0 ? void 0 : _s.call(runtime, "[tlon] Failed to fetch DM list: ".concat((_t = error_3 === null || error_3 === void 0 ? void 0 : error_3.message) !== null && _t !== void 0 ? _t : String(error_3)));
                    return [3 /*break*/, 13];
                case 13:
                    _i = 0, dmShips_1 = dmShips;
                    _y.label = 14;
                case 14:
                    if (!(_i < dmShips_1.length)) return [3 /*break*/, 17];
                    dmShip = dmShips_1[_i];
                    return [4 /*yield*/, subscribeToDM(dmShip)];
                case 15:
                    _y.sent();
                    _y.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17:
                    _a = 0, groupChannels_1 = groupChannels;
                    _y.label = 18;
                case 18:
                    if (!(_a < groupChannels_1.length)) return [3 /*break*/, 21];
                    channelNest = groupChannels_1[_a];
                    return [4 /*yield*/, subscribeToChannel(channelNest)];
                case 19:
                    _y.sent();
                    _y.label = 20;
                case 20:
                    _a++;
                    return [3 /*break*/, 18];
                case 21:
                    (_u = runtime.log) === null || _u === void 0 ? void 0 : _u.call(runtime, "[tlon] All subscriptions registered, connecting to SSE stream...");
                    return [4 /*yield*/, api.connect()];
                case 22:
                    _y.sent();
                    (_v = runtime.log) === null || _v === void 0 ? void 0 : _v.call(runtime, "[tlon] Connected! All subscriptions active");
                    pollInterval_1 = setInterval(function () {
                        var _a;
                        if (!((_a = opts.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted)) {
                            refreshChannelSubscriptions().catch(function (error) {
                                var _a, _b;
                                (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, "[tlon] Channel refresh error: ".concat((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : String(error)));
                            });
                        }
                    }, 2 * 60 * 1000);
                    if (!opts.abortSignal) return [3 /*break*/, 24];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            opts.abortSignal.addEventListener("abort", function () {
                                clearInterval(pollInterval_1);
                                resolve(null);
                            }, { once: true });
                        })];
                case 23:
                    _y.sent();
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, new Promise(function () { })];
                case 25:
                    _y.sent();
                    _y.label = 26;
                case 26: return [3 /*break*/, 31];
                case 27:
                    _y.trys.push([27, 29, , 30]);
                    return [4 /*yield*/, (api === null || api === void 0 ? void 0 : api.close())];
                case 28:
                    _y.sent();
                    return [3 /*break*/, 30];
                case 29:
                    error_4 = _y.sent();
                    (_w = runtime.error) === null || _w === void 0 ? void 0 : _w.call(runtime, "[tlon] Cleanup error: ".concat((_x = error_4 === null || error_4 === void 0 ? void 0 : error_4.message) !== null && _x !== void 0 ? _x : String(error_4)));
                    return [3 /*break*/, 30];
                case 30: return [7 /*endfinally*/];
                case 31: return [2 /*return*/];
            }
        });
    });
}
