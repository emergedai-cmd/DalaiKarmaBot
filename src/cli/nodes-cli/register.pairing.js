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
exports.registerNodesPairingCommands = registerNodesPairingCommands;
var runtime_js_1 = require("../../runtime.js");
var table_js_1 = require("../../terminal/table.js");
var cli_utils_js_1 = require("./cli-utils.js");
var format_js_1 = require("./format.js");
var rpc_js_1 = require("./rpc.js");
function registerNodesPairingCommands(nodes) {
    var _this = this;
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("pending")
        .description("List pending pairing requests")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("pending", function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, pending, muted_1, _a, heading, warn, muted, tableWidth, now, rows;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.pair.list", opts, {})];
                                case 1:
                                    result = _c.sent();
                                    pending = (0, format_js_1.parsePairingList)(result).pending;
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(pending, null, 2));
                                        return [2 /*return*/];
                                    }
                                    if (pending.length === 0) {
                                        muted_1 = (0, cli_utils_js_1.getNodesTheme)().muted;
                                        runtime_js_1.defaultRuntime.log(muted_1("No pending pairing requests."));
                                        return [2 /*return*/];
                                    }
                                    _a = (0, cli_utils_js_1.getNodesTheme)(), heading = _a.heading, warn = _a.warn, muted = _a.muted;
                                    tableWidth = Math.max(60, ((_b = process.stdout.columns) !== null && _b !== void 0 ? _b : 120) - 1);
                                    now = Date.now();
                                    rows = pending.map(function (r) {
                                        var _a, _b;
                                        return ({
                                            Request: r.requestId,
                                            Node: ((_a = r.displayName) === null || _a === void 0 ? void 0 : _a.trim()) ? r.displayName.trim() : r.nodeId,
                                            IP: (_b = r.remoteIp) !== null && _b !== void 0 ? _b : "",
                                            Requested: typeof r.ts === "number"
                                                ? "".concat((0, format_js_1.formatAge)(Math.max(0, now - r.ts)), " ago")
                                                : muted("unknown"),
                                            Repair: r.isRepair ? warn("yes") : "",
                                        });
                                    });
                                    runtime_js_1.defaultRuntime.log(heading("Pending"));
                                    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
                                        width: tableWidth,
                                        columns: [
                                            { key: "Request", header: "Request", minWidth: 8 },
                                            { key: "Node", header: "Node", minWidth: 14, flex: true },
                                            { key: "IP", header: "IP", minWidth: 10 },
                                            { key: "Requested", header: "Requested", minWidth: 12 },
                                            { key: "Repair", header: "Repair", minWidth: 6 },
                                        ],
                                        rows: rows,
                                    }).trimEnd());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("approve")
        .description("Approve a pending pairing request")
        .argument("<requestId>", "Pending request id")
        .action(function (requestId, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("approve", function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.pair.approve", opts, {
                                        requestId: requestId,
                                    })];
                                case 1:
                                    result = _a.sent();
                                    runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("reject")
        .description("Reject a pending pairing request")
        .argument("<requestId>", "Pending request id")
        .action(function (requestId, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("reject", function () { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.pair.reject", opts, {
                                        requestId: requestId,
                                    })];
                                case 1:
                                    result = _a.sent();
                                    runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("rename")
        .description("Rename a paired node (display name override)")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .requiredOption("--name <displayName>", "New display name")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("rename", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, name, result, ok;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _c.sent();
                                    name = String((_b = opts.name) !== null && _b !== void 0 ? _b : "").trim();
                                    if (!nodeId || !name) {
                                        runtime_js_1.defaultRuntime.error("--node and --name required");
                                        runtime_js_1.defaultRuntime.exit(1);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.rename", opts, {
                                            nodeId: nodeId,
                                            displayName: name,
                                        })];
                                case 2:
                                    result = _c.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    ok = (0, cli_utils_js_1.getNodesTheme)().ok;
                                    runtime_js_1.defaultRuntime.log(ok("node rename ok: ".concat(nodeId, " -> ").concat(name)));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
}
