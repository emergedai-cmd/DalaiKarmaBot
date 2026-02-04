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
exports.createGatewayHooksRequestHandler = createGatewayHooksRequestHandler;
var node_crypto_1 = require("node:crypto");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var isolated_agent_js_1 = require("../../cron/isolated-agent.js");
var heartbeat_wake_js_1 = require("../../infra/heartbeat-wake.js");
var system_events_js_1 = require("../../infra/system-events.js");
var server_http_js_1 = require("../server-http.js");
function createGatewayHooksRequestHandler(params) {
    var _this = this;
    var deps = params.deps, getHooksConfig = params.getHooksConfig, bindHost = params.bindHost, port = params.port, logHooks = params.logHooks;
    var dispatchWakeHook = function (value) {
        var sessionKey = (0, sessions_js_1.resolveMainSessionKeyFromConfig)();
        (0, system_events_js_1.enqueueSystemEvent)(value.text, { sessionKey: sessionKey });
        if (value.mode === "now") {
            (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "hook:wake" });
        }
    };
    var dispatchAgentHook = function (value) {
        var sessionKey = value.sessionKey.trim() ? value.sessionKey.trim() : "hook:".concat((0, node_crypto_1.randomUUID)());
        var mainSessionKey = (0, sessions_js_1.resolveMainSessionKeyFromConfig)();
        var jobId = (0, node_crypto_1.randomUUID)();
        var now = Date.now();
        var job = {
            id: jobId,
            name: value.name,
            enabled: true,
            createdAtMs: now,
            updatedAtMs: now,
            schedule: { kind: "at", atMs: now },
            sessionTarget: "isolated",
            wakeMode: value.wakeMode,
            payload: {
                kind: "agentTurn",
                message: value.message,
                model: value.model,
                thinking: value.thinking,
                timeoutSeconds: value.timeoutSeconds,
                deliver: value.deliver,
                channel: value.channel,
                to: value.to,
                allowUnsafeExternalContent: value.allowUnsafeExternalContent,
            },
            state: { nextRunAtMs: now },
        };
        var runId = (0, node_crypto_1.randomUUID)();
        void (function () { return __awaiter(_this, void 0, void 0, function () {
            var cfg, result, summary, prefix, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        cfg = (0, config_js_1.loadConfig)();
                        return [4 /*yield*/, (0, isolated_agent_js_1.runCronIsolatedAgentTurn)({
                                cfg: cfg,
                                deps: deps,
                                job: job,
                                message: value.message,
                                sessionKey: sessionKey,
                                lane: "cron",
                            })];
                    case 1:
                        result = _c.sent();
                        summary = ((_a = result.summary) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = result.error) === null || _b === void 0 ? void 0 : _b.trim()) || result.status;
                        prefix = result.status === "ok" ? "Hook ".concat(value.name) : "Hook ".concat(value.name, " (").concat(result.status, ")");
                        (0, system_events_js_1.enqueueSystemEvent)("".concat(prefix, ": ").concat(summary).trim(), {
                            sessionKey: mainSessionKey,
                        });
                        if (value.wakeMode === "now") {
                            (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "hook:".concat(jobId) });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _c.sent();
                        logHooks.warn("hook agent failed: ".concat(String(err_1)));
                        (0, system_events_js_1.enqueueSystemEvent)("Hook ".concat(value.name, " (error): ").concat(String(err_1)), {
                            sessionKey: mainSessionKey,
                        });
                        if (value.wakeMode === "now") {
                            (0, heartbeat_wake_js_1.requestHeartbeatNow)({ reason: "hook:".concat(jobId, ":error") });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return runId;
    };
    return (0, server_http_js_1.createHooksRequestHandler)({
        getHooksConfig: getHooksConfig,
        bindHost: bindHost,
        port: port,
        logHooks: logHooks,
        dispatchAgentHook: dispatchAgentHook,
        dispatchWakeHook: dispatchWakeHook,
    });
}
