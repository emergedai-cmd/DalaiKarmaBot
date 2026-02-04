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
exports.updateHandlers = void 0;
var openclaw_root_js_1 = require("../../infra/openclaw-root.js");
var restart_sentinel_js_1 = require("../../infra/restart-sentinel.js");
var restart_js_1 = require("../../infra/restart.js");
var update_runner_js_1 = require("../../infra/update-runner.js");
var index_js_1 = require("../protocol/index.js");
exports.updateHandlers = {
    "update.run": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var sessionKey, note, restartDelayMsRaw, restartDelayMs, timeoutMsRaw, timeoutMs, result, root, err_1, payload, sentinelPath, _c, restart;
        var _d, _e, _f, _g, _h, _j, _k;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!(0, index_js_1.validateUpdateRunParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid update.run params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateUpdateRunParams.errors))));
                        return [2 /*return*/];
                    }
                    sessionKey = typeof params.sessionKey === "string"
                        ? ((_d = params.sessionKey) === null || _d === void 0 ? void 0 : _d.trim()) || undefined
                        : undefined;
                    note = typeof params.note === "string"
                        ? ((_e = params.note) === null || _e === void 0 ? void 0 : _e.trim()) || undefined
                        : undefined;
                    restartDelayMsRaw = params.restartDelayMs;
                    restartDelayMs = typeof restartDelayMsRaw === "number" && Number.isFinite(restartDelayMsRaw)
                        ? Math.max(0, Math.floor(restartDelayMsRaw))
                        : undefined;
                    timeoutMsRaw = params.timeoutMs;
                    timeoutMs = typeof timeoutMsRaw === "number" && Number.isFinite(timeoutMsRaw)
                        ? Math.max(1000, Math.floor(timeoutMsRaw))
                        : undefined;
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                            moduleUrl: import.meta.url,
                            argv1: process.argv[1],
                            cwd: process.cwd(),
                        })];
                case 2:
                    root = (_f = (_l.sent())) !== null && _f !== void 0 ? _f : process.cwd();
                    return [4 /*yield*/, (0, update_runner_js_1.runGatewayUpdate)({
                            timeoutMs: timeoutMs,
                            cwd: root,
                            argv1: process.argv[1],
                        })];
                case 3:
                    result = _l.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _l.sent();
                    result = {
                        status: "error",
                        mode: "unknown",
                        reason: String(err_1),
                        steps: [],
                        durationMs: 0,
                    };
                    return [3 /*break*/, 5];
                case 5:
                    payload = {
                        kind: "update",
                        status: result.status,
                        ts: Date.now(),
                        sessionKey: sessionKey,
                        message: note !== null && note !== void 0 ? note : null,
                        doctorHint: (0, restart_sentinel_js_1.formatDoctorNonInteractiveHint)(),
                        stats: {
                            mode: result.mode,
                            root: (_g = result.root) !== null && _g !== void 0 ? _g : undefined,
                            before: (_h = result.before) !== null && _h !== void 0 ? _h : null,
                            after: (_j = result.after) !== null && _j !== void 0 ? _j : null,
                            steps: result.steps.map(function (step) {
                                var _a, _b, _c;
                                return ({
                                    name: step.name,
                                    command: step.command,
                                    cwd: step.cwd,
                                    durationMs: step.durationMs,
                                    log: {
                                        stdoutTail: (_a = step.stdoutTail) !== null && _a !== void 0 ? _a : null,
                                        stderrTail: (_b = step.stderrTail) !== null && _b !== void 0 ? _b : null,
                                        exitCode: (_c = step.exitCode) !== null && _c !== void 0 ? _c : null,
                                    },
                                });
                            }),
                            reason: (_k = result.reason) !== null && _k !== void 0 ? _k : null,
                            durationMs: result.durationMs,
                        },
                    };
                    sentinelPath = null;
                    _l.label = 6;
                case 6:
                    _l.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, restart_sentinel_js_1.writeRestartSentinel)(payload)];
                case 7:
                    sentinelPath = _l.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _c = _l.sent();
                    sentinelPath = null;
                    return [3 /*break*/, 9];
                case 9:
                    restart = (0, restart_js_1.scheduleGatewaySigusr1Restart)({
                        delayMs: restartDelayMs,
                        reason: "update.run",
                    });
                    respond(true, {
                        ok: true,
                        result: result,
                        restart: restart,
                        sentinel: {
                            path: sentinelPath,
                            payload: payload,
                        },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
