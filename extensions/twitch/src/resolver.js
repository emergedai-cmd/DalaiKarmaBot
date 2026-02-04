"use strict";
/**
 * Twitch resolver adapter for channel/user name resolution.
 *
 * This module implements the ChannelResolverAdapter interface to resolve
 * Twitch usernames to user IDs via the Twitch Helix API.
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
exports.resolveTwitchTargets = resolveTwitchTargets;
var api_1 = require("@twurple/api");
var auth_1 = require("@twurple/auth");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Normalize a Twitch username - strip @ prefix and convert to lowercase
 */
function normalizeUsername(input) {
    var trimmed = input.trim();
    if (trimmed.startsWith("@")) {
        return trimmed.slice(1).toLowerCase();
    }
    return trimmed.toLowerCase();
}
/**
 * Create a logger that includes the Twitch prefix
 */
function createLogger(logger) {
    return {
        info: function (msg) { return logger === null || logger === void 0 ? void 0 : logger.info(msg); },
        warn: function (msg) { return logger === null || logger === void 0 ? void 0 : logger.warn(msg); },
        error: function (msg) { return logger === null || logger === void 0 ? void 0 : logger.error(msg); },
        debug: function (msg) { var _a, _b; return (_b = (_a = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, msg)) !== null && _b !== void 0 ? _b : (function () { }); },
    };
}
/**
 * Resolve Twitch usernames to user IDs via the Helix API
 *
 * @param inputs - Array of usernames or user IDs to resolve
 * @param account - Twitch account configuration with auth credentials
 * @param kind - Type of target to resolve ("user" or "group")
 * @param logger - Optional logger
 * @returns Promise resolving to array of ChannelResolveResult
 */
function resolveTwitchTargets(inputs, account, kind, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var log, normalizedToken, authProvider, apiClient, results, _i, inputs_1, input, normalized, looksLikeUserId, user, user, error_1, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log = createLogger(logger);
                    if (!account.clientId || !account.token) {
                        log.error("Missing Twitch client ID or token");
                        return [2 /*return*/, inputs.map(function (input) { return ({
                                input: input,
                                resolved: false,
                                note: "missing Twitch credentials",
                            }); })];
                    }
                    normalizedToken = (0, twitch_js_1.normalizeToken)(account.token);
                    authProvider = new auth_1.StaticAuthProvider(account.clientId, normalizedToken);
                    apiClient = new api_1.ApiClient({ authProvider: authProvider });
                    results = [];
                    _i = 0, inputs_1 = inputs;
                    _c.label = 1;
                case 1:
                    if (!(_i < inputs_1.length)) return [3 /*break*/, 9];
                    input = inputs_1[_i];
                    normalized = normalizeUsername(input);
                    if (!normalized) {
                        results.push({
                            input: input,
                            resolved: false,
                            note: "empty input",
                        });
                        return [3 /*break*/, 8];
                    }
                    looksLikeUserId = /^\d+$/.test(normalized);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, , 8]);
                    if (!looksLikeUserId) return [3 /*break*/, 4];
                    return [4 /*yield*/, apiClient.users.getUserById(normalized)];
                case 3:
                    user = _c.sent();
                    if (user) {
                        results.push({
                            input: input,
                            resolved: true,
                            id: user.id,
                            name: user.name,
                        });
                        (_a = log.debug) === null || _a === void 0 ? void 0 : _a.call(log, "Resolved user ID ".concat(normalized, " -> ").concat(user.name));
                    }
                    else {
                        results.push({
                            input: input,
                            resolved: false,
                            note: "user ID not found",
                        });
                        log.warn("User ID ".concat(normalized, " not found"));
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, apiClient.users.getUserByName(normalized)];
                case 5:
                    user = _c.sent();
                    if (user) {
                        results.push({
                            input: input,
                            resolved: true,
                            id: user.id,
                            name: user.name,
                            note: user.displayName !== user.name ? "display: ".concat(user.displayName) : undefined,
                        });
                        (_b = log.debug) === null || _b === void 0 ? void 0 : _b.call(log, "Resolved username ".concat(normalized, " -> ").concat(user.id, " (").concat(user.name, ")"));
                    }
                    else {
                        results.push({
                            input: input,
                            resolved: false,
                            note: "username not found",
                        });
                        log.warn("Username ".concat(normalized, " not found"));
                    }
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                    results.push({
                        input: input,
                        resolved: false,
                        note: "API error: ".concat(errorMessage),
                    });
                    log.error("Failed to resolve ".concat(input, ": ").concat(errorMessage));
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, results];
            }
        });
    });
}
