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
exports.deliverAgentCommandResult = deliverAgentCommandResult;
var lanes_js_1 = require("../../agents/lanes.js");
var index_js_1 = require("../../channels/plugins/index.js");
var outbound_send_deps_js_1 = require("../../cli/outbound-send-deps.js");
var agent_delivery_js_1 = require("../../infra/outbound/agent-delivery.js");
var deliver_js_1 = require("../../infra/outbound/deliver.js");
var envelope_js_1 = require("../../infra/outbound/envelope.js");
var payloads_js_1 = require("../../infra/outbound/payloads.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var NESTED_LOG_PREFIX = "[agent:nested]";
function formatNestedLogPrefix(opts) {
    var _a, _b;
    var parts = [NESTED_LOG_PREFIX];
    var session = (_a = opts.sessionKey) !== null && _a !== void 0 ? _a : opts.sessionId;
    if (session) {
        parts.push("session=".concat(session));
    }
    if (opts.runId) {
        parts.push("run=".concat(opts.runId));
    }
    var channel = (_b = opts.messageChannel) !== null && _b !== void 0 ? _b : opts.channel;
    if (channel) {
        parts.push("channel=".concat(channel));
    }
    if (opts.to) {
        parts.push("to=".concat(opts.to));
    }
    if (opts.accountId) {
        parts.push("account=".concat(opts.accountId));
    }
    return parts.join(" ");
}
function logNestedOutput(runtime, opts, output) {
    var prefix = formatNestedLogPrefix(opts);
    for (var _i = 0, _a = output.split(/\r?\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        if (!line) {
            continue;
        }
        runtime.log("".concat(prefix, " ").concat(line));
    }
}
function deliverAgentCommandResult(params) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, deps, runtime, opts, sessionEntry, payloads, result, deliver, bestEffortDeliver, deliveryPlan, deliveryChannel, deliveryPlugin, isDeliveryChannelKnown, targetMode, resolvedAccountId, resolved, resolvedTarget, deliveryTarget, resolvedThreadId, resolvedReplyToId, resolvedThreadTarget, logDeliveryError, err, normalizedPayloads, deliveryPayloads, logPayload, _i, deliveryPayloads_1, payload;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cfg = params.cfg, deps = params.deps, runtime = params.runtime, opts = params.opts, sessionEntry = params.sessionEntry, payloads = params.payloads, result = params.result;
                    deliver = opts.deliver === true;
                    bestEffortDeliver = opts.bestEffortDeliver === true;
                    deliveryPlan = (0, agent_delivery_js_1.resolveAgentDeliveryPlan)({
                        sessionEntry: sessionEntry,
                        requestedChannel: (_a = opts.replyChannel) !== null && _a !== void 0 ? _a : opts.channel,
                        explicitTo: (_b = opts.replyTo) !== null && _b !== void 0 ? _b : opts.to,
                        explicitThreadId: opts.threadId,
                        accountId: (_c = opts.replyAccountId) !== null && _c !== void 0 ? _c : opts.accountId,
                        wantsDelivery: deliver,
                    });
                    deliveryChannel = deliveryPlan.resolvedChannel;
                    deliveryPlugin = !(0, message_channel_js_1.isInternalMessageChannel)(deliveryChannel)
                        ? (0, index_js_1.getChannelPlugin)((_d = (0, index_js_1.normalizeChannelId)(deliveryChannel)) !== null && _d !== void 0 ? _d : deliveryChannel)
                        : undefined;
                    isDeliveryChannelKnown = (0, message_channel_js_1.isInternalMessageChannel)(deliveryChannel) || Boolean(deliveryPlugin);
                    targetMode = (_f = (_e = opts.deliveryTargetMode) !== null && _e !== void 0 ? _e : deliveryPlan.deliveryTargetMode) !== null && _f !== void 0 ? _f : (opts.to ? "explicit" : "implicit");
                    resolvedAccountId = deliveryPlan.resolvedAccountId;
                    resolved = deliver && isDeliveryChannelKnown && deliveryChannel
                        ? (0, agent_delivery_js_1.resolveAgentOutboundTarget)({
                            cfg: cfg,
                            plan: deliveryPlan,
                            targetMode: targetMode,
                            validateExplicitTarget: true,
                        })
                        : {
                            resolvedTarget: null,
                            resolvedTo: deliveryPlan.resolvedTo,
                            targetMode: targetMode,
                        };
                    resolvedTarget = resolved.resolvedTarget;
                    deliveryTarget = resolved.resolvedTo;
                    resolvedThreadId = (_g = deliveryPlan.resolvedThreadId) !== null && _g !== void 0 ? _g : opts.threadId;
                    resolvedReplyToId = deliveryChannel === "slack" && resolvedThreadId != null ? String(resolvedThreadId) : undefined;
                    resolvedThreadTarget = deliveryChannel === "slack" ? undefined : resolvedThreadId;
                    logDeliveryError = function (err) {
                        var _a;
                        var message = "Delivery failed (".concat(deliveryChannel).concat(deliveryTarget ? " to ".concat(deliveryTarget) : "", "): ").concat(String(err));
                        (_a = runtime.error) === null || _a === void 0 ? void 0 : _a.call(runtime, message);
                        if (!runtime.error) {
                            runtime.log(message);
                        }
                    };
                    if (deliver) {
                        if (!isDeliveryChannelKnown) {
                            err = new Error("Unknown channel: ".concat(deliveryChannel));
                            if (!bestEffortDeliver) {
                                throw err;
                            }
                            logDeliveryError(err);
                        }
                        else if (resolvedTarget && !resolvedTarget.ok) {
                            if (!bestEffortDeliver) {
                                throw resolvedTarget.error;
                            }
                            logDeliveryError(resolvedTarget.error);
                        }
                    }
                    normalizedPayloads = (0, payloads_js_1.normalizeOutboundPayloadsForJson)(payloads !== null && payloads !== void 0 ? payloads : []);
                    if (opts.json) {
                        runtime.log(JSON.stringify((0, envelope_js_1.buildOutboundResultEnvelope)({
                            payloads: normalizedPayloads,
                            meta: result.meta,
                        }), null, 2));
                        if (!deliver) {
                            return [2 /*return*/, { payloads: normalizedPayloads, meta: result.meta }];
                        }
                    }
                    if (!payloads || payloads.length === 0) {
                        runtime.log("No reply from agent.");
                        return [2 /*return*/, { payloads: [], meta: result.meta }];
                    }
                    deliveryPayloads = (0, payloads_js_1.normalizeOutboundPayloads)(payloads);
                    logPayload = function (payload) {
                        if (opts.json) {
                            return;
                        }
                        var output = (0, payloads_js_1.formatOutboundPayloadLog)(payload);
                        if (!output) {
                            return;
                        }
                        if (opts.lane === lanes_js_1.AGENT_LANE_NESTED) {
                            logNestedOutput(runtime, opts, output);
                            return;
                        }
                        runtime.log(output);
                    };
                    if (!deliver) {
                        for (_i = 0, deliveryPayloads_1 = deliveryPayloads; _i < deliveryPayloads_1.length; _i++) {
                            payload = deliveryPayloads_1[_i];
                            logPayload(payload);
                        }
                    }
                    if (!(deliver && deliveryChannel && !(0, message_channel_js_1.isInternalMessageChannel)(deliveryChannel))) return [3 /*break*/, 2];
                    if (!deliveryTarget) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, deliver_js_1.deliverOutboundPayloads)({
                            cfg: cfg,
                            channel: deliveryChannel,
                            to: deliveryTarget,
                            accountId: resolvedAccountId,
                            payloads: deliveryPayloads,
                            replyToId: resolvedReplyToId !== null && resolvedReplyToId !== void 0 ? resolvedReplyToId : null,
                            threadId: resolvedThreadTarget !== null && resolvedThreadTarget !== void 0 ? resolvedThreadTarget : null,
                            bestEffort: bestEffortDeliver,
                            onError: function (err) { return logDeliveryError(err); },
                            onPayload: logPayload,
                            deps: (0, outbound_send_deps_js_1.createOutboundSendDeps)(deps),
                        })];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2: return [2 /*return*/, { payloads: normalizedPayloads, meta: result.meta }];
            }
        });
    });
}
