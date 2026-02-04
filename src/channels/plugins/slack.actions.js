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
exports.createSlackActions = createSlackActions;
var common_js_1 = require("../../agents/tools/common.js");
var slack_actions_js_1 = require("../../agents/tools/slack-actions.js");
var accounts_js_1 = require("../../slack/accounts.js");
var targets_js_1 = require("../../slack/targets.js");
function createSlackActions(providerId) {
    var _this = this;
    return {
        listActions: function (_a) {
            var cfg = _a.cfg;
            var accounts = (0, accounts_js_1.listEnabledSlackAccounts)(cfg).filter(function (account) { return account.botTokenSource !== "none"; });
            if (accounts.length === 0) {
                return [];
            }
            var isActionEnabled = function (key, defaultValue) {
                var _a, _b, _c;
                if (defaultValue === void 0) { defaultValue = true; }
                for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
                    var account = accounts_1[_i];
                    var gate = (0, common_js_1.createActionGate)(((_a = account.actions) !== null && _a !== void 0 ? _a : (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.slack) === null || _c === void 0 ? void 0 : _c.actions));
                    if (gate(key, defaultValue)) {
                        return true;
                    }
                }
                return false;
            };
            var actions = new Set(["send"]);
            if (isActionEnabled("reactions")) {
                actions.add("react");
                actions.add("reactions");
            }
            if (isActionEnabled("messages")) {
                actions.add("read");
                actions.add("edit");
                actions.add("delete");
            }
            if (isActionEnabled("pins")) {
                actions.add("pin");
                actions.add("unpin");
                actions.add("list-pins");
            }
            if (isActionEnabled("memberInfo")) {
                actions.add("member-info");
            }
            if (isActionEnabled("emojiList")) {
                actions.add("emoji-list");
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
        handleAction: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            var action, params, cfg, accountId, toolContext, resolveChannelId, to, content, mediaUrl, threadId, replyTo, messageId, emoji, remove, messageId, limit, limit, messageId, content, messageId, messageId, userId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        action = ctx.action, params = ctx.params, cfg = ctx.cfg;
                        accountId = (_a = ctx.accountId) !== null && _a !== void 0 ? _a : undefined;
                        toolContext = ctx.toolContext;
                        resolveChannelId = function () {
                            var _a;
                            return (0, targets_js_1.resolveSlackChannelId)((_a = (0, common_js_1.readStringParam)(params, "channelId")) !== null && _a !== void 0 ? _a : (0, common_js_1.readStringParam)(params, "to", { required: true }));
                        };
                        if (!(action === "send")) return [3 /*break*/, 2];
                        to = (0, common_js_1.readStringParam)(params, "to", { required: true });
                        content = (0, common_js_1.readStringParam)(params, "message", {
                            required: true,
                            allowEmpty: true,
                        });
                        mediaUrl = (0, common_js_1.readStringParam)(params, "media", { trim: false });
                        threadId = (0, common_js_1.readStringParam)(params, "threadId");
                        replyTo = (0, common_js_1.readStringParam)(params, "replyTo");
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "sendMessage",
                                to: to,
                                content: content,
                                mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                                threadTs: (_b = threadId !== null && threadId !== void 0 ? threadId : replyTo) !== null && _b !== void 0 ? _b : undefined,
                            }, cfg, toolContext)];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        if (!(action === "react")) return [3 /*break*/, 4];
                        messageId = (0, common_js_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        emoji = (0, common_js_1.readStringParam)(params, "emoji", { allowEmpty: true });
                        remove = typeof params.remove === "boolean" ? params.remove : undefined;
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "react",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                emoji: emoji,
                                remove: remove,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4:
                        if (!(action === "reactions")) return [3 /*break*/, 6];
                        messageId = (0, common_js_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        limit = (0, common_js_1.readNumberParam)(params, "limit", { integer: true });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "reactions",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                limit: limit,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6:
                        if (!(action === "read")) return [3 /*break*/, 8];
                        limit = (0, common_js_1.readNumberParam)(params, "limit", { integer: true });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "readMessages",
                                channelId: resolveChannelId(),
                                limit: limit,
                                before: (0, common_js_1.readStringParam)(params, "before"),
                                after: (0, common_js_1.readStringParam)(params, "after"),
                                threadId: (0, common_js_1.readStringParam)(params, "threadId"),
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8:
                        if (!(action === "edit")) return [3 /*break*/, 10];
                        messageId = (0, common_js_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        content = (0, common_js_1.readStringParam)(params, "message", { required: true });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "editMessage",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                content: content,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 9: return [2 /*return*/, _c.sent()];
                    case 10:
                        if (!(action === "delete")) return [3 /*break*/, 12];
                        messageId = (0, common_js_1.readStringParam)(params, "messageId", {
                            required: true,
                        });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: "deleteMessage",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 11: return [2 /*return*/, _c.sent()];
                    case 12:
                        if (!(action === "pin" || action === "unpin" || action === "list-pins")) return [3 /*break*/, 14];
                        messageId = action === "list-pins"
                            ? undefined
                            : (0, common_js_1.readStringParam)(params, "messageId", { required: true });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({
                                action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
                                channelId: resolveChannelId(),
                                messageId: messageId,
                                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                            }, cfg)];
                    case 13: return [2 /*return*/, _c.sent()];
                    case 14:
                        if (!(action === "member-info")) return [3 /*break*/, 16];
                        userId = (0, common_js_1.readStringParam)(params, "userId", { required: true });
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "memberInfo", userId: userId, accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                    case 15: return [2 /*return*/, _c.sent()];
                    case 16:
                        if (!(action === "emoji-list")) return [3 /*break*/, 18];
                        return [4 /*yield*/, (0, slack_actions_js_1.handleSlackAction)({ action: "emojiList", accountId: accountId !== null && accountId !== void 0 ? accountId : undefined }, cfg)];
                    case 17: return [2 /*return*/, _c.sent()];
                    case 18: throw new Error("Action ".concat(action, " is not supported for provider ").concat(providerId, "."));
                }
            });
        }); },
    };
}
