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
exports.wizardHandlers = void 0;
var node_crypto_1 = require("node:crypto");
var runtime_js_1 = require("../../runtime.js");
var session_js_1 = require("../../wizard/session.js");
var index_js_1 = require("../protocol/index.js");
var ws_log_js_1 = require("../ws-log.js");
exports.wizardHandlers = {
    "wizard.start": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var running, sessionId, opts, session, result;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateWizardStartParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid wizard.start params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateWizardStartParams.errors))));
                        return [2 /*return*/];
                    }
                    running = context.findRunningWizard();
                    if (running) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "wizard already running"));
                        return [2 /*return*/];
                    }
                    sessionId = (0, node_crypto_1.randomUUID)();
                    opts = {
                        mode: params.mode,
                        workspace: typeof params.workspace === "string" ? params.workspace : undefined,
                    };
                    session = new session_js_1.WizardSession(function (prompter) {
                        return context.wizardRunner(opts, runtime_js_1.defaultRuntime, prompter);
                    });
                    context.wizardSessions.set(sessionId, session);
                    return [4 /*yield*/, session.next()];
                case 1:
                    result = _c.sent();
                    if (result.done) {
                        context.purgeWizardSession(sessionId);
                    }
                    respond(true, __assign({ sessionId: sessionId }, result), undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "wizard.next": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var sessionId, session, answer, err_1, result;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateWizardNextParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid wizard.next params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateWizardNextParams.errors))));
                        return [2 /*return*/];
                    }
                    sessionId = params.sessionId;
                    session = context.wizardSessions.get(sessionId);
                    if (!session) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "wizard not found"));
                        return [2 /*return*/];
                    }
                    answer = params.answer;
                    if (!answer) return [3 /*break*/, 4];
                    if (session.getStatus() !== "running") {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "wizard not running"));
                        return [2 /*return*/];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, session.answer(String((_c = answer.stepId) !== null && _c !== void 0 ? _c : ""), answer.value)];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, (0, ws_log_js_1.formatForLog)(err_1)));
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, session.next()];
                case 5:
                    result = _d.sent();
                    if (result.done) {
                        context.purgeWizardSession(sessionId);
                    }
                    respond(true, result, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "wizard.cancel": function (_a) {
        var params = _a.params, respond = _a.respond, context = _a.context;
        if (!(0, index_js_1.validateWizardCancelParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid wizard.cancel params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateWizardCancelParams.errors))));
            return;
        }
        var sessionId = params.sessionId;
        var session = context.wizardSessions.get(sessionId);
        if (!session) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "wizard not found"));
            return;
        }
        session.cancel();
        var status = {
            status: session.getStatus(),
            error: session.getError(),
        };
        context.wizardSessions.delete(sessionId);
        respond(true, status, undefined);
    },
    "wizard.status": function (_a) {
        var params = _a.params, respond = _a.respond, context = _a.context;
        if (!(0, index_js_1.validateWizardStatusParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid wizard.status params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateWizardStatusParams.errors))));
            return;
        }
        var sessionId = params.sessionId;
        var session = context.wizardSessions.get(sessionId);
        if (!session) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "wizard not found"));
            return;
        }
        var status = {
            status: session.getStatus(),
            error: session.getError(),
        };
        if (status.status !== "running") {
            context.wizardSessions.delete(sessionId);
        }
        respond(true, status, undefined);
    },
};
