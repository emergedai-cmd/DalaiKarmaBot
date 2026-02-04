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
exports.registerNodesInvokeCommands = registerNodesInvokeCommands;
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var exec_approvals_js_1 = require("../../infra/exec-approvals.js");
var node_shell_js_1 = require("../../infra/node-shell.js");
var runtime_js_1 = require("../../runtime.js");
var nodes_run_js_1 = require("../nodes-run.js");
var cli_utils_js_1 = require("./cli-utils.js");
var format_js_1 = require("./format.js");
var rpc_js_1 = require("./rpc.js");
function normalizeExecSecurity(value) {
    var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
    if (normalized === "deny" || normalized === "allowlist" || normalized === "full") {
        return normalized;
    }
    return null;
}
function normalizeExecAsk(value) {
    var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
    if (normalized === "off" || normalized === "on-miss" || normalized === "always") {
        return normalized;
    }
    return null;
}
function mergePathPrepend(existing, prepend) {
    if (prepend.length === 0) {
        return existing;
    }
    var partsExisting = (existing !== null && existing !== void 0 ? existing : "")
        .split(node_path_1.default.delimiter)
        .map(function (part) { return part.trim(); })
        .filter(Boolean);
    var merged = [];
    var seen = new Set();
    for (var _i = 0, _a = __spreadArray(__spreadArray([], prepend, true), partsExisting, true); _i < _a.length; _i++) {
        var part = _a[_i];
        if (seen.has(part)) {
            continue;
        }
        seen.add(part);
        merged.push(part);
    }
    return merged.join(node_path_1.default.delimiter);
}
function applyPathPrepend(env, prepend, options) {
    if (!Array.isArray(prepend) || prepend.length === 0) {
        return;
    }
    if ((options === null || options === void 0 ? void 0 : options.requireExisting) && !env.PATH) {
        return;
    }
    var merged = mergePathPrepend(env.PATH, prepend);
    if (merged) {
        env.PATH = merged;
    }
}
function resolveExecDefaults(cfg, agentId) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var globalExec = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.tools) === null || _a === void 0 ? void 0 : _a.exec;
    if (!agentId) {
        return globalExec
            ? {
                security: globalExec.security,
                ask: globalExec.ask,
                node: globalExec.node,
                pathPrepend: globalExec.pathPrepend,
                safeBins: globalExec.safeBins,
            }
            : undefined;
    }
    var agentExec = (_c = (_b = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _b === void 0 ? void 0 : _b.tools) === null || _c === void 0 ? void 0 : _c.exec;
    return {
        security: (_d = agentExec === null || agentExec === void 0 ? void 0 : agentExec.security) !== null && _d !== void 0 ? _d : globalExec === null || globalExec === void 0 ? void 0 : globalExec.security,
        ask: (_e = agentExec === null || agentExec === void 0 ? void 0 : agentExec.ask) !== null && _e !== void 0 ? _e : globalExec === null || globalExec === void 0 ? void 0 : globalExec.ask,
        node: (_f = agentExec === null || agentExec === void 0 ? void 0 : agentExec.node) !== null && _f !== void 0 ? _f : globalExec === null || globalExec === void 0 ? void 0 : globalExec.node,
        pathPrepend: (_g = agentExec === null || agentExec === void 0 ? void 0 : agentExec.pathPrepend) !== null && _g !== void 0 ? _g : globalExec === null || globalExec === void 0 ? void 0 : globalExec.pathPrepend,
        safeBins: (_h = agentExec === null || agentExec === void 0 ? void 0 : agentExec.safeBins) !== null && _h !== void 0 ? _h : globalExec === null || globalExec === void 0 ? void 0 : globalExec.safeBins,
    };
}
function resolveNodePlatform(opts, nodeId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, nodes, match, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.list", opts, {})];
                case 1:
                    res = _b.sent();
                    nodes = (0, format_js_1.parseNodeList)(res);
                    match = nodes.find(function (node) { return node.nodeId === nodeId; });
                    return [2 /*return*/, typeof (match === null || match === void 0 ? void 0 : match.platform) === "string" ? match.platform : null];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registerNodesInvokeCommands(nodes) {
    var _this = this;
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("invoke")
        .description("Invoke a command on a paired node")
        .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
        .requiredOption("--command <command>", "Command (e.g. canvas.eval)")
        .option("--params <json>", "JSON object string for params", "{}")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 15000)", "15000")
        .option("--idempotency-key <key>", "Idempotency key (optional)")
        .action(function (opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("invoke", function () { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId, command, error, params, timeoutMs, invokeParams, result;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, String((_a = opts.node) !== null && _a !== void 0 ? _a : ""))];
                                case 1:
                                    nodeId = _e.sent();
                                    command = String((_b = opts.command) !== null && _b !== void 0 ? _b : "").trim();
                                    if (!nodeId || !command) {
                                        error = (0, cli_utils_js_1.getNodesTheme)().error;
                                        runtime_js_1.defaultRuntime.error(error("--node and --command required"));
                                        runtime_js_1.defaultRuntime.exit(1);
                                        return [2 /*return*/];
                                    }
                                    params = JSON.parse(String((_c = opts.params) !== null && _c !== void 0 ? _c : "{}"));
                                    timeoutMs = opts.invokeTimeout
                                        ? Number.parseInt(String(opts.invokeTimeout), 10)
                                        : undefined;
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: command,
                                        params: params,
                                        idempotencyKey: String((_d = opts.idempotencyKey) !== null && _d !== void 0 ? _d : (0, call_js_1.randomIdempotencyKey)()),
                                    };
                                    if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
                                        invokeParams.timeoutMs = timeoutMs;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 2:
                                    result = _e.sent();
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
    }); }), { timeoutMs: 30000 });
    (0, rpc_js_1.nodesCallOpts)(nodes
        .command("run")
        .description("Run a shell command on a node (mac only)")
        .option("--node <idOrNameOrIp>", "Node id, name, or IP")
        .option("--cwd <path>", "Working directory")
        .option("--env <key=val>", "Environment override (repeatable)", function (value, prev) {
        if (prev === void 0) { prev = []; }
        return __spreadArray(__spreadArray([], prev, true), [value], false);
    })
        .option("--raw <command>", "Run a raw shell command string (sh -lc / cmd.exe /c)")
        .option("--agent <id>", "Agent id (default: configured default agent)")
        .option("--ask <mode>", "Exec ask mode (off|on-miss|always)")
        .option("--security <mode>", "Exec security mode (deny|allowlist|full)")
        .option("--command-timeout <ms>", "Command timeout (ms)")
        .option("--needs-screen-recording", "Require screen recording permission")
        .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 30000)", "30000")
        .argument("[command...]", "Command and args")
        .action(function (command, opts) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, cli_utils_js_1.runNodesCommand)("run", function () { return __awaiter(_this, void 0, void 0, function () {
                        var cfg, agentId, execDefaults, raw, nodeQuery, nodeId, env, timeoutMs, invokeTimeout, argv, rawCommand, platform, nodeEnv, approvedByAsk, approvalDecision, configuredSecurity, requestedSecurity, configuredAsk, requestedAsk, security, ask, approvalsSnapshot, approvalsFile, approvals, hostSecurity, hostAsk, askFallback, requiresAsk, decisionResult, decision, invokeParams, result, payload, stdout, stderr, exitCode, timedOut, success, error, hint, warn, error;
                        var _a, _b, _c, _d, _e, _f, _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    cfg = (0, config_js_1.loadConfig)();
                                    agentId = ((_a = opts.agent) === null || _a === void 0 ? void 0 : _a.trim()) || (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
                                    execDefaults = resolveExecDefaults(cfg, agentId);
                                    raw = typeof opts.raw === "string" ? opts.raw.trim() : "";
                                    if (raw && Array.isArray(command) && command.length > 0) {
                                        throw new Error("use --raw or argv, not both");
                                    }
                                    if (!raw && (!Array.isArray(command) || command.length === 0)) {
                                        throw new Error("command required");
                                    }
                                    nodeQuery = String((_b = opts.node) !== null && _b !== void 0 ? _b : "").trim() || ((_c = execDefaults === null || execDefaults === void 0 ? void 0 : execDefaults.node) === null || _c === void 0 ? void 0 : _c.trim()) || "";
                                    if (!nodeQuery) {
                                        throw new Error("node required (set --node or tools.exec.node)");
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.resolveNodeId)(opts, nodeQuery)];
                                case 1:
                                    nodeId = _h.sent();
                                    env = (0, nodes_run_js_1.parseEnvPairs)(opts.env);
                                    timeoutMs = (0, nodes_run_js_1.parseTimeoutMs)(opts.commandTimeout);
                                    invokeTimeout = (0, nodes_run_js_1.parseTimeoutMs)(opts.invokeTimeout);
                                    argv = Array.isArray(command) ? command : [];
                                    if (!raw) return [3 /*break*/, 3];
                                    rawCommand = raw;
                                    return [4 /*yield*/, resolveNodePlatform(opts, nodeId)];
                                case 2:
                                    platform = _h.sent();
                                    argv = (0, node_shell_js_1.buildNodeShellCommand)(rawCommand, platform !== null && platform !== void 0 ? platform : undefined);
                                    _h.label = 3;
                                case 3:
                                    nodeEnv = env ? __assign({}, env) : undefined;
                                    if (nodeEnv) {
                                        applyPathPrepend(nodeEnv, execDefaults === null || execDefaults === void 0 ? void 0 : execDefaults.pathPrepend, { requireExisting: true });
                                    }
                                    approvedByAsk = false;
                                    approvalDecision = null;
                                    configuredSecurity = (_d = normalizeExecSecurity(execDefaults === null || execDefaults === void 0 ? void 0 : execDefaults.security)) !== null && _d !== void 0 ? _d : "allowlist";
                                    requestedSecurity = normalizeExecSecurity(opts.security);
                                    if (opts.security && !requestedSecurity) {
                                        throw new Error("invalid --security (use deny|allowlist|full)");
                                    }
                                    configuredAsk = (_e = normalizeExecAsk(execDefaults === null || execDefaults === void 0 ? void 0 : execDefaults.ask)) !== null && _e !== void 0 ? _e : "on-miss";
                                    requestedAsk = normalizeExecAsk(opts.ask);
                                    if (opts.ask && !requestedAsk) {
                                        throw new Error("invalid --ask (use off|on-miss|always)");
                                    }
                                    security = (0, exec_approvals_js_1.minSecurity)(configuredSecurity, requestedSecurity !== null && requestedSecurity !== void 0 ? requestedSecurity : configuredSecurity);
                                    ask = (0, exec_approvals_js_1.maxAsk)(configuredAsk, requestedAsk !== null && requestedAsk !== void 0 ? requestedAsk : configuredAsk);
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("exec.approvals.node.get", opts, {
                                            nodeId: nodeId,
                                        })];
                                case 4:
                                    approvalsSnapshot = (_h.sent());
                                    approvalsFile = approvalsSnapshot && typeof approvalsSnapshot === "object"
                                        ? approvalsSnapshot.file
                                        : undefined;
                                    if (!approvalsFile || typeof approvalsFile !== "object") {
                                        throw new Error("exec approvals unavailable");
                                    }
                                    approvals = (0, exec_approvals_js_1.resolveExecApprovalsFromFile)({
                                        file: approvalsFile,
                                        agentId: agentId,
                                        overrides: { security: security, ask: ask },
                                    });
                                    hostSecurity = (0, exec_approvals_js_1.minSecurity)(security, approvals.agent.security);
                                    hostAsk = (0, exec_approvals_js_1.maxAsk)(ask, approvals.agent.ask);
                                    askFallback = approvals.agent.askFallback;
                                    if (hostSecurity === "deny") {
                                        throw new Error("exec denied: host=node security=deny");
                                    }
                                    requiresAsk = hostAsk === "always" || hostAsk === "on-miss";
                                    if (!requiresAsk) return [3 /*break*/, 6];
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("exec.approval.request", opts, {
                                            command: rawCommand !== null && rawCommand !== void 0 ? rawCommand : argv.join(" "),
                                            cwd: opts.cwd,
                                            host: "node",
                                            security: hostSecurity,
                                            ask: hostAsk,
                                            agentId: agentId,
                                            resolvedPath: undefined,
                                            sessionKey: undefined,
                                            timeoutMs: 120000,
                                        })];
                                case 5:
                                    decisionResult = (_h.sent());
                                    decision = decisionResult && typeof decisionResult === "object"
                                        ? ((_f = decisionResult.decision) !== null && _f !== void 0 ? _f : null)
                                        : null;
                                    if (decision === "deny") {
                                        throw new Error("exec denied: user denied");
                                    }
                                    if (!decision) {
                                        if (askFallback === "full") {
                                            approvedByAsk = true;
                                            approvalDecision = "allow-once";
                                        }
                                        else if (askFallback === "allowlist") {
                                            // defer allowlist enforcement to node host
                                        }
                                        else {
                                            throw new Error("exec denied: approval required (approval UI not available)");
                                        }
                                    }
                                    if (decision === "allow-once") {
                                        approvedByAsk = true;
                                        approvalDecision = "allow-once";
                                    }
                                    if (decision === "allow-always") {
                                        approvedByAsk = true;
                                        approvalDecision = "allow-always";
                                    }
                                    _h.label = 6;
                                case 6:
                                    invokeParams = {
                                        nodeId: nodeId,
                                        command: "system.run",
                                        params: {
                                            command: argv,
                                            cwd: opts.cwd,
                                            env: nodeEnv,
                                            timeoutMs: timeoutMs,
                                            needsScreenRecording: opts.needsScreenRecording === true,
                                        },
                                        idempotencyKey: String((_g = opts.idempotencyKey) !== null && _g !== void 0 ? _g : (0, call_js_1.randomIdempotencyKey)()),
                                    };
                                    if (agentId) {
                                        invokeParams.params.agentId = agentId;
                                    }
                                    if (rawCommand) {
                                        invokeParams.params.rawCommand = rawCommand;
                                    }
                                    invokeParams.params.approved = approvedByAsk;
                                    if (approvalDecision) {
                                        invokeParams.params.approvalDecision = approvalDecision;
                                    }
                                    if (invokeTimeout !== undefined) {
                                        invokeParams.timeoutMs = invokeTimeout;
                                    }
                                    return [4 /*yield*/, (0, rpc_js_1.callGatewayCli)("node.invoke", opts, invokeParams)];
                                case 7:
                                    result = _h.sent();
                                    if (opts.json) {
                                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                        return [2 /*return*/];
                                    }
                                    payload = typeof result === "object" && result !== null
                                        ? result.payload
                                        : undefined;
                                    stdout = typeof (payload === null || payload === void 0 ? void 0 : payload.stdout) === "string" ? payload.stdout : "";
                                    stderr = typeof (payload === null || payload === void 0 ? void 0 : payload.stderr) === "string" ? payload.stderr : "";
                                    exitCode = typeof (payload === null || payload === void 0 ? void 0 : payload.exitCode) === "number" ? payload.exitCode : null;
                                    timedOut = (payload === null || payload === void 0 ? void 0 : payload.timedOut) === true;
                                    success = (payload === null || payload === void 0 ? void 0 : payload.success) === true;
                                    if (stdout) {
                                        process.stdout.write(stdout);
                                    }
                                    if (stderr) {
                                        process.stderr.write(stderr);
                                    }
                                    if (timedOut) {
                                        error = (0, cli_utils_js_1.getNodesTheme)().error;
                                        runtime_js_1.defaultRuntime.error(error("run timed out"));
                                        runtime_js_1.defaultRuntime.exit(1);
                                        return [2 /*return*/];
                                    }
                                    if (exitCode !== null && exitCode !== 0) {
                                        hint = (0, rpc_js_1.unauthorizedHintForMessage)("".concat(stderr, "\n").concat(stdout));
                                        if (hint) {
                                            warn = (0, cli_utils_js_1.getNodesTheme)().warn;
                                            runtime_js_1.defaultRuntime.error(warn(hint));
                                        }
                                    }
                                    if (exitCode !== null && exitCode !== 0 && !success) {
                                        error = (0, cli_utils_js_1.getNodesTheme)().error;
                                        runtime_js_1.defaultRuntime.error(error("run exit ".concat(exitCode)));
                                        runtime_js_1.defaultRuntime.exit(1);
                                        return [2 /*return*/];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }), { timeoutMs: 35000 });
}
