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
exports.clearMaxDurationTimer = clearMaxDurationTimer;
exports.startMaxDurationTimer = startMaxDurationTimer;
exports.clearTranscriptWaiter = clearTranscriptWaiter;
exports.rejectTranscriptWaiter = rejectTranscriptWaiter;
exports.resolveTranscriptWaiter = resolveTranscriptWaiter;
exports.waitForFinalTranscript = waitForFinalTranscript;
var types_js_1 = require("../types.js");
var store_js_1 = require("./store.js");
function clearMaxDurationTimer(ctx, callId) {
    var timer = ctx.maxDurationTimers.get(callId);
    if (timer) {
        clearTimeout(timer);
        ctx.maxDurationTimers.delete(callId);
    }
}
function startMaxDurationTimer(params) {
    var _this = this;
    clearMaxDurationTimer(params.ctx, params.callId);
    var maxDurationMs = params.ctx.config.maxDurationSeconds * 1000;
    console.log("[voice-call] Starting max duration timer (".concat(params.ctx.config.maxDurationSeconds, "s) for call ").concat(params.callId));
    var timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var call;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params.ctx.maxDurationTimers.delete(params.callId);
                    call = params.ctx.activeCalls.get(params.callId);
                    if (!(call && !types_js_1.TerminalStates.has(call.state))) return [3 /*break*/, 2];
                    console.log("[voice-call] Max duration reached (".concat(params.ctx.config.maxDurationSeconds, "s), ending call ").concat(params.callId));
                    call.endReason = "timeout";
                    (0, store_js_1.persistCallRecord)(params.ctx.storePath, call);
                    return [4 /*yield*/, params.onTimeout(params.callId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, maxDurationMs);
    params.ctx.maxDurationTimers.set(params.callId, timer);
}
function clearTranscriptWaiter(ctx, callId) {
    var waiter = ctx.transcriptWaiters.get(callId);
    if (!waiter) {
        return;
    }
    clearTimeout(waiter.timeout);
    ctx.transcriptWaiters.delete(callId);
}
function rejectTranscriptWaiter(ctx, callId, reason) {
    var waiter = ctx.transcriptWaiters.get(callId);
    if (!waiter) {
        return;
    }
    clearTranscriptWaiter(ctx, callId);
    waiter.reject(new Error(reason));
}
function resolveTranscriptWaiter(ctx, callId, transcript) {
    var waiter = ctx.transcriptWaiters.get(callId);
    if (!waiter) {
        return;
    }
    clearTranscriptWaiter(ctx, callId);
    waiter.resolve(transcript);
}
function waitForFinalTranscript(ctx, callId) {
    // Only allow one in-flight waiter per call.
    rejectTranscriptWaiter(ctx, callId, "Transcript waiter replaced");
    var timeoutMs = ctx.config.transcriptTimeoutMs;
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
            ctx.transcriptWaiters.delete(callId);
            reject(new Error("Timed out waiting for transcript after ".concat(timeoutMs, "ms")));
        }, timeoutMs);
        ctx.transcriptWaiters.set(callId, { resolve: resolve, reject: reject, timeout: timeout });
    });
}
