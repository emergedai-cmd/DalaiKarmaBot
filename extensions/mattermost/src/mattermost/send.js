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
exports.sendMessageMattermost = sendMessageMattermost;
var runtime_js_1 = require("../runtime.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var botUserCache = new Map();
var userByNameCache = new Map();
var getCore = function () { return (0, runtime_js_1.getMattermostRuntime)(); };
function cacheKey(baseUrl, token) {
    return "".concat(baseUrl, "::").concat(token);
}
function normalizeMessage(text, mediaUrl) {
    var trimmed = text.trim();
    var media = mediaUrl === null || mediaUrl === void 0 ? void 0 : mediaUrl.trim();
    return [trimmed, media].filter(Boolean).join("\n");
}
function isHttpUrl(value) {
    return /^https?:\/\//i.test(value);
}
function parseMattermostTarget(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        throw new Error("Recipient is required for Mattermost sends");
    }
    var lower = trimmed.toLowerCase();
    if (lower.startsWith("channel:")) {
        var id = trimmed.slice("channel:".length).trim();
        if (!id) {
            throw new Error("Channel id is required for Mattermost sends");
        }
        return { kind: "channel", id: id };
    }
    if (lower.startsWith("user:")) {
        var id = trimmed.slice("user:".length).trim();
        if (!id) {
            throw new Error("User id is required for Mattermost sends");
        }
        return { kind: "user", id: id };
    }
    if (lower.startsWith("mattermost:")) {
        var id = trimmed.slice("mattermost:".length).trim();
        if (!id) {
            throw new Error("User id is required for Mattermost sends");
        }
        return { kind: "user", id: id };
    }
    if (trimmed.startsWith("@")) {
        var username = trimmed.slice(1).trim();
        if (!username) {
            throw new Error("Username is required for Mattermost sends");
        }
        return { kind: "user", username: username };
    }
    return { kind: "channel", id: trimmed };
}
function resolveBotUser(baseUrl, token) {
    return __awaiter(this, void 0, void 0, function () {
        var key, cached, client, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = cacheKey(baseUrl, token);
                    cached = botUserCache.get(key);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    client = (0, client_js_1.createMattermostClient)({ baseUrl: baseUrl, botToken: token });
                    return [4 /*yield*/, (0, client_js_1.fetchMattermostMe)(client)];
                case 1:
                    user = _a.sent();
                    botUserCache.set(key, user);
                    return [2 /*return*/, user];
            }
        });
    });
}
function resolveUserIdByUsername(params) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, token, username, key, cached, client, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = params.baseUrl, token = params.token, username = params.username;
                    key = "".concat(cacheKey(baseUrl, token), "::").concat(username.toLowerCase());
                    cached = userByNameCache.get(key);
                    if (cached === null || cached === void 0 ? void 0 : cached.id) {
                        return [2 /*return*/, cached.id];
                    }
                    client = (0, client_js_1.createMattermostClient)({ baseUrl: baseUrl, botToken: token });
                    return [4 /*yield*/, (0, client_js_1.fetchMattermostUserByUsername)(client, username)];
                case 1:
                    user = _a.sent();
                    userByNameCache.set(key, user);
                    return [2 /*return*/, user.id];
            }
        });
    });
}
function resolveTargetChannelId(params) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, _a, botUser, client, channel;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (params.target.kind === "channel") {
                        return [2 /*return*/, params.target.id];
                    }
                    if (!params.target.id) return [3 /*break*/, 1];
                    _a = params.target.id;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, resolveUserIdByUsername({
                        baseUrl: params.baseUrl,
                        token: params.token,
                        username: (_b = params.target.username) !== null && _b !== void 0 ? _b : "",
                    })];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    userId = _a;
                    return [4 /*yield*/, resolveBotUser(params.baseUrl, params.token)];
                case 4:
                    botUser = _c.sent();
                    client = (0, client_js_1.createMattermostClient)({
                        baseUrl: params.baseUrl,
                        botToken: params.token,
                    });
                    return [4 /*yield*/, (0, client_js_1.createMattermostDirectChannel)(client, [botUser.id, userId])];
                case 5:
                    channel = _c.sent();
                    return [2 /*return*/, channel.id];
            }
        });
    });
}
function sendMessageMattermost(to_1, text_1) {
    return __awaiter(this, arguments, void 0, function (to, text, opts) {
        var core, logger, cfg, account, token, baseUrl, target, channelId, client, message, fileIds, uploadError, mediaUrl, media, fileInfo, err_1, tableMode, post;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    core = getCore();
                    logger = core.logging.getChildLogger({ module: "mattermost" });
                    cfg = core.config.loadConfig();
                    account = (0, accounts_js_1.resolveMattermostAccount)({
                        cfg: cfg,
                        accountId: opts.accountId,
                    });
                    token = ((_a = opts.botToken) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = account.botToken) === null || _b === void 0 ? void 0 : _b.trim());
                    if (!token) {
                        throw new Error("Mattermost bot token missing for account \"".concat(account.accountId, "\" (set channels.mattermost.accounts.").concat(account.accountId, ".botToken or MATTERMOST_BOT_TOKEN for default)."));
                    }
                    baseUrl = (0, client_js_1.normalizeMattermostBaseUrl)((_c = opts.baseUrl) !== null && _c !== void 0 ? _c : account.baseUrl);
                    if (!baseUrl) {
                        throw new Error("Mattermost baseUrl missing for account \"".concat(account.accountId, "\" (set channels.mattermost.accounts.").concat(account.accountId, ".baseUrl or MATTERMOST_URL for default)."));
                    }
                    target = parseMattermostTarget(to);
                    return [4 /*yield*/, resolveTargetChannelId({
                            target: target,
                            baseUrl: baseUrl,
                            token: token,
                        })];
                case 1:
                    channelId = _k.sent();
                    client = (0, client_js_1.createMattermostClient)({ baseUrl: baseUrl, botToken: token });
                    message = (_d = text === null || text === void 0 ? void 0 : text.trim()) !== null && _d !== void 0 ? _d : "";
                    mediaUrl = (_e = opts.mediaUrl) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!mediaUrl) return [3 /*break*/, 6];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, core.media.loadWebMedia(mediaUrl)];
                case 3:
                    media = _k.sent();
                    return [4 /*yield*/, (0, client_js_1.uploadMattermostFile)(client, {
                            channelId: channelId,
                            buffer: media.buffer,
                            fileName: (_f = media.fileName) !== null && _f !== void 0 ? _f : "upload",
                            contentType: (_g = media.contentType) !== null && _g !== void 0 ? _g : undefined,
                        })];
                case 4:
                    fileInfo = _k.sent();
                    fileIds = [fileInfo.id];
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _k.sent();
                    uploadError = err_1 instanceof Error ? err_1 : new Error(String(err_1));
                    if (core.logging.shouldLogVerbose()) {
                        (_h = logger.debug) === null || _h === void 0 ? void 0 : _h.call(logger, "mattermost send: media upload failed, falling back to URL text: ".concat(String(err_1)));
                    }
                    message = normalizeMessage(message, isHttpUrl(mediaUrl) ? mediaUrl : "");
                    return [3 /*break*/, 6];
                case 6:
                    if (message) {
                        tableMode = core.channel.text.resolveMarkdownTableMode({
                            cfg: cfg,
                            channel: "mattermost",
                            accountId: account.accountId,
                        });
                        message = core.channel.text.convertMarkdownTables(message, tableMode);
                    }
                    if (!message && (!fileIds || fileIds.length === 0)) {
                        if (uploadError) {
                            throw new Error("Mattermost media upload failed: ".concat(uploadError.message));
                        }
                        throw new Error("Mattermost message is empty");
                    }
                    return [4 /*yield*/, (0, client_js_1.createMattermostPost)(client, {
                            channelId: channelId,
                            message: message,
                            rootId: opts.replyToId,
                            fileIds: fileIds,
                        })];
                case 7:
                    post = _k.sent();
                    core.channel.activity.record({
                        channel: "mattermost",
                        accountId: account.accountId,
                        direction: "outbound",
                    });
                    return [2 /*return*/, {
                            messageId: (_j = post.id) !== null && _j !== void 0 ? _j : "unknown",
                            channelId: channelId,
                        }];
            }
        });
    });
}
