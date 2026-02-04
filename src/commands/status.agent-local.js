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
exports.getAgentLocalStatuses = getAgentLocalStatuses;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var sessions_js_1 = require("../config/sessions.js");
var session_utils_js_1 = require("../gateway/session-utils.js");
function fileExists(p) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(p)];
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
function getAgentLocalStatuses() {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, agentList, now, statuses, _loop_1, _i, _a, agent, totalSessions, bootstrapPendingCount;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cfg = (0, config_js_1.loadConfig)();
                    agentList = (0, session_utils_js_1.listAgentsForGateway)(cfg);
                    now = Date.now();
                    statuses = [];
                    _loop_1 = function (agent) {
                        var agentId, workspaceDir, bootstrapPath, bootstrapPending, _d, sessionsPath, store, sessions, sessionsCount, lastUpdatedAt, resolvedLastUpdatedAt, lastActiveAgeMs;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    agentId = agent.id;
                                    workspaceDir = (function () {
                                        try {
                                            return (0, agent_scope_js_1.resolveAgentWorkspaceDir)(cfg, agentId);
                                        }
                                        catch (_a) {
                                            return null;
                                        }
                                    })();
                                    bootstrapPath = workspaceDir != null ? node_path_1.default.join(workspaceDir, "BOOTSTRAP.md") : null;
                                    if (!(bootstrapPath != null)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, fileExists(bootstrapPath)];
                                case 1:
                                    _d = _e.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _d = null;
                                    _e.label = 3;
                                case 3:
                                    bootstrapPending = _d;
                                    sessionsPath = (0, sessions_js_1.resolveStorePath)((_b = cfg.session) === null || _b === void 0 ? void 0 : _b.store, { agentId: agentId });
                                    store = (function () {
                                        try {
                                            return (0, sessions_js_1.loadSessionStore)(sessionsPath);
                                        }
                                        catch (_a) {
                                            return {};
                                        }
                                    })();
                                    sessions = Object.entries(store)
                                        .filter(function (_a) {
                                        var key = _a[0];
                                        return key !== "global" && key !== "unknown";
                                    })
                                        .map(function (_a) {
                                        var entry = _a[1];
                                        return entry;
                                    });
                                    sessionsCount = sessions.length;
                                    lastUpdatedAt = sessions.reduce(function (max, e) { var _a; return Math.max(max, (_a = e === null || e === void 0 ? void 0 : e.updatedAt) !== null && _a !== void 0 ? _a : 0); }, 0);
                                    resolvedLastUpdatedAt = lastUpdatedAt > 0 ? lastUpdatedAt : null;
                                    lastActiveAgeMs = resolvedLastUpdatedAt ? now - resolvedLastUpdatedAt : null;
                                    statuses.push({
                                        id: agentId,
                                        name: agent.name,
                                        workspaceDir: workspaceDir,
                                        bootstrapPending: bootstrapPending,
                                        sessionsPath: sessionsPath,
                                        sessionsCount: sessionsCount,
                                        lastUpdatedAt: resolvedLastUpdatedAt,
                                        lastActiveAgeMs: lastActiveAgeMs,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = agentList.agents;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    agent = _a[_i];
                    return [5 /*yield**/, _loop_1(agent)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    totalSessions = statuses.reduce(function (sum, s) { return sum + s.sessionsCount; }, 0);
                    bootstrapPendingCount = statuses.reduce(function (sum, s) { return sum + (s.bootstrapPending ? 1 : 0); }, 0);
                    return [2 /*return*/, {
                            defaultId: agentList.defaultId,
                            agents: statuses,
                            totalSessions: totalSessions,
                            bootstrapPendingCount: bootstrapPendingCount,
                        }];
            }
        });
    });
}
