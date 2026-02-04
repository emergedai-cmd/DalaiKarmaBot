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
exports.execApprovalsHandlers = void 0;
var exec_approvals_js_1 = require("../../infra/exec-approvals.js");
var index_js_1 = require("../protocol/index.js");
var nodes_helpers_js_1 = require("./nodes.helpers.js");
function resolveBaseHash(params) {
    var raw = params === null || params === void 0 ? void 0 : params.baseHash;
    if (typeof raw !== "string") {
        return null;
    }
    var trimmed = raw.trim();
    return trimmed ? trimmed : null;
}
function requireApprovalsBaseHash(params, snapshot, respond) {
    if (!snapshot.exists) {
        return true;
    }
    if (!snapshot.hash) {
        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "exec approvals base hash unavailable; re-run exec.approvals.get and retry"));
        return false;
    }
    var baseHash = resolveBaseHash(params);
    if (!baseHash) {
        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "exec approvals base hash required; re-run exec.approvals.get and retry"));
        return false;
    }
    if (baseHash !== snapshot.hash) {
        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "exec approvals changed since last load; re-run exec.approvals.get and retry"));
        return false;
    }
    return true;
}
function redactExecApprovals(file) {
    var _a, _b;
    var socketPath = (_b = (_a = file.socket) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.trim();
    return __assign(__assign({}, file), { socket: socketPath ? { path: socketPath } : undefined });
}
exports.execApprovalsHandlers = {
    "exec.approvals.get": function (_a) {
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateExecApprovalsGetParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approvals.get params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalsGetParams.errors))));
            return;
        }
        (0, exec_approvals_js_1.ensureExecApprovals)();
        var snapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
        respond(true, {
            path: snapshot.path,
            exists: snapshot.exists,
            hash: snapshot.hash,
            file: redactExecApprovals(snapshot.file),
        }, undefined);
    },
    "exec.approvals.set": function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var params = _a.params, respond = _a.respond;
        if (!(0, index_js_1.validateExecApprovalsSetParams)(params)) {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approvals.set params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalsSetParams.errors))));
            return;
        }
        (0, exec_approvals_js_1.ensureExecApprovals)();
        var snapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
        if (!requireApprovalsBaseHash(params, snapshot, respond)) {
            return;
        }
        var incoming = params.file;
        if (!incoming || typeof incoming !== "object") {
            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "exec approvals file is required"));
            return;
        }
        var normalized = (0, exec_approvals_js_1.normalizeExecApprovals)(incoming);
        var currentSocketPath = (_c = (_b = snapshot.file.socket) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.trim();
        var currentToken = (_e = (_d = snapshot.file.socket) === null || _d === void 0 ? void 0 : _d.token) === null || _e === void 0 ? void 0 : _e.trim();
        var socketPath = (_j = (_h = (_g = (_f = normalized.socket) === null || _f === void 0 ? void 0 : _f.path) === null || _g === void 0 ? void 0 : _g.trim()) !== null && _h !== void 0 ? _h : currentSocketPath) !== null && _j !== void 0 ? _j : (0, exec_approvals_js_1.resolveExecApprovalsSocketPath)();
        var token = (_o = (_m = (_l = (_k = normalized.socket) === null || _k === void 0 ? void 0 : _k.token) === null || _l === void 0 ? void 0 : _l.trim()) !== null && _m !== void 0 ? _m : currentToken) !== null && _o !== void 0 ? _o : "";
        var next = __assign(__assign({}, normalized), { socket: {
                path: socketPath,
                token: token,
            } });
        (0, exec_approvals_js_1.saveExecApprovals)(next);
        var nextSnapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
        respond(true, {
            path: nextSnapshot.path,
            exists: nextSnapshot.exists,
            hash: nextSnapshot.hash,
            file: redactExecApprovals(nextSnapshot.file),
        }, undefined);
    },
    "exec.approvals.node.get": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var nodeId, id;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateExecApprovalsNodeGetParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approvals.node.get params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalsNodeGetParams.errors))));
                        return [2 /*return*/];
                    }
                    nodeId = params.nodeId;
                    id = nodeId.trim();
                    if (!id) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "nodeId required"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, payload;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, context.nodeRegistry.invoke({
                                            nodeId: id,
                                            command: "system.execApprovals.get",
                                            params: {},
                                        })];
                                    case 1:
                                        res = _d.sent();
                                        if (!res.ok) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "node invoke failed", {
                                                details: { nodeError: (_c = res.error) !== null && _c !== void 0 ? _c : null },
                                            }));
                                            return [2 /*return*/];
                                        }
                                        payload = res.payloadJSON ? (0, nodes_helpers_js_1.safeParseJson)(res.payloadJSON) : res.payload;
                                        respond(true, payload, undefined);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    "exec.approvals.node.set": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, nodeId, file, baseHash, id;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateExecApprovalsNodeSetParams)(params)) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "invalid exec.approvals.node.set params: ".concat((0, index_js_1.formatValidationErrors)(index_js_1.validateExecApprovalsNodeSetParams.errors))));
                        return [2 /*return*/];
                    }
                    _c = params, nodeId = _c.nodeId, file = _c.file, baseHash = _c.baseHash;
                    id = nodeId.trim();
                    if (!id) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "nodeId required"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var res, payload;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, context.nodeRegistry.invoke({
                                            nodeId: id,
                                            command: "system.execApprovals.set",
                                            params: { file: file, baseHash: baseHash },
                                        })];
                                    case 1:
                                        res = _e.sent();
                                        if (!res.ok) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "node invoke failed", {
                                                details: { nodeError: (_c = res.error) !== null && _c !== void 0 ? _c : null },
                                            }));
                                            return [2 /*return*/];
                                        }
                                        payload = (0, nodes_helpers_js_1.safeParseJson)((_d = res.payloadJSON) !== null && _d !== void 0 ? _d : null);
                                        respond(true, payload, undefined);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); },
};
