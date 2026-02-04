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
exports.loadSessions = loadSessions;
exports.patchSession = patchSession;
exports.deleteSession = deleteSession;
var format_1 = require("../format");
function loadSessions(state, overrides) {
    return __awaiter(this, void 0, void 0, function () {
        var includeGlobal, includeUnknown, activeMinutes, limit, params, res, err_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.sessionsLoading) {
                        return [2 /*return*/];
                    }
                    state.sessionsLoading = true;
                    state.sessionsError = null;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    includeGlobal = (_a = overrides === null || overrides === void 0 ? void 0 : overrides.includeGlobal) !== null && _a !== void 0 ? _a : state.sessionsIncludeGlobal;
                    includeUnknown = (_b = overrides === null || overrides === void 0 ? void 0 : overrides.includeUnknown) !== null && _b !== void 0 ? _b : state.sessionsIncludeUnknown;
                    activeMinutes = (_c = overrides === null || overrides === void 0 ? void 0 : overrides.activeMinutes) !== null && _c !== void 0 ? _c : (0, format_1.toNumber)(state.sessionsFilterActive, 0);
                    limit = (_d = overrides === null || overrides === void 0 ? void 0 : overrides.limit) !== null && _d !== void 0 ? _d : (0, format_1.toNumber)(state.sessionsFilterLimit, 0);
                    params = {
                        includeGlobal: includeGlobal,
                        includeUnknown: includeUnknown,
                    };
                    if (activeMinutes > 0) {
                        params.activeMinutes = activeMinutes;
                    }
                    if (limit > 0) {
                        params.limit = limit;
                    }
                    return [4 /*yield*/, state.client.request("sessions.list", params)];
                case 2:
                    res = _e.sent();
                    if (res) {
                        state.sessionsResult = res;
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _e.sent();
                    state.sessionsError = String(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    state.sessionsLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function patchSession(state, key, patch) {
    return __awaiter(this, void 0, void 0, function () {
        var params, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    params = { key: key };
                    if ("label" in patch) {
                        params.label = patch.label;
                    }
                    if ("thinkingLevel" in patch) {
                        params.thinkingLevel = patch.thinkingLevel;
                    }
                    if ("verboseLevel" in patch) {
                        params.verboseLevel = patch.verboseLevel;
                    }
                    if ("reasoningLevel" in patch) {
                        params.reasoningLevel = patch.reasoningLevel;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, state.client.request("sessions.patch", params)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadSessions(state)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    state.sessionsError = String(err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteSession(state, key) {
    return __awaiter(this, void 0, void 0, function () {
        var confirmed, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.sessionsLoading) {
                        return [2 /*return*/];
                    }
                    confirmed = window.confirm("Delete session \"".concat(key, "\"?\n\nDeletes the session entry and archives its transcript."));
                    if (!confirmed) {
                        return [2 /*return*/];
                    }
                    state.sessionsLoading = true;
                    state.sessionsError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, state.client.request("sessions.delete", { key: key, deleteTranscript: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadSessions(state)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _a.sent();
                    state.sessionsError = String(err_3);
                    return [3 /*break*/, 6];
                case 5:
                    state.sessionsLoading = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
