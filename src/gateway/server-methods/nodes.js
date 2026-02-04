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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeHandlers = void 0;
var config_js_1 = require("../../config/config.js");
var device_pairing_js_1 = require("../../infra/device-pairing.js");
var node_pairing_js_1 = require("../../infra/node-pairing.js");
var node_command_policy_js_1 = require("../node-command-policy.js");
var index_js_1 = require("../protocol/index.js");
var nodes_helpers_js_1 = require("./nodes.helpers.js");
function isNodeEntry(entry) {
    if (entry.role === "node") {
        return true;
    }
    if (Array.isArray(entry.roles) && entry.roles.includes("node")) {
        return true;
    }
    return false;
}
function normalizeNodeInvokeResultParams(params) {
    if (!params || typeof params !== "object") {
        return params;
    }
    var raw = params;
    var normalized = __assign({}, raw);
    if (normalized.payloadJSON === null) {
        delete normalized.payloadJSON;
    }
    else if (normalized.payloadJSON !== undefined && typeof normalized.payloadJSON !== "string") {
        if (normalized.payload === undefined) {
            normalized.payload = normalized.payloadJSON;
        }
        delete normalized.payloadJSON;
    }
    if (normalized.error === null) {
        delete normalized.error;
    }
    return normalized;
}
exports.nodeHandlers = {
    "node.pair.request": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodePairRequestParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.pair.request",
                            validator: index_js_1.validateNodePairRequestParams,
                        });
                        return [2 /*return*/];
                    }
                    p = params;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, node_pairing_js_1.requestNodePairing)({
                                            nodeId: p.nodeId,
                                            displayName: p.displayName,
                                            platform: p.platform,
                                            version: p.version,
                                            coreVersion: p.coreVersion,
                                            uiVersion: p.uiVersion,
                                            deviceFamily: p.deviceFamily,
                                            modelIdentifier: p.modelIdentifier,
                                            caps: p.caps,
                                            commands: p.commands,
                                            remoteIp: p.remoteIp,
                                            silent: p.silent,
                                        })];
                                    case 1:
                                        result = _a.sent();
                                        if (result.status === "pending" && result.created) {
                                            context.broadcast("node.pair.requested", result.request, {
                                                dropIfSlow: true,
                                            });
                                        }
                                        respond(true, result, undefined);
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
    "node.pair.list": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodePairListParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.pair.list",
                            validator: index_js_1.validateNodePairListParams,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var list;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, node_pairing_js_1.listNodePairing)()];
                                    case 1:
                                        list = _a.sent();
                                        respond(true, list, undefined);
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
    "node.pair.approve": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var requestId;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodePairApproveParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.pair.approve",
                            validator: index_js_1.validateNodePairApproveParams,
                        });
                        return [2 /*return*/];
                    }
                    requestId = params.requestId;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var approved;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, node_pairing_js_1.approveNodePairing)(requestId)];
                                    case 1:
                                        approved = _a.sent();
                                        if (!approved) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown requestId"));
                                            return [2 /*return*/];
                                        }
                                        context.broadcast("node.pair.resolved", {
                                            requestId: requestId,
                                            nodeId: approved.node.nodeId,
                                            decision: "approved",
                                            ts: Date.now(),
                                        }, { dropIfSlow: true });
                                        respond(true, approved, undefined);
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
    "node.pair.reject": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var requestId;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodePairRejectParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.pair.reject",
                            validator: index_js_1.validateNodePairRejectParams,
                        });
                        return [2 /*return*/];
                    }
                    requestId = params.requestId;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var rejected;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, node_pairing_js_1.rejectNodePairing)(requestId)];
                                    case 1:
                                        rejected = _a.sent();
                                        if (!rejected) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown requestId"));
                                            return [2 /*return*/];
                                        }
                                        context.broadcast("node.pair.resolved", {
                                            requestId: requestId,
                                            nodeId: rejected.nodeId,
                                            decision: "rejected",
                                            ts: Date.now(),
                                        }, { dropIfSlow: true });
                                        respond(true, rejected, undefined);
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
    "node.pair.verify": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, nodeId, token;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateNodePairVerifyParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.pair.verify",
                            validator: index_js_1.validateNodePairVerifyParams,
                        });
                        return [2 /*return*/];
                    }
                    _c = params, nodeId = _c.nodeId, token = _c.token;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, node_pairing_js_1.verifyNodeToken)(nodeId, token)];
                                    case 1:
                                        result = _a.sent();
                                        respond(true, result, undefined);
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
    "node.rename": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, nodeId, displayName;
        var params = _b.params, respond = _b.respond;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, index_js_1.validateNodeRenameParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.rename",
                            validator: index_js_1.validateNodeRenameParams,
                        });
                        return [2 /*return*/];
                    }
                    _c = params, nodeId = _c.nodeId, displayName = _c.displayName;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var trimmed, updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        trimmed = displayName.trim();
                                        if (!trimmed) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "displayName required"));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, (0, node_pairing_js_1.renamePairedNode)(nodeId, trimmed)];
                                    case 1:
                                        updated = _a.sent();
                                        if (!updated) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
                                            return [2 /*return*/];
                                        }
                                        respond(true, { nodeId: updated.nodeId, displayName: updated.displayName }, undefined);
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
    "node.list": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodeListParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.list",
                            validator: index_js_1.validateNodeListParams,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var list, pairedById, connected, connectedById, nodeIds, nodes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, device_pairing_js_1.listDevicePairing)()];
                                    case 1:
                                        list = _a.sent();
                                        pairedById = new Map(list.paired
                                            .filter(function (entry) { return isNodeEntry(entry); })
                                            .map(function (entry) { return [
                                            entry.deviceId,
                                            {
                                                nodeId: entry.deviceId,
                                                displayName: entry.displayName,
                                                platform: entry.platform,
                                                version: undefined,
                                                coreVersion: undefined,
                                                uiVersion: undefined,
                                                deviceFamily: undefined,
                                                modelIdentifier: undefined,
                                                remoteIp: entry.remoteIp,
                                                caps: [],
                                                commands: [],
                                                permissions: undefined,
                                            },
                                        ]; }));
                                        connected = context.nodeRegistry.listConnected();
                                        connectedById = new Map(connected.map(function (n) { return [n.nodeId, n]; }));
                                        nodeIds = new Set(__spreadArray(__spreadArray([], pairedById.keys(), true), connectedById.keys(), true));
                                        nodes = __spreadArray([], nodeIds, true).map(function (nodeId) {
                                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                                            var paired = pairedById.get(nodeId);
                                            var live = connectedById.get(nodeId);
                                            var caps = (0, nodes_helpers_js_1.uniqueSortedStrings)(__spreadArray([], ((_b = (_a = live === null || live === void 0 ? void 0 : live.caps) !== null && _a !== void 0 ? _a : paired === null || paired === void 0 ? void 0 : paired.caps) !== null && _b !== void 0 ? _b : []), true));
                                            var commands = (0, nodes_helpers_js_1.uniqueSortedStrings)(__spreadArray([], ((_d = (_c = live === null || live === void 0 ? void 0 : live.commands) !== null && _c !== void 0 ? _c : paired === null || paired === void 0 ? void 0 : paired.commands) !== null && _d !== void 0 ? _d : []), true));
                                            return {
                                                nodeId: nodeId,
                                                displayName: (_e = live === null || live === void 0 ? void 0 : live.displayName) !== null && _e !== void 0 ? _e : paired === null || paired === void 0 ? void 0 : paired.displayName,
                                                platform: (_f = live === null || live === void 0 ? void 0 : live.platform) !== null && _f !== void 0 ? _f : paired === null || paired === void 0 ? void 0 : paired.platform,
                                                version: (_g = live === null || live === void 0 ? void 0 : live.version) !== null && _g !== void 0 ? _g : paired === null || paired === void 0 ? void 0 : paired.version,
                                                coreVersion: (_h = live === null || live === void 0 ? void 0 : live.coreVersion) !== null && _h !== void 0 ? _h : paired === null || paired === void 0 ? void 0 : paired.coreVersion,
                                                uiVersion: (_j = live === null || live === void 0 ? void 0 : live.uiVersion) !== null && _j !== void 0 ? _j : paired === null || paired === void 0 ? void 0 : paired.uiVersion,
                                                deviceFamily: (_k = live === null || live === void 0 ? void 0 : live.deviceFamily) !== null && _k !== void 0 ? _k : paired === null || paired === void 0 ? void 0 : paired.deviceFamily,
                                                modelIdentifier: (_l = live === null || live === void 0 ? void 0 : live.modelIdentifier) !== null && _l !== void 0 ? _l : paired === null || paired === void 0 ? void 0 : paired.modelIdentifier,
                                                remoteIp: (_m = live === null || live === void 0 ? void 0 : live.remoteIp) !== null && _m !== void 0 ? _m : paired === null || paired === void 0 ? void 0 : paired.remoteIp,
                                                caps: caps,
                                                commands: commands,
                                                pathEnv: live === null || live === void 0 ? void 0 : live.pathEnv,
                                                permissions: (_o = live === null || live === void 0 ? void 0 : live.permissions) !== null && _o !== void 0 ? _o : paired === null || paired === void 0 ? void 0 : paired.permissions,
                                                connectedAtMs: live === null || live === void 0 ? void 0 : live.connectedAtMs,
                                                paired: Boolean(paired),
                                                connected: Boolean(live),
                                            };
                                        });
                                        nodes.sort(function (a, b) {
                                            var _a, _b;
                                            if (a.connected !== b.connected) {
                                                return a.connected ? -1 : 1;
                                            }
                                            var an = ((_a = a.displayName) !== null && _a !== void 0 ? _a : a.nodeId).toLowerCase();
                                            var bn = ((_b = b.displayName) !== null && _b !== void 0 ? _b : b.nodeId).toLowerCase();
                                            if (an < bn) {
                                                return -1;
                                            }
                                            if (an > bn) {
                                                return 1;
                                            }
                                            return a.nodeId.localeCompare(b.nodeId);
                                        });
                                        respond(true, { ts: Date.now(), nodes: nodes }, undefined);
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
    "node.describe": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var nodeId, id;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodeDescribeParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.describe",
                            validator: index_js_1.validateNodeDescribeParams,
                        });
                        return [2 /*return*/];
                    }
                    nodeId = params.nodeId;
                    id = String(nodeId !== null && nodeId !== void 0 ? nodeId : "").trim();
                    if (!id) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "nodeId required"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var list, paired, connected, live, caps, commands;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, (0, device_pairing_js_1.listDevicePairing)()];
                                    case 1:
                                        list = _f.sent();
                                        paired = list.paired.find(function (n) { return n.deviceId === id && isNodeEntry(n); });
                                        connected = context.nodeRegistry.listConnected();
                                        live = connected.find(function (n) { return n.nodeId === id; });
                                        if (!paired && !live) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "unknown nodeId"));
                                            return [2 /*return*/];
                                        }
                                        caps = (0, nodes_helpers_js_1.uniqueSortedStrings)(__spreadArray([], ((_a = live === null || live === void 0 ? void 0 : live.caps) !== null && _a !== void 0 ? _a : []), true));
                                        commands = (0, nodes_helpers_js_1.uniqueSortedStrings)(__spreadArray([], ((_b = live === null || live === void 0 ? void 0 : live.commands) !== null && _b !== void 0 ? _b : []), true));
                                        respond(true, {
                                            ts: Date.now(),
                                            nodeId: id,
                                            displayName: (_c = live === null || live === void 0 ? void 0 : live.displayName) !== null && _c !== void 0 ? _c : paired === null || paired === void 0 ? void 0 : paired.displayName,
                                            platform: (_d = live === null || live === void 0 ? void 0 : live.platform) !== null && _d !== void 0 ? _d : paired === null || paired === void 0 ? void 0 : paired.platform,
                                            version: live === null || live === void 0 ? void 0 : live.version,
                                            coreVersion: live === null || live === void 0 ? void 0 : live.coreVersion,
                                            uiVersion: live === null || live === void 0 ? void 0 : live.uiVersion,
                                            deviceFamily: live === null || live === void 0 ? void 0 : live.deviceFamily,
                                            modelIdentifier: live === null || live === void 0 ? void 0 : live.modelIdentifier,
                                            remoteIp: (_e = live === null || live === void 0 ? void 0 : live.remoteIp) !== null && _e !== void 0 ? _e : paired === null || paired === void 0 ? void 0 : paired.remoteIp,
                                            caps: caps,
                                            commands: commands,
                                            pathEnv: live === null || live === void 0 ? void 0 : live.pathEnv,
                                            permissions: live === null || live === void 0 ? void 0 : live.permissions,
                                            connectedAtMs: live === null || live === void 0 ? void 0 : live.connectedAtMs,
                                            paired: Boolean(paired),
                                            connected: Boolean(live),
                                        }, undefined);
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
    "node.invoke": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, nodeId, command;
        var _c, _d;
        var params = _b.params, respond = _b.respond, context = _b.context;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(0, index_js_1.validateNodeInvokeParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.invoke",
                            validator: index_js_1.validateNodeInvokeParams,
                        });
                        return [2 /*return*/];
                    }
                    p = params;
                    nodeId = String((_c = p.nodeId) !== null && _c !== void 0 ? _c : "").trim();
                    command = String((_d = p.command) !== null && _d !== void 0 ? _d : "").trim();
                    if (!nodeId || !command) {
                        respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "nodeId and command required"));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var nodeSession, cfg, allowlist, allowed, res, payload;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        nodeSession = context.nodeRegistry.get(nodeId);
                                        if (!nodeSession) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, "node not connected", {
                                                details: { code: "NOT_CONNECTED" },
                                            }));
                                            return [2 /*return*/];
                                        }
                                        cfg = (0, config_js_1.loadConfig)();
                                        allowlist = (0, node_command_policy_js_1.resolveNodeCommandAllowlist)(cfg, nodeSession);
                                        allowed = (0, node_command_policy_js_1.isNodeCommandAllowed)({
                                            command: command,
                                            declaredCommands: nodeSession.commands,
                                            allowlist: allowlist,
                                        });
                                        if (!allowed.ok) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "node command not allowed", {
                                                details: { reason: allowed.reason, command: command },
                                            }));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, context.nodeRegistry.invoke({
                                                nodeId: nodeId,
                                                command: command,
                                                params: p.params,
                                                timeoutMs: p.timeoutMs,
                                                idempotencyKey: p.idempotencyKey,
                                            })];
                                    case 1:
                                        res = _e.sent();
                                        if (!res.ok) {
                                            respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.UNAVAILABLE, (_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "node invoke failed", {
                                                details: { nodeError: (_c = res.error) !== null && _c !== void 0 ? _c : null },
                                            }));
                                            return [2 /*return*/];
                                        }
                                        payload = res.payloadJSON ? (0, nodes_helpers_js_1.safeParseJson)(res.payloadJSON) : res.payload;
                                        respond(true, {
                                            ok: true,
                                            nodeId: nodeId,
                                            command: command,
                                            payload: payload,
                                            payloadJSON: (_d = res.payloadJSON) !== null && _d !== void 0 ? _d : null,
                                        }, undefined);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    "node.invoke.result": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var normalizedParams, p, callerNodeId, ok;
        var _c, _d, _e, _f, _g, _h, _j;
        var params = _b.params, respond = _b.respond, context = _b.context, client = _b.client;
        return __generator(this, function (_k) {
            normalizedParams = normalizeNodeInvokeResultParams(params);
            if (!(0, index_js_1.validateNodeInvokeResultParams)(normalizedParams)) {
                (0, nodes_helpers_js_1.respondInvalidParams)({
                    respond: respond,
                    method: "node.invoke.result",
                    validator: index_js_1.validateNodeInvokeResultParams,
                });
                return [2 /*return*/];
            }
            p = normalizedParams;
            callerNodeId = (_e = (_d = (_c = client === null || client === void 0 ? void 0 : client.connect) === null || _c === void 0 ? void 0 : _c.device) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : (_g = (_f = client === null || client === void 0 ? void 0 : client.connect) === null || _f === void 0 ? void 0 : _f.client) === null || _g === void 0 ? void 0 : _g.id;
            if (callerNodeId && callerNodeId !== p.nodeId) {
                respond(false, undefined, (0, index_js_1.errorShape)(index_js_1.ErrorCodes.INVALID_REQUEST, "nodeId mismatch"));
                return [2 /*return*/];
            }
            ok = context.nodeRegistry.handleInvokeResult({
                id: p.id,
                nodeId: p.nodeId,
                ok: p.ok,
                payload: p.payload,
                payloadJSON: (_h = p.payloadJSON) !== null && _h !== void 0 ? _h : null,
                error: (_j = p.error) !== null && _j !== void 0 ? _j : null,
            });
            if (!ok) {
                // Late-arriving results (after invoke timeout) are expected and harmless.
                // Return success instead of error to reduce log noise; client can discard.
                context.logGateway.debug("late invoke result ignored: id=".concat(p.id, " node=").concat(p.nodeId));
                respond(true, { ok: true, ignored: true }, undefined);
                return [2 /*return*/];
            }
            respond(true, { ok: true }, undefined);
            return [2 /*return*/];
        });
    }); },
    "node.event": function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var p, payloadJSON;
        var params = _b.params, respond = _b.respond, context = _b.context, client = _b.client;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(0, index_js_1.validateNodeEventParams)(params)) {
                        (0, nodes_helpers_js_1.respondInvalidParams)({
                            respond: respond,
                            method: "node.event",
                            validator: index_js_1.validateNodeEventParams,
                        });
                        return [2 /*return*/];
                    }
                    p = params;
                    payloadJSON = typeof p.payloadJSON === "string"
                        ? p.payloadJSON
                        : p.payload !== undefined
                            ? JSON.stringify(p.payload)
                            : null;
                    return [4 /*yield*/, (0, nodes_helpers_js_1.respondUnavailableOnThrow)(respond, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var handleNodeEvent, nodeId, nodeContext;
                            var _a, _b, _c, _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../server-node-events.js"); })];
                                    case 1:
                                        handleNodeEvent = (_g.sent()).handleNodeEvent;
                                        nodeId = (_f = (_c = (_b = (_a = client === null || client === void 0 ? void 0 : client.connect) === null || _a === void 0 ? void 0 : _a.device) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_e = (_d = client === null || client === void 0 ? void 0 : client.connect) === null || _d === void 0 ? void 0 : _d.client) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : "node";
                                        nodeContext = {
                                            deps: context.deps,
                                            broadcast: context.broadcast,
                                            nodeSendToSession: context.nodeSendToSession,
                                            nodeSubscribe: context.nodeSubscribe,
                                            nodeUnsubscribe: context.nodeUnsubscribe,
                                            broadcastVoiceWakeChanged: context.broadcastVoiceWakeChanged,
                                            addChatRun: context.addChatRun,
                                            removeChatRun: context.removeChatRun,
                                            chatAbortControllers: context.chatAbortControllers,
                                            chatAbortedRuns: context.chatAbortedRuns,
                                            chatRunBuffers: context.chatRunBuffers,
                                            chatDeltaSentAt: context.chatDeltaSentAt,
                                            dedupe: context.dedupe,
                                            agentRunSeq: context.agentRunSeq,
                                            getHealthCache: context.getHealthCache,
                                            refreshHealthSnapshot: context.refreshHealthSnapshot,
                                            loadGatewayModelCatalog: context.loadGatewayModelCatalog,
                                            logGateway: { warn: context.logGateway.warn },
                                        };
                                        return [4 /*yield*/, handleNodeEvent(nodeContext, nodeId, {
                                                event: p.event,
                                                payloadJSON: payloadJSON,
                                            })];
                                    case 2:
                                        _g.sent();
                                        respond(true, { ok: true }, undefined);
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
};
