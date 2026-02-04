"use strict";
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
exports.bluebubblesMessageActions = void 0;
var plugin_sdk_1 = require("openclaw/plugin-sdk");
var accounts_js_1 = require("./accounts.js");
var attachments_js_1 = require("./attachments.js");
var chat_js_1 = require("./chat.js");
var monitor_js_1 = require("./monitor.js");
var probe_js_1 = require("./probe.js");
var reactions_js_1 = require("./reactions.js");
var send_js_1 = require("./send.js");
var targets_js_1 = require("./targets.js");
var providerId = "bluebubbles";
function mapTarget(raw) {
    var parsed = (0, targets_js_1.parseBlueBubblesTarget)(raw);
    if (parsed.kind === "chat_guid") {
        return { kind: "chat_guid", chatGuid: parsed.chatGuid };
    }
    if (parsed.kind === "chat_id") {
        return { kind: "chat_id", chatId: parsed.chatId };
    }
    if (parsed.kind === "chat_identifier") {
        return { kind: "chat_identifier", chatIdentifier: parsed.chatIdentifier };
    }
    return {
        kind: "handle",
        address: (0, targets_js_1.normalizeBlueBubblesHandle)(parsed.to),
        service: parsed.service,
    };
}
function readMessageText(params) {
    var _a;
    return (_a = (0, plugin_sdk_1.readStringParam)(params, "text")) !== null && _a !== void 0 ? _a : (0, plugin_sdk_1.readStringParam)(params, "message");
}
function readBooleanParam(params, key) {
    var raw = params[key];
    if (typeof raw === "boolean") {
        return raw;
    }
    if (typeof raw === "string") {
        var trimmed = raw.trim().toLowerCase();
        if (trimmed === "true") {
            return true;
        }
        if (trimmed === "false") {
            return false;
        }
    }
    return undefined;
}
/** Supported action names for BlueBubbles */
var SUPPORTED_ACTIONS = new Set(plugin_sdk_1.BLUEBUBBLES_ACTION_NAMES);
exports.bluebubblesMessageActions = {
    listActions: function (_a) {
        var _b, _c;
        var cfg = _a.cfg;
        var account = (0, accounts_js_1.resolveBlueBubblesAccount)({ cfg: cfg });
        if (!account.enabled || !account.configured) {
            return [];
        }
        var gate = (0, plugin_sdk_1.createActionGate)((_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.bluebubbles) === null || _c === void 0 ? void 0 : _c.actions);
        var actions = new Set();
        var macOS26 = (0, probe_js_1.isMacOS26OrHigher)(account.accountId);
        for (var _i = 0, BLUEBUBBLES_ACTION_NAMES_1 = plugin_sdk_1.BLUEBUBBLES_ACTION_NAMES; _i < BLUEBUBBLES_ACTION_NAMES_1.length; _i++) {
            var action = BLUEBUBBLES_ACTION_NAMES_1[_i];
            var spec = plugin_sdk_1.BLUEBUBBLES_ACTIONS[action];
            if (!(spec === null || spec === void 0 ? void 0 : spec.gate)) {
                continue;
            }
            if (spec.unsupportedOnMacOS26 && macOS26) {
                continue;
            }
            if (gate(spec.gate)) {
                actions.add(action);
            }
        }
        return Array.from(actions);
    },
    supportsAction: function (_a) {
        var action = _a.action;
        return SUPPORTED_ACTIONS.has(action);
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
        var account, baseUrl, password, opts, resolveChatGuid, _c, emoji, remove, isEmpty, rawMessageId, messageId, partIndex, resolvedChatGuid, rawMessageId, newText, missing, messageId, partIndex, backwardsCompatMessage, rawMessageId, messageId, partIndex, rawMessageId, text, to, missing, messageId, partIndex, result, text, to, effectId, missing, result, resolvedChatGuid, displayName, resolvedChatGuid, base64Buffer, filename, contentType, buffer, resolvedChatGuid, address, resolvedChatGuid, address, resolvedChatGuid, to, filename, caption, contentType, asVoice, base64Buffer, filePath, buffer, result;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        var action = _b.action, params = _b.params, cfg = _b.cfg, accountId = _b.accountId, toolContext = _b.toolContext;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    account = (0, accounts_js_1.resolveBlueBubblesAccount)({
                        cfg: cfg,
                        accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                    });
                    baseUrl = (_d = account.config.serverUrl) === null || _d === void 0 ? void 0 : _d.trim();
                    password = (_e = account.config.password) === null || _e === void 0 ? void 0 : _e.trim();
                    opts = { cfg: cfg, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined };
                    resolveChatGuid = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var chatGuid, chatIdentifier, chatId, to, contextTarget, target, resolved;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    chatGuid = (0, plugin_sdk_1.readStringParam)(params, "chatGuid");
                                    if (chatGuid === null || chatGuid === void 0 ? void 0 : chatGuid.trim()) {
                                        return [2 /*return*/, chatGuid.trim()];
                                    }
                                    chatIdentifier = (0, plugin_sdk_1.readStringParam)(params, "chatIdentifier");
                                    chatId = (0, plugin_sdk_1.readNumberParam)(params, "chatId", { integer: true });
                                    to = (0, plugin_sdk_1.readStringParam)(params, "to");
                                    contextTarget = (_a = toolContext === null || toolContext === void 0 ? void 0 : toolContext.currentChannelId) === null || _a === void 0 ? void 0 : _a.trim();
                                    target = (chatIdentifier === null || chatIdentifier === void 0 ? void 0 : chatIdentifier.trim())
                                        ? {
                                            kind: "chat_identifier",
                                            chatIdentifier: chatIdentifier.trim(),
                                        }
                                        : typeof chatId === "number"
                                            ? { kind: "chat_id", chatId: chatId }
                                            : to
                                                ? mapTarget(to)
                                                : contextTarget
                                                    ? mapTarget(contextTarget)
                                                    : null;
                                    if (!target) {
                                        throw new Error("BlueBubbles ".concat(action, " requires chatGuid, chatIdentifier, chatId, or to."));
                                    }
                                    if (!baseUrl || !password) {
                                        throw new Error("BlueBubbles ".concat(action, " requires serverUrl and password."));
                                    }
                                    return [4 /*yield*/, (0, send_js_1.resolveChatGuidForTarget)({ baseUrl: baseUrl, password: password, target: target })];
                                case 1:
                                    resolved = _b.sent();
                                    if (!resolved) {
                                        throw new Error("BlueBubbles ".concat(action, " failed: chatGuid not found for target."));
                                    }
                                    return [2 /*return*/, resolved];
                            }
                        });
                    }); };
                    if (!(action === "react")) return [3 /*break*/, 3];
                    _c = (0, plugin_sdk_1.readReactionParams)(params, {
                        removeErrorMessage: "Emoji is required to remove a BlueBubbles reaction.",
                    }), emoji = _c.emoji, remove = _c.remove, isEmpty = _c.isEmpty;
                    if (isEmpty && !remove) {
                        throw new Error("BlueBubbles react requires emoji parameter. Use action=react with emoji=<emoji> and messageId=<message_id>.");
                    }
                    rawMessageId = (0, plugin_sdk_1.readStringParam)(params, "messageId");
                    if (!rawMessageId) {
                        throw new Error("BlueBubbles react requires messageId parameter (the message ID to react to). " +
                            "Use action=react with messageId=<message_id>, emoji=<emoji>, and to/chatGuid to identify the chat.");
                    }
                    messageId = (0, monitor_js_1.resolveBlueBubblesMessageId)(rawMessageId, { requireKnownShortId: true });
                    partIndex = (0, plugin_sdk_1.readNumberParam)(params, "partIndex", { integer: true });
                    return [4 /*yield*/, resolveChatGuid()];
                case 1:
                    resolvedChatGuid = _u.sent();
                    return [4 /*yield*/, (0, reactions_js_1.sendBlueBubblesReaction)({
                            chatGuid: resolvedChatGuid,
                            messageGuid: messageId,
                            emoji: emoji,
                            remove: remove || undefined,
                            partIndex: typeof partIndex === "number" ? partIndex : undefined,
                            opts: opts,
                        })];
                case 2:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)(__assign({ ok: true }, (remove ? { removed: true } : { added: emoji })))];
                case 3:
                    if (!(action === "edit")) return [3 /*break*/, 5];
                    // Edit is not supported on macOS 26+
                    if ((0, probe_js_1.isMacOS26OrHigher)(accountId !== null && accountId !== void 0 ? accountId : undefined)) {
                        throw new Error("BlueBubbles edit is not supported on macOS 26 or higher. " +
                            "Apple removed the ability to edit iMessages in this version.");
                    }
                    rawMessageId = (0, plugin_sdk_1.readStringParam)(params, "messageId");
                    newText = (_g = (_f = (0, plugin_sdk_1.readStringParam)(params, "text")) !== null && _f !== void 0 ? _f : (0, plugin_sdk_1.readStringParam)(params, "newText")) !== null && _g !== void 0 ? _g : (0, plugin_sdk_1.readStringParam)(params, "message");
                    if (!rawMessageId || !newText) {
                        missing = [];
                        if (!rawMessageId) {
                            missing.push("messageId (the message ID to edit)");
                        }
                        if (!newText) {
                            missing.push("text (the new message content)");
                        }
                        throw new Error("BlueBubbles edit requires: ".concat(missing.join(", "), ". ") +
                            "Use action=edit with messageId=<message_id>, text=<new_content>.");
                    }
                    messageId = (0, monitor_js_1.resolveBlueBubblesMessageId)(rawMessageId, { requireKnownShortId: true });
                    partIndex = (0, plugin_sdk_1.readNumberParam)(params, "partIndex", { integer: true });
                    backwardsCompatMessage = (0, plugin_sdk_1.readStringParam)(params, "backwardsCompatMessage");
                    return [4 /*yield*/, (0, chat_js_1.editBlueBubblesMessage)(messageId, newText, __assign(__assign({}, opts), { partIndex: typeof partIndex === "number" ? partIndex : undefined, backwardsCompatMessage: backwardsCompatMessage !== null && backwardsCompatMessage !== void 0 ? backwardsCompatMessage : undefined }))];
                case 4:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, edited: rawMessageId })];
                case 5:
                    if (!(action === "unsend")) return [3 /*break*/, 7];
                    rawMessageId = (0, plugin_sdk_1.readStringParam)(params, "messageId");
                    if (!rawMessageId) {
                        throw new Error("BlueBubbles unsend requires messageId parameter (the message ID to unsend). " +
                            "Use action=unsend with messageId=<message_id>.");
                    }
                    messageId = (0, monitor_js_1.resolveBlueBubblesMessageId)(rawMessageId, { requireKnownShortId: true });
                    partIndex = (0, plugin_sdk_1.readNumberParam)(params, "partIndex", { integer: true });
                    return [4 /*yield*/, (0, chat_js_1.unsendBlueBubblesMessage)(messageId, __assign(__assign({}, opts), { partIndex: typeof partIndex === "number" ? partIndex : undefined }))];
                case 6:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, unsent: rawMessageId })];
                case 7:
                    if (!(action === "reply")) return [3 /*break*/, 9];
                    rawMessageId = (0, plugin_sdk_1.readStringParam)(params, "messageId");
                    text = readMessageText(params);
                    to = (_h = (0, plugin_sdk_1.readStringParam)(params, "to")) !== null && _h !== void 0 ? _h : (0, plugin_sdk_1.readStringParam)(params, "target");
                    if (!rawMessageId || !text || !to) {
                        missing = [];
                        if (!rawMessageId) {
                            missing.push("messageId (the message ID to reply to)");
                        }
                        if (!text) {
                            missing.push("text or message (the reply message content)");
                        }
                        if (!to) {
                            missing.push("to or target (the chat target)");
                        }
                        throw new Error("BlueBubbles reply requires: ".concat(missing.join(", "), ". ") +
                            "Use action=reply with messageId=<message_id>, message=<your reply>, target=<chat_target>.");
                    }
                    messageId = (0, monitor_js_1.resolveBlueBubblesMessageId)(rawMessageId, { requireKnownShortId: true });
                    partIndex = (0, plugin_sdk_1.readNumberParam)(params, "partIndex", { integer: true });
                    return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(to, text, __assign(__assign({}, opts), { replyToMessageGuid: messageId, replyToPartIndex: typeof partIndex === "number" ? partIndex : undefined }))];
                case 8:
                    result = _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, messageId: result.messageId, repliedTo: rawMessageId })];
                case 9:
                    if (!(action === "sendWithEffect")) return [3 /*break*/, 11];
                    text = readMessageText(params);
                    to = (_j = (0, plugin_sdk_1.readStringParam)(params, "to")) !== null && _j !== void 0 ? _j : (0, plugin_sdk_1.readStringParam)(params, "target");
                    effectId = (_k = (0, plugin_sdk_1.readStringParam)(params, "effectId")) !== null && _k !== void 0 ? _k : (0, plugin_sdk_1.readStringParam)(params, "effect");
                    if (!text || !to || !effectId) {
                        missing = [];
                        if (!text) {
                            missing.push("text or message (the message content)");
                        }
                        if (!to) {
                            missing.push("to or target (the chat target)");
                        }
                        if (!effectId) {
                            missing.push("effectId or effect (e.g., slam, loud, gentle, invisible-ink, confetti, lasers, fireworks, balloons, heart)");
                        }
                        throw new Error("BlueBubbles sendWithEffect requires: ".concat(missing.join(", "), ". ") +
                            "Use action=sendWithEffect with message=<message>, target=<chat_target>, effectId=<effect_name>.");
                    }
                    return [4 /*yield*/, (0, send_js_1.sendMessageBlueBubbles)(to, text, __assign(__assign({}, opts), { effectId: effectId }))];
                case 10:
                    result = _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, messageId: result.messageId, effect: effectId })];
                case 11:
                    if (!(action === "renameGroup")) return [3 /*break*/, 14];
                    return [4 /*yield*/, resolveChatGuid()];
                case 12:
                    resolvedChatGuid = _u.sent();
                    displayName = (_l = (0, plugin_sdk_1.readStringParam)(params, "displayName")) !== null && _l !== void 0 ? _l : (0, plugin_sdk_1.readStringParam)(params, "name");
                    if (!displayName) {
                        throw new Error("BlueBubbles renameGroup requires displayName or name parameter.");
                    }
                    return [4 /*yield*/, (0, chat_js_1.renameBlueBubblesChat)(resolvedChatGuid, displayName, opts)];
                case 13:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, renamed: resolvedChatGuid, displayName: displayName })];
                case 14:
                    if (!(action === "setGroupIcon")) return [3 /*break*/, 17];
                    return [4 /*yield*/, resolveChatGuid()];
                case 15:
                    resolvedChatGuid = _u.sent();
                    base64Buffer = (0, plugin_sdk_1.readStringParam)(params, "buffer");
                    filename = (_o = (_m = (0, plugin_sdk_1.readStringParam)(params, "filename")) !== null && _m !== void 0 ? _m : (0, plugin_sdk_1.readStringParam)(params, "name")) !== null && _o !== void 0 ? _o : "icon.png";
                    contentType = (_p = (0, plugin_sdk_1.readStringParam)(params, "contentType")) !== null && _p !== void 0 ? _p : (0, plugin_sdk_1.readStringParam)(params, "mimeType");
                    if (!base64Buffer) {
                        throw new Error("BlueBubbles setGroupIcon requires an image. " +
                            "Use action=setGroupIcon with media=<image_url> or path=<local_file_path> to set the group icon.");
                    }
                    buffer = Uint8Array.from(atob(base64Buffer), function (c) { return c.charCodeAt(0); });
                    return [4 /*yield*/, (0, chat_js_1.setGroupIconBlueBubbles)(resolvedChatGuid, buffer, filename, __assign(__assign({}, opts), { contentType: contentType !== null && contentType !== void 0 ? contentType : undefined }))];
                case 16:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, chatGuid: resolvedChatGuid, iconSet: true })];
                case 17:
                    if (!(action === "addParticipant")) return [3 /*break*/, 20];
                    return [4 /*yield*/, resolveChatGuid()];
                case 18:
                    resolvedChatGuid = _u.sent();
                    address = (_q = (0, plugin_sdk_1.readStringParam)(params, "address")) !== null && _q !== void 0 ? _q : (0, plugin_sdk_1.readStringParam)(params, "participant");
                    if (!address) {
                        throw new Error("BlueBubbles addParticipant requires address or participant parameter.");
                    }
                    return [4 /*yield*/, (0, chat_js_1.addBlueBubblesParticipant)(resolvedChatGuid, address, opts)];
                case 19:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, added: address, chatGuid: resolvedChatGuid })];
                case 20:
                    if (!(action === "removeParticipant")) return [3 /*break*/, 23];
                    return [4 /*yield*/, resolveChatGuid()];
                case 21:
                    resolvedChatGuid = _u.sent();
                    address = (_r = (0, plugin_sdk_1.readStringParam)(params, "address")) !== null && _r !== void 0 ? _r : (0, plugin_sdk_1.readStringParam)(params, "participant");
                    if (!address) {
                        throw new Error("BlueBubbles removeParticipant requires address or participant parameter.");
                    }
                    return [4 /*yield*/, (0, chat_js_1.removeBlueBubblesParticipant)(resolvedChatGuid, address, opts)];
                case 22:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, removed: address, chatGuid: resolvedChatGuid })];
                case 23:
                    if (!(action === "leaveGroup")) return [3 /*break*/, 26];
                    return [4 /*yield*/, resolveChatGuid()];
                case 24:
                    resolvedChatGuid = _u.sent();
                    return [4 /*yield*/, (0, chat_js_1.leaveBlueBubblesChat)(resolvedChatGuid, opts)];
                case 25:
                    _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, left: resolvedChatGuid })];
                case 26:
                    if (!(action === "sendAttachment")) return [3 /*break*/, 28];
                    to = (0, plugin_sdk_1.readStringParam)(params, "to", { required: true });
                    filename = (0, plugin_sdk_1.readStringParam)(params, "filename", { required: true });
                    caption = (0, plugin_sdk_1.readStringParam)(params, "caption");
                    contentType = (_s = (0, plugin_sdk_1.readStringParam)(params, "contentType")) !== null && _s !== void 0 ? _s : (0, plugin_sdk_1.readStringParam)(params, "mimeType");
                    asVoice = readBooleanParam(params, "asVoice");
                    base64Buffer = (0, plugin_sdk_1.readStringParam)(params, "buffer");
                    filePath = (_t = (0, plugin_sdk_1.readStringParam)(params, "path")) !== null && _t !== void 0 ? _t : (0, plugin_sdk_1.readStringParam)(params, "filePath");
                    buffer = void 0;
                    if (base64Buffer) {
                        // Decode base64 to buffer
                        buffer = Uint8Array.from(atob(base64Buffer), function (c) { return c.charCodeAt(0); });
                    }
                    else if (filePath) {
                        // Read file from path (will be handled by caller providing buffer)
                        throw new Error("BlueBubbles sendAttachment: filePath not supported in action, provide buffer as base64.");
                    }
                    else {
                        throw new Error("BlueBubbles sendAttachment requires buffer (base64) parameter.");
                    }
                    return [4 /*yield*/, (0, attachments_js_1.sendBlueBubblesAttachment)({
                            to: to,
                            buffer: buffer,
                            filename: filename,
                            contentType: contentType !== null && contentType !== void 0 ? contentType : undefined,
                            caption: caption !== null && caption !== void 0 ? caption : undefined,
                            asVoice: asVoice !== null && asVoice !== void 0 ? asVoice : undefined,
                            opts: opts,
                        })];
                case 27:
                    result = _u.sent();
                    return [2 /*return*/, (0, plugin_sdk_1.jsonResult)({ ok: true, messageId: result.messageId })];
                case 28: throw new Error("Action ".concat(action, " is not supported for provider ").concat(providerId, "."));
            }
        });
    }); },
};
