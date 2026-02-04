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
exports.agentsDeleteCommand = agentsDeleteCommand;
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var sessions_js_1 = require("../config/sessions.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var clack_prompter_js_1 = require("../wizard/clack-prompter.js");
var agents_command_shared_js_1 = require("./agents.command-shared.js");
var agents_config_js_1 = require("./agents.config.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function agentsDeleteCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var cfg, input, agentId, prompter, confirmed, workspaceDir, agentDir, sessionsDir, result, quietRuntime;
        var _a;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, agents_command_shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _b.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    input = (_a = opts.id) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!input) {
                        runtime.error("Agent id is required.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    agentId = (0, session_key_js_1.normalizeAgentId)(input);
                    if (agentId !== input) {
                        runtime.log("Normalized agent id to \"".concat(agentId, "\"."));
                    }
                    if (agentId === session_key_js_1.DEFAULT_AGENT_ID) {
                        runtime.error("\"".concat(session_key_js_1.DEFAULT_AGENT_ID, "\" cannot be deleted."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if ((0, agents_config_js_1.findAgentEntryIndex)((0, agents_config_js_1.listAgentEntries)(cfg), agentId) < 0) {
                        runtime.error("Agent \"".concat(agentId, "\" not found."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!!opts.force) return [3 /*break*/, 3];
                    if (!process.stdin.isTTY) {
                        runtime.error("Non-interactive session. Re-run with --force.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    return [4 /*yield*/, prompter.confirm({
                            message: "Delete agent \"".concat(agentId, "\" and prune workspace/state?"),
                            initialValue: false,
                        })];
                case 2:
                    confirmed = _b.sent();
                    if (!confirmed) {
                        runtime.log("Cancelled.");
                        return [2 /*return*/];
                    }
                    _b.label = 3;
                case 3:
                    workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId);
                    sessionsDir = (0, sessions_js_1.resolveSessionTranscriptsDirForAgent)(agentId);
                    result = (0, agents_config_js_1.pruneAgentConfig)(cfg, agentId);
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(result.config)];
                case 4:
                    _b.sent();
                    if (!opts.json) {
                        (0, logging_js_1.logConfigUpdated)(runtime);
                    }
                    quietRuntime = opts.json ? (0, agents_command_shared_js_1.createQuietRuntime)(runtime) : runtime;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.moveToTrash)(workspaceDir, quietRuntime)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, onboard_helpers_js_1.moveToTrash)(agentDir, quietRuntime)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, onboard_helpers_js_1.moveToTrash)(sessionsDir, quietRuntime)];
                case 7:
                    _b.sent();
                    if (opts.json) {
                        runtime.log(JSON.stringify({
                            agentId: agentId,
                            workspace: workspaceDir,
                            agentDir: agentDir,
                            sessionsDir: sessionsDir,
                            removedBindings: result.removedBindings,
                            removedAllow: result.removedAllow,
                        }, null, 2));
                    }
                    else {
                        runtime.log("Deleted agent: ".concat(agentId));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
