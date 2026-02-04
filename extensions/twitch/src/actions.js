"use strict";
/**
 * Twitch message actions adapter.
 *
 * Handles tool-based actions for Twitch, such as sending messages.
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
exports.twitchMessageActions = void 0;
var config_js_1 = require("./config.js");
var outbound_js_1 = require("./outbound.js");
/**
 * Create a tool result with error content.
 */
function errorResponse(error) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ ok: false, error: error }),
            },
        ],
        details: { ok: false },
    };
}
/**
 * Read a string parameter from action arguments.
 *
 * @param args - Action arguments
 * @param key - Parameter key
 * @param options - Options for reading the parameter
 * @returns The parameter value or undefined if not found
 */
function readStringParam(args, key, options) {
    if (options === void 0) { options = {}; }
    var value = args[key];
    if (value === undefined || value === null) {
        if (options.required) {
            throw new Error("Missing required parameter: ".concat(key));
        }
        return undefined;
    }
    // Convert value to string safely
    if (typeof value === "string") {
        return options.trim !== false ? value.trim() : value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        var str = String(value);
        return options.trim !== false ? str.trim() : str;
    }
    throw new Error("Parameter ".concat(key, " must be a string, number, or boolean"));
}
/** Supported Twitch actions */
var TWITCH_ACTIONS = new Set(["send"]);
/**
 * Twitch message actions adapter.
 */
exports.twitchMessageActions = {
    /**
     * List available actions for this channel.
     */
    listActions: function () { return __spreadArray([], TWITCH_ACTIONS, true); },
    /**
     * Check if an action is supported.
     */
    supportsAction: function (_a) {
        var action = _a.action;
        return TWITCH_ACTIONS.has(action);
    },
    /**
     * Extract tool send parameters from action arguments.
     *
     * Parses and validates the "to" and "message" parameters for sending.
     *
     * @param params - Arguments from the tool call
     * @returns Parsed send parameters or null if invalid
     *
     * @example
     * const result = twitchMessageActions.extractToolSend!({
     *   args: { to: "#mychannel", message: "Hello!" }
     * });
     * // Returns: { to: "#mychannel", message: "Hello!" }
     */
    extractToolSend: function (_a) {
        var args = _a.args;
        try {
            var to = readStringParam(args, "to", { required: true });
            var message = readStringParam(args, "message", { required: true });
            if (!to || !message) {
                return null;
            }
            return { to: to, message: message };
        }
        catch (_b) {
            return null;
        }
    },
    /**
     * Handle an action execution.
     *
     * Processes the "send" action to send messages to Twitch.
     *
     * @param ctx - Action context including action type, parameters, and config
     * @returns Tool result with content or null if action not supported
     *
     * @example
     * const result = await twitchMessageActions.handleAction!({
     *   action: "send",
     *   params: { message: "Hello Twitch!", to: "#mychannel" },
     *   cfg: openclawConfig,
     *   accountId: "default",
     * });
     */
    handleAction: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var message, to, accountId, account, targetChannel, result, error_1, errorMsg;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (ctx.action !== "send") {
                        return [2 /*return*/, null];
                    }
                    message = readStringParam(ctx.params, "message", { required: true });
                    to = readStringParam(ctx.params, "to", { required: false });
                    accountId = (_a = ctx.accountId) !== null && _a !== void 0 ? _a : config_js_1.DEFAULT_ACCOUNT_ID;
                    account = (0, config_js_1.getAccountConfig)(ctx.cfg, accountId);
                    if (!account) {
                        return [2 /*return*/, errorResponse("Account not found: ".concat(accountId, ". Available accounts: ").concat(Object.keys((_d = (_c = (_b = ctx.cfg.channels) === null || _b === void 0 ? void 0 : _b.twitch) === null || _c === void 0 ? void 0 : _c.accounts) !== null && _d !== void 0 ? _d : {}).join(", ") || "none"))];
                    }
                    targetChannel = to || account.channel;
                    if (!targetChannel) {
                        return [2 /*return*/, errorResponse("No channel specified and no default channel in account config")];
                    }
                    if (!outbound_js_1.twitchOutbound.sendText) {
                        return [2 /*return*/, errorResponse("sendText not implemented")];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, outbound_js_1.twitchOutbound.sendText({
                            cfg: ctx.cfg,
                            to: targetChannel,
                            text: message !== null && message !== void 0 ? message : "",
                            accountId: accountId,
                        })];
                case 2:
                    result = _e.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify(result),
                                },
                            ],
                            details: { ok: true },
                        }];
                case 3:
                    error_1 = _e.sent();
                    errorMsg = error_1 instanceof Error ? error_1.message : String(error_1);
                    return [2 /*return*/, errorResponse(errorMsg)];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
