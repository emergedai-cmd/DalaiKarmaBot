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
exports.sendMessageNextcloudTalk = sendMessageNextcloudTalk;
exports.sendReactionNextcloudTalk = sendReactionNextcloudTalk;
var accounts_js_1 = require("./accounts.js");
var runtime_js_1 = require("./runtime.js");
var signature_js_1 = require("./signature.js");
function resolveCredentials(explicit, account) {
    var _a, _b, _c, _d;
    var baseUrl = (_b = (_a = explicit.baseUrl) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : account.baseUrl;
    var secret = (_d = (_c = explicit.secret) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : account.secret;
    if (!baseUrl) {
        throw new Error("Nextcloud Talk baseUrl missing for account \"".concat(account.accountId, "\" (set channels.nextcloud-talk.baseUrl)."));
    }
    if (!secret) {
        throw new Error("Nextcloud Talk bot secret missing for account \"".concat(account.accountId, "\" (set channels.nextcloud-talk.botSecret/botSecretFile or NEXTCLOUD_TALK_BOT_SECRET for default)."));
    }
    return { baseUrl: baseUrl, secret: secret };
}
function normalizeRoomToken(to) {
    var trimmed = to.trim();
    if (!trimmed) {
        throw new Error("Room token is required for Nextcloud Talk sends");
    }
    var normalized = trimmed;
    if (normalized.startsWith("nextcloud-talk:")) {
        normalized = normalized.slice("nextcloud-talk:".length).trim();
    }
    else if (normalized.startsWith("nc:")) {
        normalized = normalized.slice("nc:".length).trim();
    }
    if (normalized.startsWith("room:")) {
        normalized = normalized.slice("room:".length).trim();
    }
    if (!normalized) {
        throw new Error("Room token is required for Nextcloud Talk sends");
    }
    return normalized;
}
function sendMessageNextcloudTalk(to_1, text_1) {
    return __awaiter(this, arguments, void 0, function (to, text, opts) {
        var cfg, account, _a, baseUrl, secret, roomToken, tableMode, message, body, bodyStr, _b, random, signature, url, response, errorBody, status_1, errorMsg, messageId, timestamp, data, _c;
        var _d, _e, _f, _g;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cfg = (0, runtime_js_1.getNextcloudTalkRuntime)().config.loadConfig();
                    account = (0, accounts_js_1.resolveNextcloudTalkAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    _a = resolveCredentials({ baseUrl: opts.baseUrl, secret: opts.secret }, account), baseUrl = _a.baseUrl, secret = _a.secret;
                    roomToken = normalizeRoomToken(to);
                    if (!(text === null || text === void 0 ? void 0 : text.trim())) {
                        throw new Error("Message must be non-empty for Nextcloud Talk sends");
                    }
                    tableMode = (0, runtime_js_1.getNextcloudTalkRuntime)().channel.text.resolveMarkdownTableMode({
                        cfg: cfg,
                        channel: "nextcloud-talk",
                        accountId: account.accountId,
                    });
                    message = (0, runtime_js_1.getNextcloudTalkRuntime)().channel.text.convertMarkdownTables(text.trim(), tableMode);
                    body = {
                        message: message,
                    };
                    if (opts.replyTo) {
                        body.replyTo = opts.replyTo;
                    }
                    bodyStr = JSON.stringify(body);
                    _b = (0, signature_js_1.generateNextcloudTalkSignature)({
                        body: bodyStr,
                        secret: secret,
                    }), random = _b.random, signature = _b.signature;
                    url = "".concat(baseUrl, "/ocs/v2.php/apps/spreed/api/v1/bot/").concat(roomToken, "/message");
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "OCS-APIRequest": "true",
                                "X-Nextcloud-Talk-Bot-Random": random,
                                "X-Nextcloud-Talk-Bot-Signature": signature,
                            },
                            body: bodyStr,
                        })];
                case 1:
                    response = _h.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text().catch(function () { return ""; })];
                case 2:
                    errorBody = _h.sent();
                    status_1 = response.status;
                    errorMsg = "Nextcloud Talk send failed (".concat(status_1, ")");
                    if (status_1 === 400) {
                        errorMsg = "Nextcloud Talk: bad request - ".concat(errorBody || "invalid message format");
                    }
                    else if (status_1 === 401) {
                        errorMsg = "Nextcloud Talk: authentication failed - check bot secret";
                    }
                    else if (status_1 === 403) {
                        errorMsg = "Nextcloud Talk: forbidden - bot may not have permission in this room";
                    }
                    else if (status_1 === 404) {
                        errorMsg = "Nextcloud Talk: room not found (token=".concat(roomToken, ")");
                    }
                    else if (errorBody) {
                        errorMsg = "Nextcloud Talk send failed: ".concat(errorBody);
                    }
                    throw new Error(errorMsg);
                case 3:
                    messageId = "unknown";
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = (_h.sent());
                    if (((_e = (_d = data.ocs) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.id) != null) {
                        messageId = String(data.ocs.data.id);
                    }
                    if (typeof ((_g = (_f = data.ocs) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.timestamp) === "number") {
                        timestamp = data.ocs.data.timestamp;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    _c = _h.sent();
                    return [3 /*break*/, 7];
                case 7:
                    if (opts.verbose) {
                        console.log("[nextcloud-talk] Sent message ".concat(messageId, " to room ").concat(roomToken));
                    }
                    (0, runtime_js_1.getNextcloudTalkRuntime)().channel.activity.record({
                        channel: "nextcloud-talk",
                        accountId: account.accountId,
                        direction: "outbound",
                    });
                    return [2 /*return*/, { messageId: messageId, roomToken: roomToken, timestamp: timestamp }];
            }
        });
    });
}
function sendReactionNextcloudTalk(roomToken_1, messageId_1, reaction_1) {
    return __awaiter(this, arguments, void 0, function (roomToken, messageId, reaction, opts) {
        var cfg, account, _a, baseUrl, secret, normalizedToken, body, _b, random, signature, url, response, errorBody;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = (0, runtime_js_1.getNextcloudTalkRuntime)().config.loadConfig();
                    account = (0, accounts_js_1.resolveNextcloudTalkAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    _a = resolveCredentials({ baseUrl: opts.baseUrl, secret: opts.secret }, account), baseUrl = _a.baseUrl, secret = _a.secret;
                    normalizedToken = normalizeRoomToken(roomToken);
                    body = JSON.stringify({ reaction: reaction });
                    _b = (0, signature_js_1.generateNextcloudTalkSignature)({
                        body: body,
                        secret: secret,
                    }), random = _b.random, signature = _b.signature;
                    url = "".concat(baseUrl, "/ocs/v2.php/apps/spreed/api/v1/bot/").concat(normalizedToken, "/reaction/").concat(messageId);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "OCS-APIRequest": "true",
                                "X-Nextcloud-Talk-Bot-Random": random,
                                "X-Nextcloud-Talk-Bot-Signature": signature,
                            },
                            body: body,
                        })];
                case 1:
                    response = _c.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text().catch(function () { return ""; })];
                case 2:
                    errorBody = _c.sent();
                    throw new Error("Nextcloud Talk reaction failed: ".concat(response.status, " ").concat(errorBody).trim());
                case 3: return [2 /*return*/, { ok: true }];
            }
        });
    });
}
