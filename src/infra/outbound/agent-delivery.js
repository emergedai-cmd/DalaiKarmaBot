"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAgentDeliveryPlan = resolveAgentDeliveryPlan;
exports.resolveAgentOutboundTarget = resolveAgentOutboundTarget;
var registry_js_1 = require("../../channels/registry.js");
var account_id_js_1 = require("../../utils/account-id.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var targets_js_1 = require("./targets.js");
function resolveAgentDeliveryPlan(params) {
    var _a;
    var requestedRaw = typeof params.requestedChannel === "string" ? params.requestedChannel.trim() : "";
    var normalizedRequested = requestedRaw ? (0, message_channel_js_1.normalizeMessageChannel)(requestedRaw) : undefined;
    var requestedChannel = normalizedRequested || "last";
    var explicitTo = typeof params.explicitTo === "string" && params.explicitTo.trim()
        ? params.explicitTo.trim()
        : undefined;
    var baseDelivery = (0, targets_js_1.resolveSessionDeliveryTarget)({
        entry: params.sessionEntry,
        requestedChannel: requestedChannel === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL ? "last" : requestedChannel,
        explicitTo: explicitTo,
        explicitThreadId: params.explicitThreadId,
    });
    var resolvedChannel = (function () {
        if (requestedChannel === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
            return message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
        }
        if (requestedChannel === "last") {
            if (baseDelivery.channel && baseDelivery.channel !== message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
                return baseDelivery.channel;
            }
            return params.wantsDelivery ? registry_js_1.DEFAULT_CHAT_CHANNEL : message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
        }
        if ((0, message_channel_js_1.isGatewayMessageChannel)(requestedChannel)) {
            return requestedChannel;
        }
        if (baseDelivery.channel && baseDelivery.channel !== message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
            return baseDelivery.channel;
        }
        return params.wantsDelivery ? registry_js_1.DEFAULT_CHAT_CHANNEL : message_channel_js_1.INTERNAL_MESSAGE_CHANNEL;
    })();
    var deliveryTargetMode = explicitTo
        ? "explicit"
        : (0, message_channel_js_1.isDeliverableMessageChannel)(resolvedChannel)
            ? "implicit"
            : undefined;
    var resolvedAccountId = (_a = (0, account_id_js_1.normalizeAccountId)(params.accountId)) !== null && _a !== void 0 ? _a : (deliveryTargetMode === "implicit" ? baseDelivery.accountId : undefined);
    var resolvedTo = explicitTo;
    if (!resolvedTo &&
        (0, message_channel_js_1.isDeliverableMessageChannel)(resolvedChannel) &&
        resolvedChannel === baseDelivery.lastChannel) {
        resolvedTo = baseDelivery.lastTo;
    }
    return {
        baseDelivery: baseDelivery,
        resolvedChannel: resolvedChannel,
        resolvedTo: resolvedTo,
        resolvedAccountId: resolvedAccountId,
        resolvedThreadId: baseDelivery.threadId,
        deliveryTargetMode: deliveryTargetMode,
    };
}
function resolveAgentOutboundTarget(params) {
    var _a, _b;
    var targetMode = (_b = (_a = params.targetMode) !== null && _a !== void 0 ? _a : params.plan.deliveryTargetMode) !== null && _b !== void 0 ? _b : (params.plan.resolvedTo ? "explicit" : "implicit");
    if (!(0, message_channel_js_1.isDeliverableMessageChannel)(params.plan.resolvedChannel)) {
        return {
            resolvedTarget: null,
            resolvedTo: params.plan.resolvedTo,
            targetMode: targetMode,
        };
    }
    if (params.validateExplicitTarget !== true && params.plan.resolvedTo) {
        return {
            resolvedTarget: null,
            resolvedTo: params.plan.resolvedTo,
            targetMode: targetMode,
        };
    }
    var resolvedTarget = (0, targets_js_1.resolveOutboundTarget)({
        channel: params.plan.resolvedChannel,
        to: params.plan.resolvedTo,
        cfg: params.cfg,
        accountId: params.plan.resolvedAccountId,
        mode: targetMode,
    });
    return {
        resolvedTarget: resolvedTarget,
        resolvedTo: resolvedTarget.ok ? resolvedTarget.to : params.plan.resolvedTo,
        targetMode: targetMode,
    };
}
