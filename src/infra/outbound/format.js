"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutboundDeliverySummary = formatOutboundDeliverySummary;
exports.buildOutboundDeliveryJson = buildOutboundDeliveryJson;
exports.formatGatewaySummary = formatGatewaySummary;
var index_js_1 = require("../../channels/plugins/index.js");
var registry_js_1 = require("../../channels/registry.js");
var resolveChannelLabel = function (channel) {
    var _a;
    var pluginLabel = (_a = (0, index_js_1.getChannelPlugin)(channel)) === null || _a === void 0 ? void 0 : _a.meta.label;
    if (pluginLabel) {
        return pluginLabel;
    }
    var normalized = (0, registry_js_1.normalizeChatChannelId)(channel);
    if (normalized) {
        return (0, registry_js_1.getChatChannelMeta)(normalized).label;
    }
    return channel;
};
function formatOutboundDeliverySummary(channel, result) {
    if (!result) {
        return "\u2705 Sent via ".concat(resolveChannelLabel(channel), ". Message ID: unknown");
    }
    var label = resolveChannelLabel(result.channel);
    var base = "\u2705 Sent via ".concat(label, ". Message ID: ").concat(result.messageId);
    if ("chatId" in result) {
        return "".concat(base, " (chat ").concat(result.chatId, ")");
    }
    if ("channelId" in result) {
        return "".concat(base, " (channel ").concat(result.channelId, ")");
    }
    if ("roomId" in result) {
        return "".concat(base, " (room ").concat(result.roomId, ")");
    }
    if ("conversationId" in result) {
        return "".concat(base, " (conversation ").concat(result.conversationId, ")");
    }
    return base;
}
function buildOutboundDeliveryJson(params) {
    var _a, _b, _c;
    var channel = params.channel, to = params.to, result = params.result;
    var messageId = (_a = result === null || result === void 0 ? void 0 : result.messageId) !== null && _a !== void 0 ? _a : "unknown";
    var payload = {
        channel: channel,
        via: (_b = params.via) !== null && _b !== void 0 ? _b : "direct",
        to: to,
        messageId: messageId,
        mediaUrl: (_c = params.mediaUrl) !== null && _c !== void 0 ? _c : null,
    };
    if (result && "chatId" in result && result.chatId !== undefined) {
        payload.chatId = result.chatId;
    }
    if (result && "channelId" in result && result.channelId !== undefined) {
        payload.channelId = result.channelId;
    }
    if (result && "roomId" in result && result.roomId !== undefined) {
        payload.roomId = result.roomId;
    }
    if (result && "conversationId" in result && result.conversationId !== undefined) {
        payload.conversationId = result.conversationId;
    }
    if (result && "timestamp" in result && result.timestamp !== undefined) {
        payload.timestamp = result.timestamp;
    }
    if (result && "toJid" in result && result.toJid !== undefined) {
        payload.toJid = result.toJid;
    }
    if (result && "meta" in result && result.meta !== undefined) {
        payload.meta = result.meta;
    }
    return payload;
}
function formatGatewaySummary(params) {
    var _a, _b;
    var action = (_a = params.action) !== null && _a !== void 0 ? _a : "Sent";
    var channelSuffix = params.channel ? " (".concat(params.channel, ")") : "";
    var messageId = (_b = params.messageId) !== null && _b !== void 0 ? _b : "unknown";
    return "\u2705 ".concat(action, " via gateway").concat(channelSuffix, ". Message ID: ").concat(messageId);
}
