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
exports.probeTwitch = probeTwitch;
var auth_1 = require("@twurple/auth");
var chat_1 = require("@twurple/chat");
var twitch_js_1 = require("./utils/twitch.js");
/**
 * Probe a Twitch account to verify the connection is working
 *
 * This tests the Twitch OAuth token by attempting to connect
 * to the chat server and verify the bot's username.
 */
function probeTwitch(account, timeoutMs) {
    return __awaiter(this, void 0, void 0, function () {
        var started, rawToken, client, authProvider, connectionPromise, timeout, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    started = Date.now();
                    if (!account.token || !account.username) {
                        return [2 /*return*/, {
                                ok: false,
                                error: "missing credentials (token, username)",
                                username: account.username,
                                elapsedMs: Date.now() - started,
                            }];
                    }
                    rawToken = (0, twitch_js_1.normalizeToken)(account.token.trim());
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    authProvider = new auth_1.StaticAuthProvider((_a = account.clientId) !== null && _a !== void 0 ? _a : "", rawToken);
                    client = new chat_1.ChatClient({
                        authProvider: authProvider,
                    });
                    connectionPromise = new Promise(function (resolve, reject) {
                        var settled = false;
                        var connectListener;
                        var disconnectListener;
                        var authFailListener;
                        var cleanup = function () {
                            if (settled) {
                                return;
                            }
                            settled = true;
                            connectListener === null || connectListener === void 0 ? void 0 : connectListener.unbind();
                            disconnectListener === null || disconnectListener === void 0 ? void 0 : disconnectListener.unbind();
                            authFailListener === null || authFailListener === void 0 ? void 0 : authFailListener.unbind();
                        };
                        // Success: connection established
                        connectListener = client === null || client === void 0 ? void 0 : client.onConnect(function () {
                            cleanup();
                            resolve();
                        });
                        // Failure: disconnected (e.g., auth failed)
                        disconnectListener = client === null || client === void 0 ? void 0 : client.onDisconnect(function (_manually, reason) {
                            cleanup();
                            reject(reason || new Error("Disconnected"));
                        });
                        // Failure: authentication failed
                        authFailListener = client === null || client === void 0 ? void 0 : client.onAuthenticationFailure(function () {
                            cleanup();
                            reject(new Error("Authentication failed"));
                        });
                    });
                    timeout = new Promise(function (_, reject) {
                        setTimeout(function () { return reject(new Error("timeout after ".concat(timeoutMs, "ms"))); }, timeoutMs);
                    });
                    client.connect();
                    return [4 /*yield*/, Promise.race([connectionPromise, timeout])];
                case 2:
                    _b.sent();
                    client.quit();
                    client = undefined;
                    return [2 /*return*/, {
                            ok: true,
                            connected: true,
                            username: account.username,
                            channel: account.channel,
                            elapsedMs: Date.now() - started,
                        }];
                case 3:
                    error_1 = _b.sent();
                    return [2 /*return*/, {
                            ok: false,
                            error: error_1 instanceof Error ? error_1.message : String(error_1),
                            username: account.username,
                            channel: account.channel,
                            elapsedMs: Date.now() - started,
                        }];
                case 4:
                    if (client) {
                        try {
                            client.quit();
                        }
                        catch (_c) {
                            // Ignore cleanup errors
                        }
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
