"use strict";
/**
 * Twitch message sending functions with dependency injection support.
 *
 * These functions are the primary interface for sending messages to Twitch.
 * They support dependency injection via the `deps` parameter for testability.
 */
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
exports.sendMessageTwitchInternal = sendMessageTwitchInternal;
var client_manager_registry_js_1 = require("./client-manager-registry.js");
var config_js_1 = require("./config.js");
var token_js_1 = require("./token.js");
var markdown_js_1 = require("./utils/markdown.js");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Internal send function used by the outbound adapter.
 *
 * This function has access to the full OpenClaw config and handles
 * account resolution, markdown stripping, and actual message sending.
 *
 * @param channel - The channel name
 * @param text - The message text
 * @param cfg - Full OpenClaw configuration
 * @param accountId - Account ID to use
 * @param stripMarkdown - Whether to strip markdown (default: true)
 * @param logger - Logger instance
 * @returns Result with message ID and status
 *
 * @example
 * const result = await sendMessageTwitchInternal(
 *   "#mychannel",
 *   "Hello Twitch!",
 *   openclawConfig,
 *   "default",
 *   true,
 *   console,
 * );
 */
function sendMessageTwitchInternal(channel_1, text_1, cfg_1) {
    return __awaiter(this, arguments, void 0, function (channel, text, cfg, accountId, stripMarkdown, logger) {
        var account, availableIds, tokenResolution, normalizedChannel, cleanedText, clientManager, result, error_1, errorMsg;
        var _a, _b, _c, _d, _e, _f;
        if (accountId === void 0) { accountId = config_js_1.DEFAULT_ACCOUNT_ID; }
        if (stripMarkdown === void 0) { stripMarkdown = true; }
        if (logger === void 0) { logger = console; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    account = (0, config_js_1.getAccountConfig)(cfg, accountId);
                    if (!account) {
                        availableIds = Object.keys((_c = (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.twitch) === null || _b === void 0 ? void 0 : _b.accounts) !== null && _c !== void 0 ? _c : {});
                        return [2 /*return*/, {
                                ok: false,
                                messageId: (0, twitch_js_1.generateMessageId)(),
                                error: "Account not found: ".concat(accountId, ". Available accounts: ").concat(availableIds.join(", ") || "none"),
                            }];
                    }
                    tokenResolution = (0, token_js_1.resolveTwitchToken)(cfg, { accountId: accountId });
                    if (!(0, twitch_js_1.isAccountConfigured)(account, tokenResolution.token)) {
                        return [2 /*return*/, {
                                ok: false,
                                messageId: (0, twitch_js_1.generateMessageId)(),
                                error: "Account ".concat(accountId, " is not properly configured. ") +
                                    "Required: username, clientId, and token (config or env for default account).",
                            }];
                    }
                    normalizedChannel = channel || account.channel;
                    if (!normalizedChannel) {
                        return [2 /*return*/, {
                                ok: false,
                                messageId: (0, twitch_js_1.generateMessageId)(),
                                error: "No channel specified and no default channel in account config",
                            }];
                    }
                    cleanedText = stripMarkdown ? (0, markdown_js_1.stripMarkdownForTwitch)(text) : text;
                    if (!cleanedText) {
                        return [2 /*return*/, {
                                ok: true,
                                messageId: "skipped",
                            }];
                    }
                    clientManager = (0, client_manager_registry_js_1.getClientManager)(accountId);
                    if (!clientManager) {
                        return [2 /*return*/, {
                                ok: false,
                                messageId: (0, twitch_js_1.generateMessageId)(),
                                error: "Client manager not found for account: ".concat(accountId, ". Please start the Twitch gateway first."),
                            }];
                    }
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clientManager.sendMessage(account, (0, twitch_js_1.normalizeTwitchChannel)(normalizedChannel), cleanedText, cfg, accountId)];
                case 2:
                    result = _g.sent();
                    if (!result.ok) {
                        return [2 /*return*/, {
                                ok: false,
                                messageId: (_d = result.messageId) !== null && _d !== void 0 ? _d : (0, twitch_js_1.generateMessageId)(),
                                error: (_e = result.error) !== null && _e !== void 0 ? _e : "Send failed",
                            }];
                    }
                    return [2 /*return*/, {
                            ok: true,
                            messageId: (_f = result.messageId) !== null && _f !== void 0 ? _f : (0, twitch_js_1.generateMessageId)(),
                        }];
                case 3:
                    error_1 = _g.sent();
                    errorMsg = error_1 instanceof Error ? error_1.message : String(error_1);
                    logger.error("Failed to send message: ".concat(errorMsg));
                    return [2 /*return*/, {
                            ok: false,
                            messageId: (0, twitch_js_1.generateMessageId)(),
                            error: errorMsg,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
