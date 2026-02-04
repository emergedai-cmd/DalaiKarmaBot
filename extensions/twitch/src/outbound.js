"use strict";
/**
 * Twitch outbound adapter for sending messages.
 *
 * Implements the ChannelOutboundAdapter interface for Twitch chat.
 * Supports text and media (URL) sending with markdown stripping and chunking.
 */
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
exports.twitchOutbound = void 0;
var config_js_1 = require("./config.js");
var send_js_1 = require("./send.js");
var markdown_js_1 = require("./utils/markdown.js");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Twitch outbound adapter.
 *
 * Handles sending text and media to Twitch channels with automatic
 * markdown stripping and message chunking.
 */
exports.twitchOutbound = {
    /** Direct delivery mode - messages are sent immediately */
    deliveryMode: "direct",
    /** Twitch chat message limit is 500 characters */
    textChunkLimit: 500,
    /** Word-boundary chunker with markdown stripping */
    chunker: markdown_js_1.chunkTextForTwitch,
    /**
     * Resolve target from context.
     *
     * Handles target resolution with allowlist support for implicit/heartbeat modes.
     * For explicit mode, accepts any valid channel name.
     *
     * @param params - Resolution parameters
     * @returns Resolved target or error
     */
    resolveTarget: function (_a) {
        var _b;
        var to = _a.to, allowFrom = _a.allowFrom, mode = _a.mode;
        var trimmed = (_b = to === null || to === void 0 ? void 0 : to.trim()) !== null && _b !== void 0 ? _b : "";
        var allowListRaw = (allowFrom !== null && allowFrom !== void 0 ? allowFrom : [])
            .map(function (entry) { return String(entry).trim(); })
            .filter(Boolean);
        var hasWildcard = allowListRaw.includes("*");
        var allowList = allowListRaw
            .filter(function (entry) { return entry !== "*"; })
            .map(function (entry) { return (0, twitch_js_1.normalizeTwitchChannel)(entry); })
            .filter(function (entry) { return entry.length > 0; });
        // If target is provided, normalize and validate it
        if (trimmed) {
            var normalizedTo = (0, twitch_js_1.normalizeTwitchChannel)(trimmed);
            // For implicit/heartbeat modes with allowList, check against allowlist
            if (mode === "implicit" || mode === "heartbeat") {
                if (hasWildcard || allowList.length === 0) {
                    return { ok: true, to: normalizedTo };
                }
                if (allowList.includes(normalizedTo)) {
                    return { ok: true, to: normalizedTo };
                }
                // Fallback to first allowFrom entry
                return { ok: true, to: allowList[0] };
            }
            // For explicit mode, accept any valid channel name
            return { ok: true, to: normalizedTo };
        }
        // No target provided, use allowFrom fallback
        if (allowList.length > 0) {
            return { ok: true, to: allowList[0] };
        }
        // No target and no allowFrom - error
        return {
            ok: false,
            error: (0, twitch_js_1.missingTargetError)("Twitch", "<channel-name> or channels.twitch.accounts.<account>.allowFrom[0]"),
        };
    },
    /**
     * Send a text message to a Twitch channel.
     *
     * Strips markdown if enabled, validates account configuration,
     * and sends the message via the Twitch client.
     *
     * @param params - Send parameters including target, text, and config
     * @returns Delivery result with message ID and status
     *
     * @example
     * const result = await twitchOutbound.sendText({
     *   cfg: openclawConfig,
     *   to: "#mychannel",
     *   text: "Hello Twitch!",
     *   accountId: "default",
     * });
     */
    sendText: function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, to, text, accountId, signal, resolvedAccountId, account, availableIds, channel, result;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    cfg = params.cfg, to = params.to, text = params.text, accountId = params.accountId, signal = params.signal;
                    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                        throw new Error("Outbound delivery aborted");
                    }
                    resolvedAccountId = accountId !== null && accountId !== void 0 ? accountId : config_js_1.DEFAULT_ACCOUNT_ID;
                    account = (0, config_js_1.getAccountConfig)(cfg, resolvedAccountId);
                    if (!account) {
                        availableIds = Object.keys((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch) === null || _b === void 0 ? void 0 : _b.accounts) !== null && _c !== void 0 ? _c : {});
                        throw new Error("Twitch account not found: ".concat(resolvedAccountId, ". ") +
                            "Available accounts: ".concat(availableIds.join(", ") || "none"));
                    }
                    channel = to || account.channel;
                    if (!channel) {
                        throw new Error("No channel specified and no default channel in account config");
                    }
                    return [4 /*yield*/, (0, send_js_1.sendMessageTwitchInternal)((0, twitch_js_1.normalizeTwitchChannel)(channel), text, cfg, resolvedAccountId, true, // stripMarkdown
                        console)];
                case 1:
                    result = _e.sent();
                    if (!result.ok) {
                        throw new Error((_d = result.error) !== null && _d !== void 0 ? _d : "Send failed");
                    }
                    return [2 /*return*/, {
                            channel: "twitch",
                            messageId: result.messageId,
                            timestamp: Date.now(),
                            to: (0, twitch_js_1.normalizeTwitchChannel)(channel),
                        }];
            }
        });
    }); },
    /**
     * Send media to a Twitch channel.
     *
     * Note: Twitch chat doesn't support direct media uploads.
     * This sends the media URL as text instead.
     *
     * @param params - Send parameters including media URL
     * @returns Delivery result with message ID and status
     *
     * @example
     * const result = await twitchOutbound.sendMedia({
     *   cfg: openclawConfig,
     *   to: "#mychannel",
     *   text: "Check this out!",
     *   mediaUrl: "https://example.com/image.png",
     *   accountId: "default",
     * });
     */
    sendMedia: function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var text, mediaUrl, signal, message;
        return __generator(this, function (_a) {
            text = params.text, mediaUrl = params.mediaUrl, signal = params.signal;
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                throw new Error("Outbound delivery aborted");
            }
            message = mediaUrl ? "".concat(text || "", " ").concat(mediaUrl).trim() : text;
            if (!exports.twitchOutbound.sendText) {
                throw new Error("sendText not implemented");
            }
            return [2 /*return*/, exports.twitchOutbound.sendText(__assign(__assign({}, params), { text: message }))];
        });
    }); },
};
