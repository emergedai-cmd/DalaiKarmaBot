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
exports.loadCronStatus = loadCronStatus;
exports.loadCronJobs = loadCronJobs;
exports.buildCronSchedule = buildCronSchedule;
exports.buildCronPayload = buildCronPayload;
exports.addCronJob = addCronJob;
exports.toggleCronJob = toggleCronJob;
exports.runCronJob = runCronJob;
exports.removeCronJob = removeCronJob;
exports.loadCronRuns = loadCronRuns;
var format_1 = require("../format");
function loadCronStatus(state) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, state.client.request("cron.status", {})];
                case 2:
                    res = _a.sent();
                    state.cronStatus = res;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    state.cronError = String(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadCronJobs(state) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.cronLoading) {
                        return [2 /*return*/];
                    }
                    state.cronLoading = true;
                    state.cronError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("cron.list", {
                            includeDisabled: true,
                        })];
                case 2:
                    res = _a.sent();
                    state.cronJobs = Array.isArray(res.jobs) ? res.jobs : [];
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    state.cronError = String(err_2);
                    return [3 /*break*/, 5];
                case 4:
                    state.cronLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function buildCronSchedule(form) {
    if (form.scheduleKind === "at") {
        var ms = Date.parse(form.scheduleAt);
        if (!Number.isFinite(ms)) {
            throw new Error("Invalid run time.");
        }
        return { kind: "at", atMs: ms };
    }
    if (form.scheduleKind === "every") {
        var amount = (0, format_1.toNumber)(form.everyAmount, 0);
        if (amount <= 0) {
            throw new Error("Invalid interval amount.");
        }
        var unit = form.everyUnit;
        var mult = unit === "minutes" ? 60000 : unit === "hours" ? 3600000 : 86400000;
        return { kind: "every", everyMs: amount * mult };
    }
    var expr = form.cronExpr.trim();
    if (!expr) {
        throw new Error("Cron expression required.");
    }
    return { kind: "cron", expr: expr, tz: form.cronTz.trim() || undefined };
}
function buildCronPayload(form) {
    if (form.payloadKind === "systemEvent") {
        var text = form.payloadText.trim();
        if (!text) {
            throw new Error("System event text required.");
        }
        return { kind: "systemEvent", text: text };
    }
    var message = form.payloadText.trim();
    if (!message) {
        throw new Error("Agent message required.");
    }
    var payload = { kind: "agentTurn", message: message };
    if (form.deliver) {
        payload.deliver = true;
    }
    if (form.channel) {
        payload.channel = form.channel;
    }
    if (form.to.trim()) {
        payload.to = form.to.trim();
    }
    var timeoutSeconds = (0, format_1.toNumber)(form.timeoutSeconds, 0);
    if (timeoutSeconds > 0) {
        payload.timeoutSeconds = timeoutSeconds;
    }
    return payload;
}
function addCronJob(state) {
    return __awaiter(this, void 0, void 0, function () {
        var schedule, payload, agentId, job, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected || state.cronBusy) {
                        return [2 /*return*/];
                    }
                    state.cronBusy = true;
                    state.cronError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    schedule = buildCronSchedule(state.cronForm);
                    payload = buildCronPayload(state.cronForm);
                    agentId = state.cronForm.agentId.trim();
                    job = {
                        name: state.cronForm.name.trim(),
                        description: state.cronForm.description.trim() || undefined,
                        agentId: agentId || undefined,
                        enabled: state.cronForm.enabled,
                        schedule: schedule,
                        sessionTarget: state.cronForm.sessionTarget,
                        wakeMode: state.cronForm.wakeMode,
                        payload: payload,
                        isolation: state.cronForm.postToMainPrefix.trim() && state.cronForm.sessionTarget === "isolated"
                            ? { postToMainPrefix: state.cronForm.postToMainPrefix.trim() }
                            : undefined,
                    };
                    if (!job.name) {
                        throw new Error("Name required.");
                    }
                    return [4 /*yield*/, state.client.request("cron.add", job)];
                case 2:
                    _a.sent();
                    state.cronForm = __assign(__assign({}, state.cronForm), { name: "", description: "", payloadText: "" });
                    return [4 /*yield*/, loadCronJobs(state)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loadCronStatus(state)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    err_3 = _a.sent();
                    state.cronError = String(err_3);
                    return [3 /*break*/, 7];
                case 6:
                    state.cronBusy = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function toggleCronJob(state, job, enabled) {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected || state.cronBusy) {
                        return [2 /*return*/];
                    }
                    state.cronBusy = true;
                    state.cronError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, state.client.request("cron.update", { id: job.id, patch: { enabled: enabled } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadCronJobs(state)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loadCronStatus(state)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    err_4 = _a.sent();
                    state.cronError = String(err_4);
                    return [3 /*break*/, 7];
                case 6:
                    state.cronBusy = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function runCronJob(state, job) {
    return __awaiter(this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected || state.cronBusy) {
                        return [2 /*return*/];
                    }
                    state.cronBusy = true;
                    state.cronError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, state.client.request("cron.run", { id: job.id, mode: "force" })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadCronRuns(state, job.id)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_5 = _a.sent();
                    state.cronError = String(err_5);
                    return [3 /*break*/, 6];
                case 5:
                    state.cronBusy = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function removeCronJob(state, job) {
    return __awaiter(this, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected || state.cronBusy) {
                        return [2 /*return*/];
                    }
                    state.cronBusy = true;
                    state.cronError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, state.client.request("cron.remove", { id: job.id })];
                case 2:
                    _a.sent();
                    if (state.cronRunsJobId === job.id) {
                        state.cronRunsJobId = null;
                        state.cronRuns = [];
                    }
                    return [4 /*yield*/, loadCronJobs(state)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loadCronStatus(state)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    err_6 = _a.sent();
                    state.cronError = String(err_6);
                    return [3 /*break*/, 7];
                case 6:
                    state.cronBusy = false;
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function loadCronRuns(state, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, state.client.request("cron.runs", {
                            id: jobId,
                            limit: 50,
                        })];
                case 2:
                    res = _a.sent();
                    state.cronRunsJobId = jobId;
                    state.cronRuns = Array.isArray(res.entries) ? res.entries : [];
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    state.cronError = String(err_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
