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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExecApprovalsCli = registerExecApprovalsCli;
var json5_1 = require("json5");
var promises_1 = require("node:fs/promises");
var exec_approvals_js_1 = require("../infra/exec-approvals.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var table_js_1 = require("../terminal/table.js");
var theme_js_1 = require("../terminal/theme.js");
var shared_js_1 = require("./gateway-cli/shared.js");
var gateway_rpc_js_1 = require("./gateway-rpc.js");
var rpc_js_1 = require("./nodes-cli/rpc.js");
function formatAge(msAgo) {
    var s = Math.max(0, Math.floor(msAgo / 1000));
    if (s < 60) {
        return "".concat(s, "s");
    }
    var m = Math.floor(s / 60);
    if (m < 60) {
        return "".concat(m, "m");
    }
    var h = Math.floor(m / 60);
    if (h < 24) {
        return "".concat(h, "h");
    }
    var d = Math.floor(h / 24);
    return "".concat(d, "d");
}
function readStdin() {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, _a, _b, _c, chunk, e_1_1;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    chunks = [];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 6, 7, 12]);
                    _a = true, _b = __asyncValues(process.stdin);
                    _g.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                    _f = _c.value;
                    _a = false;
                    chunk = _f;
                    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
                    _g.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _g.trys.push([7, , 10, 11]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _e.call(_b)];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, Buffer.concat(chunks).toString("utf8")];
            }
        });
    });
}
function resolveTargetNodeId(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (opts.gateway) {
                        return [2 /*return*/, null];
                    }
                    raw = (_b = (_a = opts.node) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                    if (!raw) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, raw)];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function loadSnapshot(opts, nodeId) {
    return __awaiter(this, void 0, void 0, function () {
        var method, params, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = nodeId ? "exec.approvals.node.get" : "exec.approvals.get";
                    params = nodeId ? { nodeId: nodeId } : {};
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)(method, opts, params)];
                case 1:
                    snapshot = (_a.sent());
                    return [2 /*return*/, snapshot];
            }
        });
    });
}
function loadSnapshotLocal() {
    var snapshot = (0, exec_approvals_js_1.readExecApprovalsSnapshot)();
    return {
        path: snapshot.path,
        exists: snapshot.exists,
        hash: snapshot.hash,
        file: snapshot.file,
    };
}
function saveSnapshotLocal(file) {
    (0, exec_approvals_js_1.saveExecApprovals)(file);
    return loadSnapshotLocal();
}
function loadSnapshotTarget(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeId, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opts.gateway && !opts.node) {
                        return [2 /*return*/, { snapshot: loadSnapshotLocal(), nodeId: null, source: "local" }];
                    }
                    return [4 /*yield*/, resolveTargetNodeId(opts)];
                case 1:
                    nodeId = _a.sent();
                    return [4 /*yield*/, loadSnapshot(opts, nodeId)];
                case 2:
                    snapshot = _a.sent();
                    return [2 /*return*/, { snapshot: snapshot, nodeId: nodeId, source: nodeId ? "node" : "gateway" }];
            }
        });
    });
}
function formatCliError(err) {
    var msg = (0, shared_js_1.describeUnknownError)(err);
    return msg.includes("\n") ? msg.split("\n")[0] : msg;
}
function renderApprovalsSnapshot(snapshot, targetLabel) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var rich = (0, theme_js_1.isRich)();
    var heading = function (text) { return (rich ? theme_js_1.theme.heading(text) : text); };
    var muted = function (text) { return (rich ? theme_js_1.theme.muted(text) : text); };
    var tableWidth = Math.max(60, ((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 120) - 1);
    var file = (_b = snapshot.file) !== null && _b !== void 0 ? _b : { version: 1 };
    var defaults = (_c = file.defaults) !== null && _c !== void 0 ? _c : {};
    var defaultsParts = [
        defaults.security ? "security=".concat(defaults.security) : null,
        defaults.ask ? "ask=".concat(defaults.ask) : null,
        defaults.askFallback ? "askFallback=".concat(defaults.askFallback) : null,
        typeof defaults.autoAllowSkills === "boolean"
            ? "autoAllowSkills=".concat(defaults.autoAllowSkills ? "on" : "off")
            : null,
    ].filter(Boolean);
    var agents = (_d = file.agents) !== null && _d !== void 0 ? _d : {};
    var allowlistRows = [];
    var now = Date.now();
    for (var _i = 0, _k = Object.entries(agents); _i < _k.length; _i++) {
        var _l = _k[_i], agentId = _l[0], agent = _l[1];
        var allowlist = Array.isArray(agent.allowlist) ? agent.allowlist : [];
        for (var _m = 0, allowlist_1 = allowlist; _m < allowlist_1.length; _m++) {
            var entry = allowlist_1[_m];
            var pattern = (_f = (_e = entry === null || entry === void 0 ? void 0 : entry.pattern) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
            if (!pattern) {
                continue;
            }
            var lastUsedAt = typeof entry.lastUsedAt === "number" ? entry.lastUsedAt : null;
            allowlistRows.push({
                Target: targetLabel,
                Agent: agentId,
                Pattern: pattern,
                LastUsed: lastUsedAt ? "".concat(formatAge(Math.max(0, now - lastUsedAt)), " ago") : muted("unknown"),
            });
        }
    }
    var summaryRows = [
        { Field: "Target", Value: targetLabel },
        { Field: "Path", Value: snapshot.path },
        { Field: "Exists", Value: snapshot.exists ? "yes" : "no" },
        { Field: "Hash", Value: snapshot.hash },
        { Field: "Version", Value: String((_g = file.version) !== null && _g !== void 0 ? _g : 1) },
        { Field: "Socket", Value: (_j = (_h = file.socket) === null || _h === void 0 ? void 0 : _h.path) !== null && _j !== void 0 ? _j : "default" },
        { Field: "Defaults", Value: defaultsParts.length > 0 ? defaultsParts.join(", ") : "none" },
        { Field: "Agents", Value: String(Object.keys(agents).length) },
        { Field: "Allowlist", Value: String(allowlistRows.length) },
    ];
    runtime_js_1.defaultRuntime.log(heading("Approvals"));
    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
        width: tableWidth,
        columns: [
            { key: "Field", header: "Field", minWidth: 8 },
            { key: "Value", header: "Value", minWidth: 24, flex: true },
        ],
        rows: summaryRows,
    }).trimEnd());
    if (allowlistRows.length === 0) {
        runtime_js_1.defaultRuntime.log("");
        runtime_js_1.defaultRuntime.log(muted("No allowlist entries."));
        return;
    }
    runtime_js_1.defaultRuntime.log("");
    runtime_js_1.defaultRuntime.log(heading("Allowlist"));
    runtime_js_1.defaultRuntime.log((0, table_js_1.renderTable)({
        width: tableWidth,
        columns: [
            { key: "Target", header: "Target", minWidth: 10 },
            { key: "Agent", header: "Agent", minWidth: 8 },
            { key: "Pattern", header: "Pattern", minWidth: 20, flex: true },
            { key: "LastUsed", header: "Last Used", minWidth: 10 },
        ],
        rows: allowlistRows,
    }).trimEnd());
}
function saveSnapshot(opts, nodeId, file, baseHash) {
    return __awaiter(this, void 0, void 0, function () {
        var method, params, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = nodeId ? "exec.approvals.node.set" : "exec.approvals.set";
                    params = nodeId ? { nodeId: nodeId, file: file, baseHash: baseHash } : { file: file, baseHash: baseHash };
                    return [4 /*yield*/, (0, gateway_rpc_js_1.callGatewayFromCli)(method, opts, params)];
                case 1:
                    snapshot = (_a.sent());
                    return [2 /*return*/, snapshot];
            }
        });
    });
}
function resolveAgentKey(value) {
    var _a;
    var trimmed = (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0 ? _a : "";
    return trimmed ? trimmed : "*";
}
function normalizeAllowlistEntry(entry) {
    var _a, _b;
    var pattern = (_b = (_a = entry === null || entry === void 0 ? void 0 : entry.pattern) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    return pattern ? pattern : null;
}
function ensureAgent(file, agentKey) {
    var _a, _b;
    var agents = (_a = file.agents) !== null && _a !== void 0 ? _a : {};
    var entry = (_b = agents[agentKey]) !== null && _b !== void 0 ? _b : {};
    file.agents = agents;
    return entry;
}
function isEmptyAgent(agent) {
    var allowlist = Array.isArray(agent.allowlist) ? agent.allowlist : [];
    return (!agent.security &&
        !agent.ask &&
        !agent.askFallback &&
        agent.autoAllowSkills === undefined &&
        allowlist.length === 0);
}
function registerExecApprovalsCli(program) {
    var _this = this;
    var formatExample = function (cmd, desc) {
        return "  ".concat(theme_js_1.theme.command(cmd), "\n    ").concat(theme_js_1.theme.muted(desc));
    };
    var approvals = program
        .command("approvals")
        .alias("exec-approvals")
        .description("Manage exec approvals (gateway or node host)")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/approvals", "docs.openclaw.ai/cli/approvals"), "\n");
    });
    var getCmd = approvals
        .command("get")
        .description("Fetch exec approvals snapshot")
        .option("--node <node>", "Target node id/name/IP")
        .option("--gateway", "Force gateway approvals", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, snapshot, nodeId, source, muted, targetLabel, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, loadSnapshotTarget(opts)];
                case 1:
                    _a = _b.sent(), snapshot = _a.snapshot, nodeId = _a.nodeId, source = _a.source;
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(snapshot));
                        return [2 /*return*/];
                    }
                    muted = function (text) { return ((0, theme_js_1.isRich)() ? theme_js_1.theme.muted(text) : text); };
                    if (source === "local") {
                        runtime_js_1.defaultRuntime.log(muted("Showing local approvals."));
                        runtime_js_1.defaultRuntime.log("");
                    }
                    targetLabel = source === "local" ? "local" : nodeId ? "node:".concat(nodeId) : "gateway";
                    renderApprovalsSnapshot(snapshot, targetLabel);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    runtime_js_1.defaultRuntime.error(formatCliError(err_1));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    (0, rpc_js_1.nodesCallOpts)(getCmd);
    var setCmd = approvals
        .command("set")
        .description("Replace exec approvals with a JSON file")
        .option("--node <node>", "Target node id/name/IP")
        .option("--gateway", "Force gateway approvals", false)
        .option("--file <path>", "Path to JSON file to upload")
        .option("--stdin", "Read JSON from stdin", false)
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _a, snapshot, nodeId, source, targetLabel, raw, _b, file, next, _c, err_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 9, , 10]);
                    if (!opts.file && !opts.stdin) {
                        runtime_js_1.defaultRuntime.error("Provide --file or --stdin.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (opts.file && opts.stdin) {
                        runtime_js_1.defaultRuntime.error("Use either --file or --stdin (not both).");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, loadSnapshotTarget(opts)];
                case 1:
                    _a = _d.sent(), snapshot = _a.snapshot, nodeId = _a.nodeId, source = _a.source;
                    if (source === "local") {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Writing local approvals."));
                    }
                    targetLabel = source === "local" ? "local" : nodeId ? "node:".concat(nodeId) : "gateway";
                    if (!snapshot.hash) {
                        runtime_js_1.defaultRuntime.error("Exec approvals hash missing; reload and retry.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!opts.stdin) return [3 /*break*/, 3];
                    return [4 /*yield*/, readStdin()];
                case 2:
                    _b = _d.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, promises_1.default.readFile(String(opts.file), "utf8")];
                case 4:
                    _b = _d.sent();
                    _d.label = 5;
                case 5:
                    raw = _b;
                    file = void 0;
                    try {
                        file = json5_1.default.parse(raw);
                    }
                    catch (err) {
                        runtime_js_1.defaultRuntime.error("Failed to parse approvals JSON: ".concat(String(err)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    file.version = 1;
                    if (!(source === "local")) return [3 /*break*/, 6];
                    _c = saveSnapshotLocal(file);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, saveSnapshot(opts, nodeId, file, snapshot.hash)];
                case 7:
                    _c = _d.sent();
                    _d.label = 8;
                case 8:
                    next = _c;
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(next));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Target: ".concat(targetLabel)));
                    renderApprovalsSnapshot(next, targetLabel);
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _d.sent();
                    runtime_js_1.defaultRuntime.error(formatCliError(err_2));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    (0, rpc_js_1.nodesCallOpts)(setCmd);
    var allowlist = approvals
        .command("allowlist")
        .description("Edit the per-agent allowlist")
        .addHelpText("after", function () {
        return "\n".concat(theme_js_1.theme.heading("Examples:"), "\n").concat(formatExample('openclaw approvals allowlist add "~/Projects/**/bin/rg"', "Allowlist a local binary pattern for the main agent."), "\n").concat(formatExample('openclaw approvals allowlist add --agent main --node <id|name|ip> "/usr/bin/uptime"', "Allowlist on a specific node/agent."), "\n").concat(formatExample('openclaw approvals allowlist add --agent "*" "/usr/bin/uname"', "Allowlist for all agents (wildcard)."), "\n").concat(formatExample('openclaw approvals allowlist remove "~/Projects/**/bin/rg"', "Remove an allowlist pattern."), "\n\n").concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/cli/approvals", "docs.openclaw.ai/cli/approvals"), "\n");
    });
    var allowlistAdd = allowlist
        .command("add <pattern>")
        .description("Add a glob pattern to an allowlist")
        .option("--node <node>", "Target node id/name/IP")
        .option("--gateway", "Force gateway approvals", false)
        .option("--agent <id>", 'Agent id (defaults to "*")')
        .action(function (pattern, opts) { return __awaiter(_this, void 0, void 0, function () {
        var trimmed_1, _a, snapshot, nodeId, source, targetLabel, file, agentKey, agent, allowlistEntries, next, _b, err_3;
        var _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    trimmed_1 = pattern.trim();
                    if (!trimmed_1) {
                        runtime_js_1.defaultRuntime.error("Pattern required.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, loadSnapshotTarget(opts)];
                case 1:
                    _a = _e.sent(), snapshot = _a.snapshot, nodeId = _a.nodeId, source = _a.source;
                    if (source === "local") {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Writing local approvals."));
                    }
                    targetLabel = source === "local" ? "local" : nodeId ? "node:".concat(nodeId) : "gateway";
                    if (!snapshot.hash) {
                        runtime_js_1.defaultRuntime.error("Exec approvals hash missing; reload and retry.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    file = (_d = snapshot.file) !== null && _d !== void 0 ? _d : { version: 1 };
                    file.version = 1;
                    agentKey = resolveAgentKey(opts.agent);
                    agent = ensureAgent(file, agentKey);
                    allowlistEntries = Array.isArray(agent.allowlist) ? agent.allowlist : [];
                    if (allowlistEntries.some(function (entry) { return normalizeAllowlistEntry(entry) === trimmed_1; })) {
                        runtime_js_1.defaultRuntime.log("Already allowlisted.");
                        return [2 /*return*/];
                    }
                    allowlistEntries.push({ pattern: trimmed_1, lastUsedAt: Date.now() });
                    agent.allowlist = allowlistEntries;
                    file.agents = __assign(__assign({}, file.agents), (_c = {}, _c[agentKey] = agent, _c));
                    if (!(source === "local")) return [3 /*break*/, 2];
                    _b = saveSnapshotLocal(file);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, saveSnapshot(opts, nodeId, file, snapshot.hash)];
                case 3:
                    _b = _e.sent();
                    _e.label = 4;
                case 4:
                    next = _b;
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(next));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Target: ".concat(targetLabel)));
                    renderApprovalsSnapshot(next, targetLabel);
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _e.sent();
                    runtime_js_1.defaultRuntime.error(formatCliError(err_3));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, rpc_js_1.nodesCallOpts)(allowlistAdd);
    var allowlistRemove = allowlist
        .command("remove <pattern>")
        .description("Remove a glob pattern from an allowlist")
        .option("--node <node>", "Target node id/name/IP")
        .option("--gateway", "Force gateway approvals", false)
        .option("--agent <id>", 'Agent id (defaults to "*")')
        .action(function (pattern, opts) { return __awaiter(_this, void 0, void 0, function () {
        var trimmed_2, _a, snapshot, nodeId, source, targetLabel, file, agentKey, agent, allowlistEntries, nextEntries, agents, next, _b, err_4;
        var _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    trimmed_2 = pattern.trim();
                    if (!trimmed_2) {
                        runtime_js_1.defaultRuntime.error("Pattern required.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, loadSnapshotTarget(opts)];
                case 1:
                    _a = _e.sent(), snapshot = _a.snapshot, nodeId = _a.nodeId, source = _a.source;
                    if (source === "local") {
                        runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Writing local approvals."));
                    }
                    targetLabel = source === "local" ? "local" : nodeId ? "node:".concat(nodeId) : "gateway";
                    if (!snapshot.hash) {
                        runtime_js_1.defaultRuntime.error("Exec approvals hash missing; reload and retry.");
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    file = (_d = snapshot.file) !== null && _d !== void 0 ? _d : { version: 1 };
                    file.version = 1;
                    agentKey = resolveAgentKey(opts.agent);
                    agent = ensureAgent(file, agentKey);
                    allowlistEntries = Array.isArray(agent.allowlist) ? agent.allowlist : [];
                    nextEntries = allowlistEntries.filter(function (entry) { return normalizeAllowlistEntry(entry) !== trimmed_2; });
                    if (nextEntries.length === allowlistEntries.length) {
                        runtime_js_1.defaultRuntime.log("Pattern not found.");
                        return [2 /*return*/];
                    }
                    if (nextEntries.length === 0) {
                        delete agent.allowlist;
                    }
                    else {
                        agent.allowlist = nextEntries;
                    }
                    if (isEmptyAgent(agent)) {
                        agents = __assign({}, file.agents);
                        delete agents[agentKey];
                        file.agents = Object.keys(agents).length > 0 ? agents : undefined;
                    }
                    else {
                        file.agents = __assign(__assign({}, file.agents), (_c = {}, _c[agentKey] = agent, _c));
                    }
                    if (!(source === "local")) return [3 /*break*/, 2];
                    _b = saveSnapshotLocal(file);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, saveSnapshot(opts, nodeId, file, snapshot.hash)];
                case 3:
                    _b = _e.sent();
                    _e.label = 4;
                case 4:
                    next = _b;
                    if (opts.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(next));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(theme_js_1.theme.muted("Target: ".concat(targetLabel)));
                    renderApprovalsSnapshot(next, targetLabel);
                    return [3 /*break*/, 6];
                case 5:
                    err_4 = _e.sent();
                    runtime_js_1.defaultRuntime.error(formatCliError(err_4));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, rpc_js_1.nodesCallOpts)(allowlistRemove);
}
