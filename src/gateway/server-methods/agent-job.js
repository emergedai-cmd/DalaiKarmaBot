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
exports.waitForAgentJob = waitForAgentJob;
var agent_events_js_1 = require("../../infra/agent-events.js");
var AGENT_RUN_CACHE_TTL_MS = 10 * 60000;
var agentRunCache = new Map();
var agentRunStarts = new Map();
var agentRunListenerStarted = false;
function pruneAgentRunCache(now) {
    if (now === void 0) { now = Date.now(); }
    for (var _i = 0, agentRunCache_1 = agentRunCache; _i < agentRunCache_1.length; _i++) {
        var _a = agentRunCache_1[_i], runId = _a[0], entry = _a[1];
        if (now - entry.ts > AGENT_RUN_CACHE_TTL_MS) {
            agentRunCache.delete(runId);
        }
    }
}
function recordAgentRunSnapshot(entry) {
    pruneAgentRunCache(entry.ts);
    agentRunCache.set(entry.runId, entry);
}
function ensureAgentRunListener() {
    if (agentRunListenerStarted) {
        return;
    }
    agentRunListenerStarted = true;
    (0, agent_events_js_1.onAgentEvent)(function (evt) {
        var _a, _b, _c, _d, _e;
        if (!evt) {
            return;
        }
        if (evt.stream !== "lifecycle") {
            return;
        }
        var phase = (_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase;
        if (phase === "start") {
            var startedAt_1 = typeof ((_b = evt.data) === null || _b === void 0 ? void 0 : _b.startedAt) === "number" ? evt.data.startedAt : undefined;
            agentRunStarts.set(evt.runId, startedAt_1 !== null && startedAt_1 !== void 0 ? startedAt_1 : Date.now());
            return;
        }
        if (phase !== "end" && phase !== "error") {
            return;
        }
        var startedAt = typeof ((_c = evt.data) === null || _c === void 0 ? void 0 : _c.startedAt) === "number" ? evt.data.startedAt : agentRunStarts.get(evt.runId);
        var endedAt = typeof ((_d = evt.data) === null || _d === void 0 ? void 0 : _d.endedAt) === "number" ? evt.data.endedAt : undefined;
        var error = typeof ((_e = evt.data) === null || _e === void 0 ? void 0 : _e.error) === "string" ? evt.data.error : undefined;
        agentRunStarts.delete(evt.runId);
        recordAgentRunSnapshot({
            runId: evt.runId,
            status: phase === "error" ? "error" : "ok",
            startedAt: startedAt,
            endedAt: endedAt,
            error: error,
            ts: Date.now(),
        });
    });
}
function getCachedAgentRun(runId) {
    pruneAgentRunCache();
    return agentRunCache.get(runId);
}
function waitForAgentJob(params) {
    return __awaiter(this, void 0, void 0, function () {
        var runId, timeoutMs, cached;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    runId = params.runId, timeoutMs = params.timeoutMs;
                    ensureAgentRunListener();
                    cached = getCachedAgentRun(runId);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    if (timeoutMs <= 0) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var settled = false;
                            var finish = function (entry) {
                                if (settled) {
                                    return;
                                }
                                settled = true;
                                clearTimeout(timer);
                                unsubscribe();
                                resolve(entry);
                            };
                            var unsubscribe = (0, agent_events_js_1.onAgentEvent)(function (evt) {
                                var _a, _b, _c, _d;
                                if (!evt || evt.stream !== "lifecycle") {
                                    return;
                                }
                                if (evt.runId !== runId) {
                                    return;
                                }
                                var phase = (_a = evt.data) === null || _a === void 0 ? void 0 : _a.phase;
                                if (phase !== "end" && phase !== "error") {
                                    return;
                                }
                                var cached = getCachedAgentRun(runId);
                                if (cached) {
                                    finish(cached);
                                    return;
                                }
                                var startedAt = typeof ((_b = evt.data) === null || _b === void 0 ? void 0 : _b.startedAt) === "number"
                                    ? evt.data.startedAt
                                    : agentRunStarts.get(evt.runId);
                                var endedAt = typeof ((_c = evt.data) === null || _c === void 0 ? void 0 : _c.endedAt) === "number" ? evt.data.endedAt : undefined;
                                var error = typeof ((_d = evt.data) === null || _d === void 0 ? void 0 : _d.error) === "string" ? evt.data.error : undefined;
                                var snapshot = {
                                    runId: evt.runId,
                                    status: phase === "error" ? "error" : "ok",
                                    startedAt: startedAt,
                                    endedAt: endedAt,
                                    error: error,
                                    ts: Date.now(),
                                };
                                recordAgentRunSnapshot(snapshot);
                                finish(snapshot);
                            });
                            var timer = setTimeout(function () { return finish(null); }, Math.max(1, timeoutMs));
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
ensureAgentRunListener();
