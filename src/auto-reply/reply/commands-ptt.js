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
exports.handlePTTCommand = void 0;
var call_js_1 = require("../../gateway/call.js");
var globals_js_1 = require("../../globals.js");
var PTT_COMMANDS = {
    start: "talk.ptt.start",
    stop: "talk.ptt.stop",
    once: "talk.ptt.once",
    cancel: "talk.ptt.cancel",
};
function normalizeNodeKey(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}
function isIOSNode(node) {
    var _a, _b, _c, _d;
    var platform = (_b = (_a = node.platform) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    var family = (_d = (_c = node.deviceFamily) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : "";
    return (platform.startsWith("ios") ||
        family.includes("iphone") ||
        family.includes("ipad") ||
        family.includes("ios"));
}
function loadNodes(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, (0, call_js_1.callGateway)({
                            method: "node.list",
                            params: {},
                            config: cfg,
                        })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, Array.isArray(res.nodes) ? res.nodes : []];
                case 2:
                    _a = _b.sent();
                    return [4 /*yield*/, (0, call_js_1.callGateway)({
                            method: "node.pair.list",
                            params: {},
                            config: cfg,
                        })];
                case 3:
                    res = _b.sent();
                    return [2 /*return*/, Array.isArray(res.paired) ? res.paired : []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function describeNodes(nodes) {
    return nodes
        .map(function (node) { return node.displayName || node.remoteIp || node.nodeId; })
        .filter(Boolean)
        .join(", ");
}
function resolveNodeId(nodes, query) {
    var trimmed = String(query !== null && query !== void 0 ? query : "").trim();
    if (trimmed) {
        var qNorm_1 = normalizeNodeKey(trimmed);
        var matches = nodes.filter(function (node) {
            if (node.nodeId === trimmed) {
                return true;
            }
            if (typeof node.remoteIp === "string" && node.remoteIp === trimmed) {
                return true;
            }
            var name = typeof node.displayName === "string" ? node.displayName : "";
            if (name && normalizeNodeKey(name) === qNorm_1) {
                return true;
            }
            if (trimmed.length >= 6 && node.nodeId.startsWith(trimmed)) {
                return true;
            }
            return false;
        });
        if (matches.length === 1) {
            return matches[0].nodeId;
        }
        var known_1 = describeNodes(nodes);
        if (matches.length === 0) {
            throw new Error("unknown node: ".concat(trimmed).concat(known_1 ? " (known: ".concat(known_1, ")") : ""));
        }
        throw new Error("ambiguous node: ".concat(trimmed, " (matches: ").concat(matches
            .map(function (node) { return node.displayName || node.remoteIp || node.nodeId; })
            .join(", "), ")"));
    }
    var iosNodes = nodes.filter(isIOSNode);
    var iosConnected = iosNodes.filter(function (node) { return node.connected; });
    var iosCandidates = iosConnected.length > 0 ? iosConnected : iosNodes;
    if (iosCandidates.length === 1) {
        return iosCandidates[0].nodeId;
    }
    if (iosCandidates.length > 1) {
        throw new Error("multiple iOS nodes found (".concat(describeNodes(iosCandidates), "); specify node=<id>"));
    }
    var connected = nodes.filter(function (node) { return node.connected; });
    var fallback = connected.length > 0 ? connected : nodes;
    if (fallback.length === 1) {
        return fallback[0].nodeId;
    }
    var known = describeNodes(nodes);
    throw new Error("node required".concat(known ? " (known: ".concat(known, ")") : ""));
}
function parsePTTArgs(commandBody) {
    var tokens = commandBody.trim().split(/\s+/).slice(1);
    var action;
    var node;
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (!token) {
            continue;
        }
        if (token.toLowerCase().startsWith("node=")) {
            node = token.slice("node=".length);
            continue;
        }
        if (!action) {
            action = token;
        }
    }
    return { action: action, node: node };
}
function buildPTTHelpText() {
    return [
        "Usage: /ptt <start|stop|once|cancel> [node=<id>]",
        "Example: /ptt once node=iphone",
    ].join("\n");
}
var handlePTTCommand = function (params, allowTextCommands) { return __awaiter(void 0, void 0, void 0, function () {
    var command, cfg, normalized, parsed, actionKey, commandId, nodes, nodeId, invokeParams, res, payload, lines, err_1, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!allowTextCommands) {
                    return [2 /*return*/, null];
                }
                command = params.command, cfg = params.cfg;
                normalized = command.commandBodyNormalized.trim();
                if (!normalized.startsWith("/ptt")) {
                    return [2 /*return*/, null];
                }
                if (!command.isAuthorizedSender) {
                    (0, globals_js_1.logVerbose)("Ignoring /ptt from unauthorized sender: ".concat(command.senderId || "<unknown>"));
                    return [2 /*return*/, { shouldContinue: false, reply: { text: "PTT requires an authorized sender." } }];
                }
                parsed = parsePTTArgs(normalized);
                actionKey = (_b = (_a = parsed.action) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
                commandId = PTT_COMMANDS[actionKey];
                if (!commandId) {
                    return [2 /*return*/, { shouldContinue: false, reply: { text: buildPTTHelpText() } }];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, loadNodes(cfg)];
            case 2:
                nodes = _c.sent();
                nodeId = resolveNodeId(nodes, parsed.node);
                invokeParams = {
                    nodeId: nodeId,
                    command: commandId,
                    params: {},
                    idempotencyKey: (0, call_js_1.randomIdempotencyKey)(),
                    timeoutMs: 15000,
                };
                return [4 /*yield*/, (0, call_js_1.callGateway)({
                        method: "node.invoke",
                        params: invokeParams,
                        config: cfg,
                    })];
            case 3:
                res = _c.sent();
                payload = res.payload && typeof res.payload === "object" ? res.payload : {};
                lines = ["PTT ".concat(actionKey, " \u2192 ").concat(nodeId)];
                if (typeof payload.status === "string") {
                    lines.push("status: ".concat(payload.status));
                }
                if (typeof payload.captureId === "string") {
                    lines.push("captureId: ".concat(payload.captureId));
                }
                if (typeof payload.transcript === "string" && payload.transcript.trim()) {
                    lines.push("transcript: ".concat(payload.transcript));
                }
                return [2 /*return*/, { shouldContinue: false, reply: { text: lines.join("\n") } }];
            case 4:
                err_1 = _c.sent();
                message = err_1 instanceof Error ? err_1.message : String(err_1);
                return [2 /*return*/, { shouldContinue: false, reply: { text: "PTT failed: ".concat(message) } }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.handlePTTCommand = handlePTTCommand;
