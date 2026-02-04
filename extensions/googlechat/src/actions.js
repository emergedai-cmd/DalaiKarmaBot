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
exports.googlechatMessageActions = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var api_js_1 = require("./api.js");
var runtime_js_1 = require("./runtime.js");
var targets_js_1 = require("./targets.js");
var providerId = "googlechat";
function listEnabledAccounts(cfg) {
    return (0, accounts_js_1.listEnabledGoogleChatAccounts)(cfg).filter(function (account) { return account.enabled && account.credentialSource !== "none"; });
}
function isReactionsEnabled(accounts, cfg) {
    var _a, _b, _c;
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var account = accounts_1[_i];
        var gate = (0, plugin_sdk_1.createActionGate)(((_a = account.config.actions) !== null && _a !== void 0 ? _a : (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b["googlechat"]) === null || _c === void 0 ? void 0 : _c.actions));
        if (gate("reactions")) {
            return true;
        }
    }
    return false;
}
function resolveAppUserNames(account) {
    var _a;
    return new Set(["users/app", (_a = account.config.botUser) === null || _a === void 0 ? void 0 : _a.trim()].filter(Boolean));
}
exports.googlechatMessageActions = {
    listActions: function (_a) {
        var cfg = _a.cfg;
        var accounts = listEnabledAccounts(cfg);
        if (accounts.length === 0) {
            return [];
        }
        var actions = new Set([]);
        actions.add("send");
        if (isReactionsEnabled(accounts, cfg)) {
            actions.add("react");
            actions.add("reactions");
        }
        return Array.from(actions);
    },
    extractToolSend: function (_a) {
        var args = _a.args;
        var action = typeof args.action === "string" ? args.action.trim() : "";
        if (action !== "sendMessage") {
            return null;
        }
        var to = typeof args.to === "string" ? args.to : undefined;
        if (!to) {
            return null;
        }
        var accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
        return { to: to, accountId: accountId };
    },
    handleAction: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var account, to, content, mediaUrl, threadId, space, core, maxBytes, loaded, upload, messageName, _c, emoji_1, remove, isEmpty, reactions, appUsers_1, toRemove, _i, toRemove_1, reaction_1, reaction, messageName, limit, reactions;
        var _d, _e, _f;
        var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    account = (0, accounts_js_1.resolveGoogleChatAccount)({
                        cfg: cfg,
                        accountId: accountId,
                    });
                    if (account.credentialSource === "none") {
                        throw new Error("Google Chat credentials are missing.");
                    }
                    if (!(action === "send")) return [3 /*break*/, 7];
                    to = (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
                    content = (0, plugin_sdk_1.readStringParam)(params, "message", {
                        required: true,
                        allowEmpty: true,
                    });
                    mediaUrl = (0, plugin_sdk_1.readStringParam)(params, "media", { trim: false });
                    threadId = (_d = (0, plugin_sdk_1.readStringParam)(params, "threadId")) !== null && _d !== void 0 ? _d : (0, plugin_sdk_1.readStringParam)(params, "replyTo");
                    return [4 /*yield*/, (0, targets_js_1.resolveGoogleChatOutboundSpace)({ account: account, target: to })];
                case 1:
                    space = _g.sent();
                    if (!mediaUrl) return [3 /*break*/, 5];
                    core = (0, runtime_js_1.getGoogleChatRuntime)();
                    maxBytes = ((_e = account.config.mediaMaxMb) !== null && _e !== void 0 ? _e : 20) * 1024 * 1024;
                    return [4 /*yield*/, core.channel.media.fetchRemoteMedia(mediaUrl, { maxBytes: maxBytes })];
                case 2:
                    loaded = _g.sent();
                    return [4 /*yield*/, (0, api_js_1.uploadGoogleChatAttachment)({
                            account: account,
                            space: space,
                            filename: (_f = loaded.filename) !== null && _f !== void 0 ? _f : "attachment",
                            buffer: loaded.buffer,
                            contentType: loaded.contentType,
                        })];
                case 3:
                    upload = _g.sent();
                    return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                            account: account,
                            space: space,
                            text: content,
                            thread: threadId !== null && threadId !== void 0 ? threadId : undefined,
                            attachments: upload.attachmentUploadToken
                                ? [
                                    {
                                        attachmentUploadToken: upload.attachmentUploadToken,
                                        contentName: loaded.filename,
                                    },
                                ]
                                : undefined,
                        })];
                case 4:
                    _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, to: space })];
                case 5: return [4 /*yield*/, (0, api_js_1.sendGoogleChatMessage)({
                        account: account,
                        space: space,
                        text: content,
                        thread: threadId !== null && threadId !== void 0 ? threadId : undefined,
                    })];
                case 6:
                    _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, to: space })];
                case 7:
                    if (!(action === "react")) return [3 /*break*/, 15];
                    messageName = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    _c = (0, plugin_sdk_1.readReactionParams)(params, {
                        removeErrorMessage: "Emoji is required to remove a Google Chat reaction.",
                    }), emoji_1 = _c.emoji, remove = _c.remove, isEmpty = _c.isEmpty;
                    if (!(remove || isEmpty)) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, api_js_1.listGoogleChatReactions)({ account: account, messageName: messageName })];
                case 8:
                    reactions = _g.sent();
                    appUsers_1 = resolveAppUserNames(account);
                    toRemove = reactions.filter(function (reaction) {
                        var _a, _b, _c;
                        var userName = (_b = (_a = reaction.user) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.trim();
                        if (appUsers_1.size > 0 && !appUsers_1.has(userName !== null && userName !== void 0 ? userName : "")) {
                            return false;
                        }
                        if (emoji_1) {
                            return ((_c = reaction.emoji) === null || _c === void 0 ? void 0 : _c.unicode) === emoji_1;
                        }
                        return true;
                    });
                    _i = 0, toRemove_1 = toRemove;
                    _g.label = 9;
                case 9:
                    if (!(_i < toRemove_1.length)) return [3 /*break*/, 12];
                    reaction_1 = toRemove_1[_i];
                    if (!reaction_1.name) {
                        return [3 /*break*/, 11];
                    }
                    return [4 /*yield*/, (0, api_js_1.deleteGoogleChatReaction)({ account: account, reactionName: reaction_1.name })];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12: return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, removed: toRemove.length })];
                case 13: return [4 /*yield*/, (0, api_js_1.createGoogleChatReaction)({
                        account: account,
                        messageName: messageName,
                        emoji: emoji_1,
                    })];
                case 14:
                    reaction = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, reaction: reaction })];
                case 15:
                    if (!(action === "reactions")) return [3 /*break*/, 17];
                    messageName = (0, plugin_sdk_1.readStringParam)(params, "messageId", { required: true });
                    limit = (0, plugin_sdk_1.readNumberParam)(params, "limit", { integer: true });
                    return [4 /*yield*/, (0, api_js_1.listGoogleChatReactions)({
                            account: account,
                            messageName: messageName,
                            limit: limit !== null && limit !== void 0 ? limit : undefined,
                        })];
                case 16:
                    reactions = _g.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, reactions: reactions })];
                case 17: throw new Error("Action ".concat(action, " is not supported for provider ").concat(providerId, "."));
            }
        });
    }); },
};
