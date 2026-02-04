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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentRunContext = resolveAgentRunContext;
var account_id_js_1 = require("../../utils/account-id.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
function resolveAgentRunContext(opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var merged = opts.runContext ? __assign({}, opts.runContext) : {};
    var normalizedChannel = (0, message_channel_js_1.resolveMessageChannel)((_a = merged.messageChannel) !== null && _a !== void 0 ? _a : opts.messageChannel, (_b = opts.replyChannel) !== null && _b !== void 0 ? _b : opts.channel);
    if (normalizedChannel) {
        merged.messageChannel = normalizedChannel;
    }
    var normalizedAccountId = (0, account_id_js_1.normalizeAccountId)((_c = merged.accountId) !== null && _c !== void 0 ? _c : opts.accountId);
    if (normalizedAccountId) {
        merged.accountId = normalizedAccountId;
    }
    var groupId = (_e = ((_d = merged.groupId) !== null && _d !== void 0 ? _d : opts.groupId)) === null || _e === void 0 ? void 0 : _e.toString().trim();
    if (groupId) {
        merged.groupId = groupId;
    }
    var groupChannel = (_g = ((_f = merged.groupChannel) !== null && _f !== void 0 ? _f : opts.groupChannel)) === null || _g === void 0 ? void 0 : _g.toString().trim();
    if (groupChannel) {
        merged.groupChannel = groupChannel;
    }
    var groupSpace = (_j = ((_h = merged.groupSpace) !== null && _h !== void 0 ? _h : opts.groupSpace)) === null || _j === void 0 ? void 0 : _j.toString().trim();
    if (groupSpace) {
        merged.groupSpace = groupSpace;
    }
    if (merged.currentThreadTs == null &&
        opts.threadId != null &&
        opts.threadId !== "" &&
        opts.threadId !== null) {
        merged.currentThreadTs = String(opts.threadId);
    }
    return merged;
}
