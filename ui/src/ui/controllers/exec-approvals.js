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
exports.loadExecApprovals = loadExecApprovals;
exports.applyExecApprovalsSnapshot = applyExecApprovalsSnapshot;
exports.saveExecApprovals = saveExecApprovals;
exports.updateExecApprovalsFormValue = updateExecApprovalsFormValue;
exports.removeExecApprovalsFormValue = removeExecApprovalsFormValue;
var form_utils_1 = require("./config/form-utils");
function resolveExecApprovalsRpc(target) {
    if (!target || target.kind === "gateway") {
        return { method: "exec.approvals.get", params: {} };
    }
    var nodeId = target.nodeId.trim();
    if (!nodeId) {
        return null;
    }
    return { method: "exec.approvals.node.get", params: { nodeId: nodeId } };
}
function resolveExecApprovalsSaveRpc(target, params) {
    if (!target || target.kind === "gateway") {
        return { method: "exec.approvals.set", params: params };
    }
    var nodeId = target.nodeId.trim();
    if (!nodeId) {
        return null;
    }
    return { method: "exec.approvals.node.set", params: __assign(__assign({}, params), { nodeId: nodeId }) };
}
function loadExecApprovals(state, target) {
    return __awaiter(this, void 0, void 0, function () {
        var rpc, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    if (state.execApprovalsLoading) {
                        return [2 /*return*/];
                    }
                    state.execApprovalsLoading = true;
                    state.lastError = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    rpc = resolveExecApprovalsRpc(target);
                    if (!rpc) {
                        state.lastError = "Select a node before loading exec approvals.";
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, state.client.request(rpc.method, rpc.params)];
                case 2:
                    res = _a.sent();
                    applyExecApprovalsSnapshot(state, res);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    state.lastError = String(err_1);
                    return [3 /*break*/, 5];
                case 4:
                    state.execApprovalsLoading = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function applyExecApprovalsSnapshot(state, snapshot) {
    var _a;
    state.execApprovalsSnapshot = snapshot;
    if (!state.execApprovalsDirty) {
        state.execApprovalsForm = (0, form_utils_1.cloneConfigObject)((_a = snapshot.file) !== null && _a !== void 0 ? _a : {});
    }
}
function saveExecApprovals(state, target) {
    return __awaiter(this, void 0, void 0, function () {
        var baseHash, file, rpc, err_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!state.client || !state.connected) {
                        return [2 /*return*/];
                    }
                    state.execApprovalsSaving = true;
                    state.lastError = null;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, 5, 6]);
                    baseHash = (_a = state.execApprovalsSnapshot) === null || _a === void 0 ? void 0 : _a.hash;
                    if (!baseHash) {
                        state.lastError = "Exec approvals hash missing; reload and retry.";
                        return [2 /*return*/];
                    }
                    file = (_d = (_b = state.execApprovalsForm) !== null && _b !== void 0 ? _b : (_c = state.execApprovalsSnapshot) === null || _c === void 0 ? void 0 : _c.file) !== null && _d !== void 0 ? _d : {};
                    rpc = resolveExecApprovalsSaveRpc(target, { file: file, baseHash: baseHash });
                    if (!rpc) {
                        state.lastError = "Select a node before saving exec approvals.";
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, state.client.request(rpc.method, rpc.params)];
                case 2:
                    _e.sent();
                    state.execApprovalsDirty = false;
                    return [4 /*yield*/, loadExecApprovals(state, target)];
                case 3:
                    _e.sent();
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _e.sent();
                    state.lastError = String(err_2);
                    return [3 /*break*/, 6];
                case 5:
                    state.execApprovalsSaving = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function updateExecApprovalsFormValue(state, path, value) {
    var _a, _b, _c;
    var base = (0, form_utils_1.cloneConfigObject)((_c = (_a = state.execApprovalsForm) !== null && _a !== void 0 ? _a : (_b = state.execApprovalsSnapshot) === null || _b === void 0 ? void 0 : _b.file) !== null && _c !== void 0 ? _c : {});
    (0, form_utils_1.setPathValue)(base, path, value);
    state.execApprovalsForm = base;
    state.execApprovalsDirty = true;
}
function removeExecApprovalsFormValue(state, path) {
    var _a, _b, _c;
    var base = (0, form_utils_1.cloneConfigObject)((_c = (_a = state.execApprovalsForm) !== null && _a !== void 0 ? _a : (_b = state.execApprovalsSnapshot) === null || _b === void 0 ? void 0 : _b.file) !== null && _c !== void 0 ? _c : {});
    (0, form_utils_1.removePathValue)(base, path);
    state.execApprovalsForm = base;
    state.execApprovalsDirty = true;
}
