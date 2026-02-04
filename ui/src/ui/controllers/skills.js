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
exports.loadSkills = loadSkills;
exports.updateSkillEdit = updateSkillEdit;
exports.updateSkillEnabled = updateSkillEnabled;
exports.saveSkillApiKey = saveSkillApiKey;
exports.installSkill = installSkill;
function setSkillMessage(state, key, message) {
    if (!key.trim()) {
        return;
    }
    var next = __assign({}, state.skillMessages);
    if (message) {
        next[key] = message;
    }
    else {
        delete next[key];
    }
    state.skillMessages = next;
}
function getErrorMessage(err) {
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}
function loadSkills(state, options) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((options === null || options === void 0 ? void 0 : options.clearMessages) && Object.keys(state.skillMessages).length > 0) {
                        state.skillMessages = {};
                    }
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.skillsLoading) {
                        return [2 /*return*/];
                    }
                    state.skillsLoading = true;
                    state.skillsError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, state.client.request("skills.status", {})];
                case 2:
                    res = _a.sent();
                    if (res) {
                        state.skillsReport = res;
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    state.skillsError = getErrorMessage(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    state.skillsLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateSkillEdit(state, skillKey, value) {
    var _a;
    state.skillEdits = __assign(__assign({}, state.skillEdits), (_a = {}, _a[skillKey] = value, _a));
}
function updateSkillEnabled(state, skillKey, enabled) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    state.skillsBusyKey = skillKey;
                    state.skillsError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, state.client.request("skills.update", { skillKey: skillKey, enabled: enabled })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadSkills(state)];
                case 3:
                    _a.sent();
                    setSkillMessage(state, skillKey, {
                        kind: "success",
                        message: enabled ? "Skill enabled" : "Skill disabled",
                    });
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _a.sent();
                    message = getErrorMessage(err_2);
                    state.skillsError = message;
                    setSkillMessage(state, skillKey, {
                        kind: "error",
                        message: message,
                    });
                    return [3 /*break*/, 6];
                case 5:
                    state.skillsBusyKey = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function saveSkillApiKey(state, skillKey) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, err_3, message;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    state.skillsBusyKey = skillKey;
                    state.skillsError = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    apiKey = (_a = state.skillEdits[skillKey]) !== null && _a !== void 0 ? _a : "";
                    return [4 /*yield*/, state.client.request("skills.update", { skillKey: skillKey, apiKey: apiKey })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, loadSkills(state)];
                case 3:
                    _b.sent();
                    setSkillMessage(state, skillKey, {
                        kind: "success",
                        message: "API key saved",
                    });
                    return [3 /*break*/, 6];
                case 4:
                    err_3 = _b.sent();
                    message = getErrorMessage(err_3);
                    state.skillsError = message;
                    setSkillMessage(state, skillKey, {
                        kind: "error",
                        message: message,
                    });
                    return [3 /*break*/, 6];
                case 5:
                    state.skillsBusyKey = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function installSkill(state, skillKey, name, installId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_4, message;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    state.skillsBusyKey = skillKey;
                    state.skillsError = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, state.client.request("skills.install", {
                            name: name,
                            installId: installId,
                            timeoutMs: 120000,
                        })];
                case 2:
                    result = _b.sent();
                    return [4 /*yield*/, loadSkills(state)];
                case 3:
                    _b.sent();
                    setSkillMessage(state, skillKey, {
                        kind: "success",
                        message: (_a = result === null || result === void 0 ? void 0 : result.message) !== null && _a !== void 0 ? _a : "Installed",
                    });
                    return [3 /*break*/, 6];
                case 4:
                    err_4 = _b.sent();
                    message = getErrorMessage(err_4);
                    state.skillsError = message;
                    setSkillMessage(state, skillKey, {
                        kind: "error",
                        message: message,
                    });
                    return [3 /*break*/, 6];
                case 5:
                    state.skillsBusyKey = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
