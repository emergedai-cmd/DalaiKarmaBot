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
exports.TwitchClientManager = void 0;
var auth_1 = require("@twurple/auth");
var chat_1 = require("@twurple/chat");
var token_js_1 = require("./token.js");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Manages Twitch chat client connections
 */
var TwitchClientManager = /** @class */ (function () {
    function TwitchClientManager(logger) {
        this.logger = logger;
        this.clients = new Map();
        this.messageHandlers = new Map();
    }
    /**
     * Create an auth provider for the account.
     */
    TwitchClientManager.prototype.createAuthProvider = function (account, normalizedToken) {
        return __awaiter(this, void 0, void 0, function () {
            var authProvider, refreshStatus;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!account.clientId) {
                            throw new Error("Missing Twitch client ID");
                        }
                        if (!account.clientSecret) return [3 /*break*/, 2];
                        authProvider = new auth_1.RefreshingAuthProvider({
                            clientId: account.clientId,
                            clientSecret: account.clientSecret,
                        });
                        return [4 /*yield*/, authProvider
                                .addUserForToken({
                                accessToken: normalizedToken,
                                refreshToken: (_a = account.refreshToken) !== null && _a !== void 0 ? _a : null,
                                expiresIn: (_b = account.expiresIn) !== null && _b !== void 0 ? _b : null,
                                obtainmentTimestamp: (_c = account.obtainmentTimestamp) !== null && _c !== void 0 ? _c : Date.now(),
                            })
                                .then(function (userId) {
                                _this.logger.info("Added user ".concat(userId, " to RefreshingAuthProvider for ").concat(account.username));
                            })
                                .catch(function (err) {
                                _this.logger.error("Failed to add user to RefreshingAuthProvider: ".concat(err instanceof Error ? err.message : String(err)));
                            })];
                    case 1:
                        _d.sent();
                        authProvider.onRefresh(function (userId, token) {
                            _this.logger.info("Access token refreshed for user ".concat(userId, " (expires in ").concat(token.expiresIn ? "".concat(token.expiresIn, "s") : "unknown", ")"));
                        });
                        authProvider.onRefreshFailure(function (userId, error) {
                            _this.logger.error("Failed to refresh access token for user ".concat(userId, ": ").concat(error.message));
                        });
                        refreshStatus = account.refreshToken
                            ? "automatic token refresh enabled"
                            : "token refresh disabled (no refresh token)";
                        this.logger.info("Using RefreshingAuthProvider for ".concat(account.username, " (").concat(refreshStatus, ")"));
                        return [2 /*return*/, authProvider];
                    case 2:
                        this.logger.info("Using StaticAuthProvider for ".concat(account.username, " (no clientSecret provided)"));
                        return [2 /*return*/, new auth_1.StaticAuthProvider(account.clientId, normalizedToken)];
                }
            });
        });
    };
    /**
     * Get or create a chat client for an account
     */
    TwitchClientManager.prototype.getClient = function (account, cfg, accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var key, existing, tokenResolution, normalizedToken, authProvider, client;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        key = this.getAccountKey(account);
                        existing = this.clients.get(key);
                        if (existing) {
                            return [2 /*return*/, existing];
                        }
                        tokenResolution = (0, token_js_1.resolveTwitchToken)(cfg, {
                            accountId: accountId,
                        });
                        if (!tokenResolution.token) {
                            this.logger.error("Missing Twitch token for account ".concat(account.username, " (set channels.twitch.accounts.").concat(account.username, ".token or OPENCLAW_TWITCH_ACCESS_TOKEN for default)"));
                            throw new Error("Missing Twitch token");
                        }
                        (_b = (_a = this.logger).debug) === null || _b === void 0 ? void 0 : _b.call(_a, "Using ".concat(tokenResolution.source, " token source for ").concat(account.username));
                        if (!account.clientId) {
                            this.logger.error("Missing Twitch client ID for account ".concat(account.username));
                            throw new Error("Missing Twitch client ID");
                        }
                        normalizedToken = (0, twitch_js_1.normalizeToken)(tokenResolution.token);
                        return [4 /*yield*/, this.createAuthProvider(account, normalizedToken)];
                    case 1:
                        authProvider = _c.sent();
                        client = new chat_1.ChatClient({
                            authProvider: authProvider,
                            channels: [account.channel],
                            rejoinChannelsOnReconnect: true,
                            requestMembershipEvents: true,
                            logger: {
                                minLevel: chat_1.LogLevel.WARNING,
                                custom: {
                                    log: function (level, message) {
                                        var _a, _b, _c, _d;
                                        switch (level) {
                                            case chat_1.LogLevel.CRITICAL:
                                                _this.logger.error(message);
                                                break;
                                            case chat_1.LogLevel.ERROR:
                                                _this.logger.error(message);
                                                break;
                                            case chat_1.LogLevel.WARNING:
                                                _this.logger.warn(message);
                                                break;
                                            case chat_1.LogLevel.INFO:
                                                _this.logger.info(message);
                                                break;
                                            case chat_1.LogLevel.DEBUG:
                                                (_b = (_a = _this.logger).debug) === null || _b === void 0 ? void 0 : _b.call(_a, message);
                                                break;
                                            case chat_1.LogLevel.TRACE:
                                                (_d = (_c = _this.logger).debug) === null || _d === void 0 ? void 0 : _d.call(_c, message);
                                                break;
                                        }
                                    },
                                },
                            },
                        });
                        this.setupClientHandlers(client, account);
                        client.connect();
                        this.clients.set(key, client);
                        this.logger.info("Connected to Twitch as ".concat(account.username));
                        return [2 /*return*/, client];
                }
            });
        });
    };
    /**
     * Set up message and event handlers for a client
     */
    TwitchClientManager.prototype.setupClientHandlers = function (client, account) {
        var _this = this;
        var key = this.getAccountKey(account);
        // Handle incoming messages
        client.onMessage(function (channelName, _user, messageText, msg) {
            var _a, _b;
            var handler = _this.messageHandlers.get(key);
            if (handler) {
                var normalizedChannel = channelName.startsWith("#") ? channelName.slice(1) : channelName;
                var from = "twitch:".concat(msg.userInfo.userName);
                var preview = messageText.slice(0, 100).replace(/\n/g, "\\n");
                (_b = (_a = _this.logger).debug) === null || _b === void 0 ? void 0 : _b.call(_a, "twitch inbound: channel=".concat(normalizedChannel, " from=").concat(from, " len=").concat(messageText.length, " preview=\"").concat(preview, "\""));
                handler({
                    username: msg.userInfo.userName,
                    displayName: msg.userInfo.displayName,
                    userId: msg.userInfo.userId,
                    message: messageText,
                    channel: normalizedChannel,
                    id: msg.id,
                    timestamp: new Date(),
                    isMod: msg.userInfo.isMod,
                    isOwner: msg.userInfo.isBroadcaster,
                    isVip: msg.userInfo.isVip,
                    isSub: msg.userInfo.isSubscriber,
                    chatType: "group",
                });
            }
        });
        this.logger.info("Set up handlers for ".concat(key));
    };
    /**
     * Set a message handler for an account
     * @returns A function that removes the handler when called
     */
    TwitchClientManager.prototype.onMessage = function (account, handler) {
        var _this = this;
        var key = this.getAccountKey(account);
        this.messageHandlers.set(key, handler);
        return function () {
            _this.messageHandlers.delete(key);
        };
    };
    /**
     * Disconnect a client
     */
    TwitchClientManager.prototype.disconnect = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var key, client;
            return __generator(this, function (_a) {
                key = this.getAccountKey(account);
                client = this.clients.get(key);
                if (client) {
                    client.quit();
                    this.clients.delete(key);
                    this.messageHandlers.delete(key);
                    this.logger.info("Disconnected ".concat(key));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Disconnect all clients
     */
    TwitchClientManager.prototype.disconnectAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.clients.forEach(function (client) { return client.quit(); });
                this.clients.clear();
                this.messageHandlers.clear();
                this.logger.info(" Disconnected all clients");
                return [2 /*return*/];
            });
        });
    };
    /**
     * Send a message to a channel
     */
    TwitchClientManager.prototype.sendMessage = function (account, channel, message, cfg, accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var client, messageId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getClient(account, cfg, accountId)];
                    case 1:
                        client = _a.sent();
                        messageId = crypto.randomUUID();
                        // Send message (Twurple handles rate limiting)
                        return [4 /*yield*/, client.say(channel, message)];
                    case 2:
                        // Send message (Twurple handles rate limiting)
                        _a.sent();
                        return [2 /*return*/, { ok: true, messageId: messageId }];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error("Failed to send message: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                        return [2 /*return*/, {
                                ok: false,
                                error: error_1 instanceof Error ? error_1.message : String(error_1),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate a unique key for an account
     */
    TwitchClientManager.prototype.getAccountKey = function (account) {
        return "".concat(account.username, ":").concat(account.channel);
    };
    /**
     * Clear all clients and handlers (for testing)
     */
    TwitchClientManager.prototype._clearForTest = function () {
        this.clients.clear();
        this.messageHandlers.clear();
    };
    return TwitchClientManager;
}());
exports.TwitchClientManager = TwitchClientManager;
