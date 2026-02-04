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
exports.processEvent = processEvent;
var node_crypto_1 = require("node:crypto");
var lookup_js_1 = require("./lookup.js");
var outbound_js_1 = require("./outbound.js");
var state_js_1 = require("./state.js");
var store_js_1 = require("./store.js");
var timers_js_1 = require("./timers.js");
function shouldAcceptInbound(config, from) {
    var policy = config.inboundPolicy, allowFrom = config.allowFrom;
    switch (policy) {
        case "disabled":
            console.log("[voice-call] Inbound call rejected: policy is disabled");
            return false;
        case "open":
            console.log("[voice-call] Inbound call accepted: policy is open");
            return true;
        case "allowlist":
        case "pairing": {
            var normalized_1 = (from === null || from === void 0 ? void 0 : from.replace(/\D/g, "")) || "";
            var allowed = (allowFrom || []).some(function (num) {
                var normalizedAllow = num.replace(/\D/g, "");
                return normalized_1.endsWith(normalizedAllow) || normalizedAllow.endsWith(normalized_1);
            });
            var status_1 = allowed ? "accepted" : "rejected";
            console.log("[voice-call] Inbound call ".concat(status_1, ": ").concat(from, " ").concat(allowed ? "is in" : "not in", " allowlist"));
            return allowed;
        }
        default:
            return false;
    }
}
function createInboundCall(params) {
    var _a;
    var callId = node_crypto_1.default.randomUUID();
    var callRecord = {
        callId: callId,
        providerCallId: params.providerCallId,
        provider: ((_a = params.ctx.provider) === null || _a === void 0 ? void 0 : _a.name) || "twilio",
        direction: "inbound",
        state: "ringing",
        from: params.from,
        to: params.to,
        startedAt: Date.now(),
        transcript: [],
        processedEventIds: [],
        metadata: {
            initialMessage: params.ctx.config.inboundGreeting || "Hello! How can I help you today?",
        },
    };
    params.ctx.activeCalls.set(callId, callRecord);
    params.ctx.providerCallIdMap.set(params.providerCallId, callId);
    (0, store_js_1.persistCallRecord)(params.ctx.storePath, callRecord);
    console.log("[voice-call] Created inbound call record: ".concat(callId, " from ").concat(params.from));
    return callRecord;
}
function processEvent(ctx, event) {
    var _this = this;
    if (ctx.processedEventIds.has(event.id)) {
        return;
    }
    ctx.processedEventIds.add(event.id);
    var call = (0, lookup_js_1.findCall)({
        activeCalls: ctx.activeCalls,
        providerCallIdMap: ctx.providerCallIdMap,
        callIdOrProviderCallId: event.callId,
    });
    if (!call && event.direction === "inbound" && event.providerCallId) {
        if (!shouldAcceptInbound(ctx.config, event.from)) {
            // TODO: Could hang up the call here.
            return;
        }
        call = createInboundCall({
            ctx: ctx,
            providerCallId: event.providerCallId,
            from: event.from || "unknown",
            to: event.to || ctx.config.fromNumber || "unknown",
        });
        // Normalize event to internal ID for downstream consumers.
        event.callId = call.callId;
    }
    if (!call) {
        return;
    }
    if (event.providerCallId && !call.providerCallId) {
        call.providerCallId = event.providerCallId;
        ctx.providerCallIdMap.set(event.providerCallId, call.callId);
    }
    call.processedEventIds.push(event.id);
    switch (event.type) {
        case "call.initiated":
            (0, state_js_1.transitionState)(call, "initiated");
            break;
        case "call.ringing":
            (0, state_js_1.transitionState)(call, "ringing");
            break;
        case "call.answered":
            call.answeredAt = event.timestamp;
            (0, state_js_1.transitionState)(call, "answered");
            (0, timers_js_1.startMaxDurationTimer)({
                ctx: ctx,
                callId: call.callId,
                onTimeout: function (callId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, outbound_js_1.endCall)(ctx, callId)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
            });
            break;
        case "call.active":
            (0, state_js_1.transitionState)(call, "active");
            break;
        case "call.speaking":
            (0, state_js_1.transitionState)(call, "speaking");
            break;
        case "call.speech":
            if (event.isFinal) {
                (0, state_js_1.addTranscriptEntry)(call, "user", event.transcript);
                (0, timers_js_1.resolveTranscriptWaiter)(ctx, call.callId, event.transcript);
            }
            (0, state_js_1.transitionState)(call, "listening");
            break;
        case "call.ended":
            call.endedAt = event.timestamp;
            call.endReason = event.reason;
            (0, state_js_1.transitionState)(call, event.reason);
            (0, timers_js_1.clearMaxDurationTimer)(ctx, call.callId);
            (0, timers_js_1.rejectTranscriptWaiter)(ctx, call.callId, "Call ended: ".concat(event.reason));
            ctx.activeCalls.delete(call.callId);
            if (call.providerCallId) {
                ctx.providerCallIdMap.delete(call.providerCallId);
            }
            break;
        case "call.error":
            if (!event.retryable) {
                call.endedAt = event.timestamp;
                call.endReason = "error";
                (0, state_js_1.transitionState)(call, "error");
                (0, timers_js_1.clearMaxDurationTimer)(ctx, call.callId);
                (0, timers_js_1.rejectTranscriptWaiter)(ctx, call.callId, "Call error: ".concat(event.error));
                ctx.activeCalls.delete(call.callId);
                if (call.providerCallId) {
                    ctx.providerCallIdMap.delete(call.providerCallId);
                }
            }
            break;
    }
    (0, store_js_1.persistCallRecord)(ctx.storePath, call);
}
