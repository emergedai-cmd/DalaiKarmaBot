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
exports.cronHandlers = void 0;
var normalize_js_1 = require("../../cron/normalize.js");
var run_log_js_1 = require("../../cron/run-log.js");
var index_js_1 = require("../protocol/index.js");
exports.cronHandlers = {
    wake: function (_a) {
        var params = _a.params, respond = _a.respond, context = _a.context;
        if (!(0, index_js_1.validateWakeParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid wake params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateWakeParams.errors))));
            return;
        }
        var p = params;
        var result = context.cron.wake({ mode: p.mode, text: p.text });
        respond(true, result, undefined);
    },
    "cron.list": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, jobs;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateCronListParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.list params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronListParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    return [4 /*yield*/, context.cron.list({
                            includeDisabled: p.includeDisabled,
                        })];
                case 1:
                    jobs = _c.sent();
                    respond(true, { jobs: jobs }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.status": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var status;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateCronStatusParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.status params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronStatusParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.cron.status()];
                case 1:
                    status = _c.sent();
                    respond(true, status, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.add": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var normalized, job;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    normalized = (_c = (0, normalize_js_1.normalizeCronJobCreate)(params)) !== null && _c !== void 0 ? _c : params;
                    if (!(0, index_js_1.validateCronAddParams)(normalized)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.add params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronAddParams.errors))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.cron.add(normalized)];
                case 1:
                    job = _d.sent();
                    respond(true, job, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.update": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var normalizedPatch, candidate, p, jobId, job;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    normalizedPatch = (0, normalize_js_1.normalizeCronJobPatch)(params === null || params === void 0 ? void 0 : params.patch);
                    candidate = normalizedPatch && typeof params === "object" && params !== null
                        ? __assign(__assign({}, params), { patch: normalizedPatch }) : params;
                    if (!(0, index_js_1.validateCronUpdateParams)(candidate)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.update params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronUpdateParams.errors))));
                        return [2 /*return*/];
                    }
                    p = candidate;
                    jobId = (_c = p.id) !== null && _c !== void 0 ? _c : p.jobId;
                    if (!jobId) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.update params: missing id"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.cron.update(jobId, p.patch)];
                case 1:
                    job = _d.sent();
                    respond(true, job, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.remove": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, jobId, result;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateCronRemoveParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.remove params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronRemoveParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    jobId = (_c = p.id) !== null && _c !== void 0 ? _c : p.jobId;
                    if (!jobId) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.remove params: missing id"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.cron.remove(jobId)];
                case 1:
                    result = _d.sent();
                    respond(true, result, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.run": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, jobId, result;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateCronRunParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.run params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronRunParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    jobId = (_c = p.id) !== null && _c !== void 0 ? _c : p.jobId;
                    if (!jobId) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.run params: missing id"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.cron.run(jobId, p.mode)];
                case 1:
                    result = _d.sent();
                    respond(true, result, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
    "cron.runs": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, jobId, logPath, entries;
        var _c;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateCronRunsParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.runs params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateCronRunsParams.errors))));
                        return [2 /*return*/];
                    }
                    p = params;
                    jobId = (_c = p.id) !== null && _c !== void 0 ? _c : p.jobId;
                    if (!jobId) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid cron.runs params: missing id"));
                        return [2 /*return*/];
                    }
                    logPath = (0, run_log_js_1.resolveCronRunLogPath)({
                        storePath: context.cronStorePath,
                        jobId: jobId,
                    });
                    return [4 /*yield*/, (0, run_log_js_1.readCronRunLogEntries)(logPath, {
                            limit: p.limit,
                            jobId: jobId,
                        })];
                case 1:
                    entries = _d.sent();
                    respond(true, { entries: entries }, undefined);
                    return [2 /*return*/];
            }
        });
    }); },
};
