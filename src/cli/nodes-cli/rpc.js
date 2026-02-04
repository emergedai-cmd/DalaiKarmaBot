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
exports.callGatewayCli = exports.nodesCallOpts = void 0;
exports.unauthorizedHintForMessage = unauthorizedHintForMessage;
exports.resolveNodeId = resolveNodeId;
var call_js_1 = require("../../gateway/call.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var progress_js_1 = require("../progress.js");
var format_js_1 = require("./format.js");
var nodesCallOpts = function (cmd, defaults) {
    var _a;
    return cmd
        .option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)")
        .option("--token <token>", "Gateway token (if required)")
        .option("--timeout <ms>", "Timeout in ms", String((_a = defaults === null || defaults === void 0 ? void 0 : defaults.timeoutMs) !== null && _a !== void 0 ? _a : 10000))
        .option("--json", "Output JSON", false);
};
exports.nodesCallOpts = nodesCallOpts;
var callGatewayCli = function (method, opts, params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, progress_js_1.withProgress)({
                label: "Nodes ".concat(method),
                indeterminate: true,
                enabled: opts.json !== true,
            }, function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, call_js_1.callGateway)({
                                url: opts.url,
                                token: opts.token,
                                method: method,
                                params: params,
                                timeoutMs: Number((_a = opts.timeout) !== null && _a !== void 0 ? _a : 10000),
                                clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                                mode: message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
                            })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            }); })];
    });
}); };
exports.callGatewayCli = callGatewayCli;
function unauthorizedHintForMessage(message) {
    var haystack = message.toLowerCase();
    if (haystack.includes("unauthorizedclient") ||
        haystack.includes("bridge client is not authorized") ||
        haystack.includes("unsigned bridge clients are not allowed")) {
        return [
            "peekaboo bridge rejected the client.",
            "sign the peekaboo CLI (TeamID Y5PE65HELJ) or launch the host with",
            "PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1 for local dev.",
        ].join(" ");
    }
    return null;
}
function normalizeNodeKey(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}
function resolveNodeId(opts, query) {
    return __awaiter(this, void 0, void 0, function () {
        var q, nodes, res, _a, res, paired, qNorm, matches, known;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    q = String(query !== null && query !== void 0 ? query : "").trim();
                    if (!q) {
                        throw new Error("node required");
                    }
                    nodes = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, (0, exports.callGatewayCli)("node.list", opts, {})];
                case 2:
                    res = _b.sent();
                    nodes = (0, format_js_1.parseNodeList)(res);
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    return [4 /*yield*/, (0, exports.callGatewayCli)("node.pair.list", opts, {})];
                case 4:
                    res = _b.sent();
                    paired = (0, format_js_1.parsePairingList)(res).paired;
                    nodes = paired.map(function (n) { return ({
                        nodeId: n.nodeId,
                        displayName: n.displayName,
                        platform: n.platform,
                        version: n.version,
                        remoteIp: n.remoteIp,
                    }); });
                    return [3 /*break*/, 5];
                case 5:
                    qNorm = normalizeNodeKey(q);
                    matches = nodes.filter(function (n) {
                        if (n.nodeId === q) {
                            return true;
                        }
                        if (typeof n.remoteIp === "string" && n.remoteIp === q) {
                            return true;
                        }
                        var name = typeof n.displayName === "string" ? n.displayName : "";
                        if (name && normalizeNodeKey(name) === qNorm) {
                            return true;
                        }
                        if (q.length >= 6 && n.nodeId.startsWith(q)) {
                            return true;
                        }
                        return false;
                    });
                    if (matches.length === 1) {
                        return [2 /*return*/, matches[0].nodeId];
                    }
                    if (matches.length === 0) {
                        known = nodes
                            .map(function (n) { return n.displayName || n.remoteIp || n.nodeId; })
                            .filter(Boolean)
                            .join(", ");
                        throw new Error("unknown node: ".concat(q).concat(known ? " (known: ".concat(known, ")") : ""));
                    }
                    throw new Error("ambiguous node: ".concat(q, " (matches: ").concat(matches
                        .map(function (n) { return n.displayName || n.remoteIp || n.nodeId; })
                        .join(", "), ")"));
            }
        });
    });
}
