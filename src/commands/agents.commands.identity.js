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
exports.agentsSetIdentityCommand = agentsSetIdentityCommand;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var identity_file_js_1 = require("../agents/identity-file.js");
var workspace_js_1 = require("../agents/workspace.js");
var config_js_1 = require("../config/config.js");
var logging_js_1 = require("../config/logging.js");
var session_key_js_1 = require("../routing/session-key.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var agents_command_shared_js_1 = require("./agents.command-shared.js");
var agents_config_js_1 = require("./agents.config.js");
var normalizeWorkspacePath = function (input) { return node_path_1.default.resolve((0, utils_js_1.resolveUserPath)(input)); };
var coerceTrimmed = function (value) {
    var trimmed = value === null || value === void 0 ? void 0 : value.trim();
    return trimmed ? trimmed : undefined;
};
function loadIdentityFromFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, parsed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(filePath, "utf-8")];
                case 1:
                    content = _b.sent();
                    parsed = (0, identity_file_js_1.parseIdentityMarkdown)(content);
                    if (!(0, identity_file_js_1.identityHasValues)(parsed)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, parsed];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
    var list = (0, agents_config_js_1.listAgentEntries)(cfg);
    var ids = list.length > 0
        ? list.map(function (entry) { return (0, session_key_js_1.normalizeAgentId)(entry.id); })
        : [(0, agent_scope_js_1.resolveDefaultAgentId)(cfg)];
    var normalizedTarget = normalizeWorkspacePath(workspaceDir);
    return ids.filter(function (id) { return normalizeWorkspacePath((0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, id)) === normalizedTarget; });
}
function agentsSetIdentityCommand(opts_1) {
    return __awaiter(this, arguments, void 0, function (opts, runtime) {
        var cfg, agentRaw, nameRaw, emojiRaw, themeRaw, avatarRaw, hasExplicitIdentity, identityFileRaw, workspaceRaw, wantsIdentityFile, identityFilePath, workspaceDir, agentId, matches, identityFromFile, targetPath, fileTheme, incomingIdentity, list, index, base, nextIdentity, nextEntry, nextList, defaultId, nextConfig;
        var _a, _b, _c;
        if (runtime === void 0) { runtime = runtime_js_1.defaultRuntime; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, agents_command_shared_js_1.requireValidConfig)(runtime)];
                case 1:
                    cfg = _d.sent();
                    if (!cfg) {
                        return [2 /*return*/];
                    }
                    agentRaw = coerceTrimmed(opts.agent);
                    nameRaw = coerceTrimmed(opts.name);
                    emojiRaw = coerceTrimmed(opts.emoji);
                    themeRaw = coerceTrimmed(opts.theme);
                    avatarRaw = coerceTrimmed(opts.avatar);
                    hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
                    identityFileRaw = coerceTrimmed(opts.identityFile);
                    workspaceRaw = coerceTrimmed(opts.workspace);
                    wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
                    if (identityFileRaw) {
                        identityFilePath = normalizeWorkspacePath(identityFileRaw);
                        workspaceDir = node_path_1.default.dirname(identityFilePath);
                    }
                    else if (workspaceRaw) {
                        workspaceDir = normalizeWorkspacePath(workspaceRaw);
                    }
                    else if (wantsIdentityFile || !agentRaw) {
                        workspaceDir = node_path_1.default.resolve(process.cwd());
                    }
                    agentId = agentRaw ? (0, session_key_js_1.normalizeAgentId)(agentRaw) : undefined;
                    if (!agentId) {
                        if (!workspaceDir) {
                            runtime.error("Select an agent with --agent or provide a workspace via --workspace.");
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                        matches = resolveAgentIdByWorkspace(cfg, workspaceDir);
                        if (matches.length === 0) {
                            runtime.error("No agent workspace matches ".concat((0, utils_js_1.shortenHomePath)(workspaceDir), ". Pass --agent to target a specific agent."));
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                        if (matches.length > 1) {
                            runtime.error("Multiple agents match ".concat((0, utils_js_1.shortenHomePath)(workspaceDir), ": ").concat(matches.join(", "), ". Pass --agent to choose one."));
                            runtime.exit(1);
                            return [2 /*return*/];
                        }
                        agentId = matches[0];
                    }
                    identityFromFile = null;
                    if (!wantsIdentityFile) return [3 /*break*/, 5];
                    if (!identityFilePath) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadIdentityFromFile(identityFilePath)];
                case 2:
                    identityFromFile = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    if (workspaceDir) {
                        identityFromFile = (0, agents_config_js_1.loadAgentIdentity)(workspaceDir);
                    }
                    _d.label = 4;
                case 4:
                    if (!identityFromFile) {
                        targetPath = identityFilePath !== null && identityFilePath !== void 0 ? identityFilePath : (workspaceDir ? node_path_1.default.join(workspaceDir, workspace_js_1.DEFAULT_IDENTITY_FILENAME) : "IDENTITY.md");
                        runtime.error("No identity data found in ".concat((0, utils_js_1.shortenHomePath)(targetPath), "."));
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    _d.label = 5;
                case 5:
                    fileTheme = (_c = (_b = (_a = identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.theme) !== null && _a !== void 0 ? _a : identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.creature) !== null && _b !== void 0 ? _b : identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.vibe) !== null && _c !== void 0 ? _c : undefined;
                    incomingIdentity = __assign(__assign(__assign(__assign({}, (nameRaw || (identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.name) ? { name: nameRaw !== null && nameRaw !== void 0 ? nameRaw : identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.name } : {})), (emojiRaw || (identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.emoji) ? { emoji: emojiRaw !== null && emojiRaw !== void 0 ? emojiRaw : identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.emoji } : {})), (themeRaw || fileTheme ? { theme: themeRaw !== null && themeRaw !== void 0 ? themeRaw : fileTheme } : {})), (avatarRaw || (identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.avatar)
                        ? { avatar: avatarRaw !== null && avatarRaw !== void 0 ? avatarRaw : identityFromFile === null || identityFromFile === void 0 ? void 0 : identityFromFile.avatar }
                        : {}));
                    if (!incomingIdentity.name &&
                        !incomingIdentity.emoji &&
                        !incomingIdentity.theme &&
                        !incomingIdentity.avatar) {
                        runtime.error("No identity fields provided. Use --name/--emoji/--theme/--avatar or --from-identity.");
                        runtime.exit(1);
                        return [2 /*return*/];
                    }
                    list = (0, agents_config_js_1.listAgentEntries)(cfg);
                    index = (0, agents_config_js_1.findAgentEntryIndex)(list, agentId);
                    base = index >= 0 ? list[index] : { id: agentId };
                    nextIdentity = __assign(__assign({}, base.identity), incomingIdentity);
                    nextEntry = __assign(__assign({}, base), { identity: nextIdentity });
                    nextList = __spreadArray([], list, true);
                    if (index >= 0) {
                        nextList[index] = nextEntry;
                    }
                    else {
                        defaultId = (0, session_key_js_1.normalizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(cfg));
                        if (nextList.length === 0 && agentId !== defaultId) {
                            nextList.push({ id: defaultId });
                        }
                        nextList.push(nextEntry);
                    }
                    nextConfig = __assign(__assign({}, cfg), { agents: __assign(__assign({}, cfg.agents), { list: nextList }) });
                    return [4 /*yield*/, (0, config_js_1.writeConfigFile)(nextConfig)];
                case 6:
                    _d.sent();
                    if (opts.json) {
                        runtime.log(JSON.stringify({
                            agentId: agentId,
                            identity: nextIdentity,
                            workspace: workspaceDir !== null && workspaceDir !== void 0 ? workspaceDir : null,
                            identityFile: identityFilePath !== null && identityFilePath !== void 0 ? identityFilePath : null,
                        }, null, 2));
                        return [2 /*return*/];
                    }
                    (0, logging_js_1.logConfigUpdated)(runtime);
                    runtime.log("Agent: ".concat(agentId));
                    if (nextIdentity.name) {
                        runtime.log("Name: ".concat(nextIdentity.name));
                    }
                    if (nextIdentity.theme) {
                        runtime.log("Theme: ".concat(nextIdentity.theme));
                    }
                    if (nextIdentity.emoji) {
                        runtime.log("Emoji: ".concat(nextIdentity.emoji));
                    }
                    if (nextIdentity.avatar) {
                        runtime.log("Avatar: ".concat(nextIdentity.avatar));
                    }
                    if (workspaceDir) {
                        runtime.log("Workspace: ".concat((0, utils_js_1.shortenHomePath)(workspaceDir)));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
