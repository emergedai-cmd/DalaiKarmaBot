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
exports.agentsAddCommand = agentsAddCommand;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var auth_profiles_js_1 = require("../agents/auth-profiles.js");
var paths_js_1 = require("../agents/auth-profiles/paths.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var clack_prompter_js_1 = require("../wizard/clack-prompter.js");
var prompts_js_1 = require("../wizard/prompts.js");
var agents_bindings_js_1 = require("./agents.bindings.js");
var agents_command_shared_js_1 = require("./agents.command-shared.js");
var agents_config_js_1 = require("./agents.config.js");
var auth_choice_prompt_js_1 = require("./auth-choice-prompt.js");
var auth_choice_js_1 = require("./auth-choice.js");
var onboard_channels_js_1 = require("./onboard-channels.js");
var onboard_helpers_js_1 = require("./onboard-helpers.js");
function fileExists(pathname) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(pathname)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function agentsAddCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime, params) {
        var cfg, workspaceFlag, nameInput, hasFlags, nonInteractive, agentId, workspaceDir, agentDir, model, nextConfig, bindingParse, bindingResult, quietRuntime, payload, prompter, name_1, _a, agentName, agentId_1, existingAgent, shouldUpdate, workspaceDefault, workspaceInput, workspaceDir, agentDir, nextConfig, defaultAgentId, sourceAuthPath, destAuthPath, sameAuthPath, _b, _c, shouldCopy, wantsAuth, authStore, authChoice, authResult, selection_1, channelAccountIds_1, wantsBindings, desiredBindings, result, payload, err_1;
        var _d, _e, _f, _g, _h, _j, _k, _l;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, agents_command_shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _m.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    workspaceFlag = (_d = opts.workspace) === null || _d === void 0 ? void 0 : _d.trim();
                    nameInput = (_e = opts.name) === null || _e === void 0 ? void 0 : _e.trim();
                    hasFlags = (params === null || params === void 0 ? void 0 : params.hasFlags) === true;
                    nonInteractive = Boolean(opts.nonInteractive || hasFlags);
                    if (nonInteractive && !workspaceFlag) {
                        runtime.error("Non-interactive mode requires --workspace. Re-run without flags to use the wizard.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!nonInteractive) return [3 /*break*/, 4];
                    if (!nameInput) {
                        runtime.error("Agent name is required in non-interactive mode.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (!workspaceFlag) {
                        runtime.error("Non-interactive mode requires --workspace. Re-run without flags to use the wizard.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    agentId = (0, session_key_js_1.normalizeAgentId)(nameInput);
                    if (agentId === session_key_js_1.DEFAULT_AGENT_ID) {
                        runtime.error("\"".concat(session_key_js_1.DEFAULT_AGENT_ID, "\" is reserved. Choose another name."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    if (agentId !== nameInput) {
                        runtime.log("Normalized agent id to \"".concat(agentId, "\"."));
                    }
                    if ((0, agents_config_js_1.findAgentEntryIndex)((0, agents_config_js_1.listAgentEntries)(cfg), agentId) >= 0) {
                        runtime.error("Agent \"".concat(agentId, "\" already exists."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    workspaceDir = (0, utils_js_1.resolveUserPath)(workspaceFlag);
                    agentDir = ((_f = opts.agentDir) === null || _f === void 0 ? void 0 : _f.trim())
                        ? (0, utils_js_1.resolveUserPath)(opts.agentDir.trim())
                        : (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId);
                    model = (_g = opts.model) === null || _g === void 0 ? void 0 : _g.trim();
                    nextConfig = (0, agents_config_js_1.applyAgentConfig)(cfg, __assign({ agentId: agentId, name: nameInput, workspace: workspaceDir, agentDir: agentDir }, (model ? { model: model } : {})));
                    bindingParse = (0, agents_bindings_js_1.parseBindingSpecs)({
                        agentId: agentId,
                        specs: opts.bind,
                        config: nextConfig,
                    });
                    if (bindingParse.errors.length > 0) {
                        runtime.error(bindingParse.errors.join("\n"));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    bindingResult = bindingParse.bindings.length > 0
                        ? (0, agents_bindings_js_1.applyAgentBindings)(nextConfig, bindingParse.bindings)
                        : { config: nextConfig, added: [], skipped: [], conflicts: [] };
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(bindingResult.config)];
                case 2:
                    _m.sent();
                    if (!opts.json) {
                        (0, logging_js_1.logConfigUpdated)(runtime);
                    }
                    quietRuntime = opts.json ? (0, agents_command_shared_js_1.createQuietRuntime)(runtime) : runtime;
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, quietRuntime, {
                            skipBootstrap: Boolean((_j = (_h = bindingResult.config.agents) === null || _h === void 0 ? void 0 : _h.defaults) === null || _j === void 0 ? void 0 : _j.skipBootstrap),
                            agentId: agentId,
                        })];
                case 3:
                    _m.sent();
                    payload = {
                        agentId: agentId,
                        name: nameInput,
                        workspace: workspaceDir,
                        agentDir: agentDir,
                        model: model,
                        bindings: {
                            added: bindingResult.added.map(agents_bindings_js_1.describeBinding),
                            skipped: bindingResult.skipped.map(agents_bindings_js_1.describeBinding),
                            conflicts: bindingResult.conflicts.map(function (conflict) { return "".concat((0, agents_bindings_js_1.describeBinding)(conflict.binding), " (agent=").concat(conflict.existingAgentId, ")"); }),
                        },
                    };
                    if (opts.json) {
                        runtime.log(JSON.stringify(payload, null, 2));
                    }
                    else {
                        runtime.log("Agent: ".concat(agentId));
                        runtime.log("Workspace: ".concat((0, utils_js_1.shortenHomePath)(workspaceDir)));
                        runtime.log("Agent dir: ".concat((0, utils_js_1.shortenHomePath)(agentDir)));
                        if (model) {
                            runtime.log("Model: ".concat(model));
                        }
                        if (bindingResult.conflicts.length > 0) {
                            runtime.error(__spreadArray([
                                "Skipped bindings already claimed by another agent:"
                            ], bindingResult.conflicts.map(function (conflict) {
                                return "- ".concat((0, agents_bindings_js_1.describeBinding)(conflict.binding), " (agent=").concat(conflict.existingAgentId, ")");
                            }), true).join("\n"));
                        }
                    }
                    return [2 /*return*/];
                case 4:
                    prompter = (0, clack_prompter_js_1.createClackPrompter)();
                    _m.label = 5;
                case 5:
                    _m.trys.push([5, 40, , 41]);
                    return [4 /*yield*/, prompter.intro("Add OpenClaw agent")];
                case 6:
                    _m.sent();
                    if (!(nameInput !== null && nameInput !== void 0)) return [3 /*break*/, 7];
                    _a = nameInput;
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, prompter.text({
                        message: "Agent name",
                        validate: function (value) {
                            if (!(value === null || value === void 0 ? void 0 : value.trim())) {
                                return "Required";
                            }
                            var normalized = (0, session_key_js_1.normalizeAgentId)(value);
                            if (normalized === session_key_js_1.DEFAULT_AGENT_ID) {
                                return "\"".concat(session_key_js_1.DEFAULT_AGENT_ID, "\" is reserved. Choose another name.");
                            }
                            return undefined;
                        },
                    })];
                case 8:
                    _a = (_m.sent());
                    _m.label = 9;
                case 9:
                    name_1 = _a;
                    agentName = String(name_1).trim();
                    agentId_1 = (0, session_key_js_1.normalizeAgentId)(agentName);
                    if (!(agentName !== agentId_1)) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompter.note("Normalized id to \"".concat(agentId_1, "\"."), "Agent id")];
                case 10:
                    _m.sent();
                    _m.label = 11;
                case 11:
                    existingAgent = (0, agents_config_js_1.listAgentEntries)(cfg).find(function (agent) { return (0, session_key_js_1.normalizeAgentId)(agent.id) === agentId_1; });
                    if (!existingAgent) return [3 /*break*/, 14];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Agent \"".concat(agentId_1, "\" already exists. Update it?"),
                            initialValue: false,
                        })];
                case 12:
                    shouldUpdate = _m.sent();
                    if (!!shouldUpdate) return [3 /*break*/, 14];
                    return [4 /*yield*/, prompter.outro("No changes made.")];
                case 13:
                    _m.sent();
                    return [2 /*return*/];
                case 14:
                    workspaceDefault = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId_1);
                    return [4 /*yield*/, prompter.text({
                            message: "Workspace directory",
                            initialValue: workspaceDefault,
                            validate: function (value) { return ((value === null || value === void 0 ? void 0 : value.trim()) ? undefined : "Required"); },
                        })];
                case 15:
                    workspaceInput = _m.sent();
                    workspaceDir = (0, utils_js_1.resolveUserPath)(String(workspaceInput).trim() || workspaceDefault);
                    agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, agentId_1);
                    nextConfig = (0, agents_config_js_1.applyAgentConfig)(cfg, {
                        agentId: agentId_1,
                        name: agentName,
                        workspace: workspaceDir,
                        agentDir: agentDir,
                    });
                    defaultAgentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
                    if (!(defaultAgentId !== agentId_1)) return [3 /*break*/, 24];
                    sourceAuthPath = (0, paths_js_1.resolveAuthStorePath)((0, agent_scope_js_1.resolveAgentDir)(cfg, defaultAgentId));
                    destAuthPath = (0, paths_js_1.resolveAuthStorePath)(agentDir);
                    sameAuthPath = node_path_1.default.resolve(sourceAuthPath).toLowerCase() === node_path_1.default.resolve(destAuthPath).toLowerCase();
                    _c = !sameAuthPath;
                    if (!_c) return [3 /*break*/, 17];
                    return [4 /*yield*/, fileExists(sourceAuthPath)];
                case 16:
                    _c = (_m.sent());
                    _m.label = 17;
                case 17:
                    _b = _c;
                    if (!_b) return [3 /*break*/, 19];
                    return [4 /*yield*/, fileExists(destAuthPath)];
                case 18:
                    _b = !(_m.sent());
                    _m.label = 19;
                case 19:
                    if (!_b) return [3 /*break*/, 24];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Copy auth profiles from \"".concat(defaultAgentId, "\"?"),
                            initialValue: false,
                        })];
                case 20:
                    shouldCopy = _m.sent();
                    if (!shouldCopy) return [3 /*break*/, 24];
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(destAuthPath), { recursive: true })];
                case 21:
                    _m.sent();
                    return [4 /*yield*/, promises_1.default.copyFile(sourceAuthPath, destAuthPath)];
                case 22:
                    _m.sent();
                    return [4 /*yield*/, prompter.note("Copied auth profiles from \"".concat(defaultAgentId, "\"."), "Auth profiles")];
                case 23:
                    _m.sent();
                    _m.label = 24;
                case 24: return [4 /*yield*/, prompter.confirm({
                        message: "Configure model/auth for this agent now?",
                        initialValue: false,
                    })];
                case 25:
                    wantsAuth = _m.sent();
                    if (!wantsAuth) return [3 /*break*/, 28];
                    authStore = (0, auth_profiles_js_1.ensureAuthProfileStore)(agentDir, {
                        allowKeychainPrompt: false,
                    });
                    return [4 /*yield*/, (0, auth_choice_prompt_js_1.promptAuthChoiceGrouped)({
                            prompter: prompter,
                            store: authStore,
                            includeSkip: true,
                        })];
                case 26:
                    authChoice = _m.sent();
                    return [4 /*yield*/, (0, auth_choice_js_1.applyAuthChoice)({
                            authChoice: authChoice,
                            config: nextConfig,
                            prompter: prompter,
                            runtime: runtime,
                            agentDir: agentDir,
                            setDefaultModel: false,
                            agentId: agentId_1,
                        })];
                case 27:
                    authResult = _m.sent();
                    nextConfig = authResult.config;
                    if (authResult.agentModelOverride) {
                        nextConfig = (0, agents_config_js_1.applyAgentConfig)(nextConfig, {
                            agentId: agentId_1,
                            model: authResult.agentModelOverride,
                        });
                    }
                    _m.label = 28;
                case 28: return [4 /*yield*/, (0, auth_choice_js_1.warnIfModelConfigLooksOff)(nextConfig, prompter, {
                        agentId: agentId_1,
                        agentDir: agentDir,
                    })];
                case 29:
                    _m.sent();
                    selection_1 = [];
                    channelAccountIds_1 = {};
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)(nextConfig, runtime, prompter, {
                            allowSignalInstall: true,
                            onSelection: function (value) {
                                selection_1 = value;
                            },
                            promptAccountIds: true,
                            onAccountId: function (channel, accountId) {
                                channelAccountIds_1[channel] = accountId;
                            },
                        })];
                case 30:
                    nextConfig = _m.sent();
                    if (!(selection_1.length > 0)) return [3 /*break*/, 36];
                    return [4 /*yield*/, prompter.confirm({
                            message: "Route selected channels to this agent now? (bindings)",
                            initialValue: false,
                        })];
                case 31:
                    wantsBindings = _m.sent();
                    if (!wantsBindings) return [3 /*break*/, 34];
                    desiredBindings = (0, agents_bindings_js_1.buildChannelBindings)({
                        agentId: agentId_1,
                        selection: selection_1,
                        config: nextConfig,
                        accountIds: channelAccountIds_1,
                    });
                    result = (0, agents_bindings_js_1.applyAgentBindings)(nextConfig, desiredBindings);
                    nextConfig = result.config;
                    if (!(result.conflicts.length > 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, prompter.note(__spreadArray([
                            "Skipped bindings already claimed by another agent:"
                        ], result.conflicts.map(function (conflict) {
                            return "- ".concat((0, agents_bindings_js_1.describeBinding)(conflict.binding), " (agent=").concat(conflict.existingAgentId, ")");
                        }), true).join("\n"), "Routing bindings")];
                case 32:
                    _m.sent();
                    _m.label = 33;
                case 33: return [3 /*break*/, 36];
                case 34: return [4 /*yield*/, prompter.note([
                        "Routing unchanged. Add bindings when you're ready.",
                        "Docs: https://docs.openclaw.ai/concepts/multi-agent",
                    ].join("\n"), "Routing")];
                case 35:
                    _m.sent();
                    _m.label = 36;
                case 36: return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 37:
                    _m.sent();
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    return [4 /*yield*/, (0, onboard_helpers_js_1.ensureWorkspaceAndSessions)(workspaceDir, runtime, {
                            skipBootstrap: Boolean((_l = (_k = nextConfig.agents) === null || _k === void 0 ? void 0 : _k.defaults) === null || _l === void 0 ? void 0 : _l.skipBootstrap),
                            agentId: agentId_1,
                        })];
                case 38:
                    _m.sent();
                    payload = {
                        agentId: agentId_1,
                        name: agentName,
                        workspace: workspaceDir,
                        agentDir: agentDir,
                    };
                    if (opts.json) {
                        runtime.log(JSON.stringify(payload, null, 2));
                    }
                    return [4 /*yield*/, prompter.outro("Agent \"".concat(agentId_1, "\" ready."))];
                case 39:
                    _m.sent();
                    return [3 /*break*/, 41];
                case 40:
                    err_1 = _m.sent();
                    if (err_1 instanceof prompts_js_1.WizardCancelledError) {
                        runtime.exit(0);
                        return [2 /*return*/];
                    }
                    throw err_1;
                case 41: return [2 /*return*/];
            }
        });
    });
}
