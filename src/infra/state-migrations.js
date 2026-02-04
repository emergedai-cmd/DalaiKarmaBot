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
exports.resetAutoMigrateLegacyStateForTest = resetAutoMigrateLegacyStateForTest;
exports.resetAutoMigrateLegacyAgentDirForTest = resetAutoMigrateLegacyAgentDirForTest;
exports.resetAutoMigrateLegacyStateDirForTest = resetAutoMigrateLegacyStateDirForTest;
exports.autoMigrateLegacyStateDir = autoMigrateLegacyStateDir;
exports.detectLegacyStateMigrations = detectLegacyStateMigrations;
exports.migrateLegacyAgentDir = migrateLegacyAgentDir;
exports.runLegacyStateMigrations = runLegacyStateMigrations;
exports.autoMigrateLegacyAgentDir = autoMigrateLegacyAgentDir;
exports.autoMigrateLegacyState = autoMigrateLegacyState;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var paths_js_1 = require("../config/paths.js");
var sessions_js_1 = require("../config/sessions.js");
var main_session_js_1 = require("../config/sessions/main-session.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var session_key_js_1 = require("../routing/session-key.js");
var state_migrations_fs_js_1 = require("./state-migrations.fs.js");
var autoMigrateChecked = false;
var autoMigrateStateDirChecked = false;
function isSurfaceGroupKey(key) {
    return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key) {
    var trimmed = key.trim();
    if (!trimmed) {
        return false;
    }
    if (trimmed.startsWith("group:")) {
        return true;
    }
    var lower = trimmed.toLowerCase();
    if (!lower.includes("@g.us")) {
        return false;
    }
    // Legacy WhatsApp group keys: bare JID or "whatsapp:<jid>" without explicit ":group:" kind.
    if (!trimmed.includes(":")) {
        return true;
    }
    if (lower.startsWith("whatsapp:") && !trimmed.includes(":group:")) {
        return true;
    }
    return false;
}
function canonicalizeSessionKeyForAgent(params) {
    var agentId = (0, session_key_js_1.normalizeAgentId)(params.agentId);
    var raw = params.key.trim();
    if (!raw) {
        return raw;
    }
    if (raw.toLowerCase() === "global" || raw.toLowerCase() === "unknown") {
        return raw.toLowerCase();
    }
    var canonicalMain = (0, main_session_js_1.canonicalizeMainSessionAlias)({
        cfg: { session: { scope: params.scope, mainKey: params.mainKey } },
        agentId: agentId,
        sessionKey: raw,
    });
    if (canonicalMain !== raw) {
        return canonicalMain.toLowerCase();
    }
    if (raw.toLowerCase().startsWith("agent:")) {
        return raw.toLowerCase();
    }
    if (raw.toLowerCase().startsWith("subagent:")) {
        var rest = raw.slice("subagent:".length);
        return "agent:".concat(agentId, ":subagent:").concat(rest).toLowerCase();
    }
    if (raw.startsWith("group:")) {
        var id = raw.slice("group:".length).trim();
        if (!id) {
            return raw;
        }
        var channel = id.toLowerCase().includes("@g.us") ? "whatsapp" : "unknown";
        return "agent:".concat(agentId, ":").concat(channel, ":group:").concat(id).toLowerCase();
    }
    if (!raw.includes(":") && raw.toLowerCase().includes("@g.us")) {
        return "agent:".concat(agentId, ":whatsapp:group:").concat(raw).toLowerCase();
    }
    if (raw.toLowerCase().startsWith("whatsapp:") && raw.toLowerCase().includes("@g.us")) {
        var remainder = raw.slice("whatsapp:".length).trim();
        var cleaned = remainder.replace(/^group:/i, "").trim();
        if (cleaned && !isSurfaceGroupKey(raw)) {
            return "agent:".concat(agentId, ":whatsapp:group:").concat(cleaned).toLowerCase();
        }
    }
    if (isSurfaceGroupKey(raw)) {
        return "agent:".concat(agentId, ":").concat(raw).toLowerCase();
    }
    return "agent:".concat(agentId, ":").concat(raw).toLowerCase();
}
function pickLatestLegacyDirectEntry(store) {
    var best = null;
    var bestUpdated = -1;
    for (var _i = 0, _a = Object.entries(store); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], entry = _b[1];
        if (!entry || typeof entry !== "object") {
            continue;
        }
        var normalized = key.trim();
        if (!normalized) {
            continue;
        }
        if (normalized === "global") {
            continue;
        }
        if (normalized.startsWith("agent:")) {
            continue;
        }
        if (normalized.toLowerCase().startsWith("subagent:")) {
            continue;
        }
        if (isLegacyGroupKey(normalized) || isSurfaceGroupKey(normalized)) {
            continue;
        }
        var updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
        if (updatedAt > bestUpdated) {
            bestUpdated = updatedAt;
            best = entry;
        }
    }
    return best;
}
function normalizeSessionEntry(entry) {
    var sessionId = typeof entry.sessionId === "string" ? entry.sessionId : null;
    if (!sessionId) {
        return null;
    }
    var updatedAt = typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)
        ? entry.updatedAt
        : Date.now();
    var normalized = __assign(__assign({}, entry), { sessionId: sessionId, updatedAt: updatedAt });
    var rec = normalized;
    if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") {
        rec.groupChannel = rec.room;
    }
    delete rec.room;
    return normalized;
}
function resolveUpdatedAt(entry) {
    return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)
        ? entry.updatedAt
        : 0;
}
function mergeSessionEntry(params) {
    if (!params.existing) {
        return params.incoming;
    }
    var existingUpdated = resolveUpdatedAt(params.existing);
    var incomingUpdated = resolveUpdatedAt(params.incoming);
    if (incomingUpdated > existingUpdated) {
        return params.incoming;
    }
    if (incomingUpdated < existingUpdated) {
        return params.existing;
    }
    return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
    var _a;
    var canonical = {};
    var meta = new Map();
    var legacyKeys = [];
    for (var _i = 0, _b = Object.entries(params.store); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], entry = _c[1];
        if (!entry || typeof entry !== "object") {
            continue;
        }
        var canonicalKey = canonicalizeSessionKeyForAgent({
            key: key,
            agentId: params.agentId,
            mainKey: params.mainKey,
            scope: params.scope,
        });
        var isCanonical = canonicalKey === key;
        if (!isCanonical) {
            legacyKeys.push(key);
        }
        var existing = canonical[canonicalKey];
        if (!existing) {
            canonical[canonicalKey] = entry;
            meta.set(canonicalKey, { isCanonical: isCanonical, updatedAt: resolveUpdatedAt(entry) });
            continue;
        }
        var existingMeta = meta.get(canonicalKey);
        var incomingUpdated = resolveUpdatedAt(entry);
        var existingUpdated = (_a = existingMeta === null || existingMeta === void 0 ? void 0 : existingMeta.updatedAt) !== null && _a !== void 0 ? _a : resolveUpdatedAt(existing);
        if (incomingUpdated > existingUpdated) {
            canonical[canonicalKey] = entry;
            meta.set(canonicalKey, { isCanonical: isCanonical, updatedAt: incomingUpdated });
            continue;
        }
        if (incomingUpdated < existingUpdated) {
            continue;
        }
        if ((existingMeta === null || existingMeta === void 0 ? void 0 : existingMeta.isCanonical) && !isCanonical) {
            continue;
        }
        if (!(existingMeta === null || existingMeta === void 0 ? void 0 : existingMeta.isCanonical) && isCanonical) {
            canonical[canonicalKey] = entry;
            meta.set(canonicalKey, { isCanonical: isCanonical, updatedAt: incomingUpdated });
            continue;
        }
    }
    return { store: canonical, legacyKeys: legacyKeys };
}
function listLegacySessionKeys(params) {
    var legacy = [];
    for (var _i = 0, _a = Object.keys(params.store); _i < _a.length; _i++) {
        var key = _a[_i];
        var canonical = canonicalizeSessionKeyForAgent({
            key: key,
            agentId: params.agentId,
            mainKey: params.mainKey,
            scope: params.scope,
        });
        if (canonical !== key) {
            legacy.push(key);
        }
    }
    return legacy;
}
function emptyDirOrMissing(dir) {
    if (!(0, state_migrations_fs_js_1.existsDir)(dir)) {
        return true;
    }
    return (0, state_migrations_fs_js_1.safeReadDir)(dir).length === 0;
}
function removeDirIfEmpty(dir) {
    if (!(0, state_migrations_fs_js_1.existsDir)(dir)) {
        return;
    }
    if (!emptyDirOrMissing(dir)) {
        return;
    }
    try {
        node_fs_1.default.rmdirSync(dir);
    }
    catch (_a) {
        // ignore
    }
}
function resetAutoMigrateLegacyStateForTest() {
    autoMigrateChecked = false;
}
function resetAutoMigrateLegacyAgentDirForTest() {
    resetAutoMigrateLegacyStateForTest();
}
function resetAutoMigrateLegacyStateDirForTest() {
    autoMigrateStateDirChecked = false;
}
function resolveSymlinkTarget(linkPath) {
    try {
        var target = node_fs_1.default.readlinkSync(linkPath);
        return node_path_1.default.resolve(node_path_1.default.dirname(linkPath), target);
    }
    catch (_a) {
        return null;
    }
}
function formatStateDirMigration(legacyDir, targetDir) {
    return "State dir: ".concat(legacyDir, " \u2192 ").concat(targetDir, " (legacy path now symlinked)");
}
function isDirPath(filePath) {
    try {
        return node_fs_1.default.statSync(filePath).isDirectory();
    }
    catch (_a) {
        return false;
    }
}
function autoMigrateLegacyStateDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, homedir, targetDir, legacyDirs, legacyDir, warnings, changes, legacyStat, symlinkDepth, _loop_1, state_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            if (autoMigrateStateDirChecked) {
                return [2 /*return*/, { migrated: false, skipped: true, changes: [], warnings: [] }];
            }
            autoMigrateStateDirChecked = true;
            env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
            if ((_b = env.OPENCLAW_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim()) {
                return [2 /*return*/, { migrated: false, skipped: true, changes: [], warnings: [] }];
            }
            homedir = (_c = params.homedir) !== null && _c !== void 0 ? _c : node_os_1.default.homedir;
            targetDir = (0, paths_js_1.resolveNewStateDir)(homedir);
            legacyDirs = (0, paths_js_1.resolveLegacyStateDirs)(homedir);
            legacyDir = legacyDirs.find(function (dir) {
                try {
                    return node_fs_1.default.existsSync(dir);
                }
                catch (_a) {
                    return false;
                }
            });
            warnings = [];
            changes = [];
            legacyStat = null;
            try {
                legacyStat = legacyDir ? node_fs_1.default.lstatSync(legacyDir) : null;
            }
            catch (_e) {
                legacyStat = null;
            }
            if (!legacyStat) {
                return [2 /*return*/, { migrated: false, skipped: false, changes: changes, warnings: warnings }];
            }
            if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
                warnings.push("Legacy state path is not a directory: ".concat(legacyDir));
                return [2 /*return*/, { migrated: false, skipped: false, changes: changes, warnings: warnings }];
            }
            symlinkDepth = 0;
            _loop_1 = function () {
                var legacyTarget = legacyDir ? resolveSymlinkTarget(legacyDir) : null;
                if (!legacyTarget) {
                    warnings.push("Legacy state dir is a symlink (".concat(legacyDir !== null && legacyDir !== void 0 ? legacyDir : "unknown", "); could not resolve target."));
                    return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
                }
                if (node_path_1.default.resolve(legacyTarget) === node_path_1.default.resolve(targetDir)) {
                    return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
                }
                if (legacyDirs.some(function (dir) { return node_path_1.default.resolve(dir) === node_path_1.default.resolve(legacyTarget); })) {
                    legacyDir = legacyTarget;
                    try {
                        legacyStat = node_fs_1.default.lstatSync(legacyDir);
                    }
                    catch (_f) {
                        legacyStat = null;
                    }
                    if (!legacyStat) {
                        warnings.push("Legacy state dir missing after symlink resolution: ".concat(legacyDir));
                        return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
                    }
                    if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
                        warnings.push("Legacy state path is not a directory: ".concat(legacyDir));
                        return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
                    }
                    symlinkDepth += 1;
                    if (symlinkDepth > 2) {
                        warnings.push("Legacy state dir symlink chain too deep: ".concat(legacyDir));
                        return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
                    }
                    return "continue";
                }
                warnings.push("Legacy state dir is a symlink (".concat(legacyDir !== null && legacyDir !== void 0 ? legacyDir : "unknown", " \u2192 ").concat(legacyTarget, "); skipping auto-migration."));
                return { value: { migrated: false, skipped: false, changes: changes, warnings: warnings } };
            };
            while (legacyStat.isSymbolicLink()) {
                state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
            }
            if (isDirPath(targetDir)) {
                warnings.push("State dir migration skipped: target already exists (".concat(targetDir, "). Remove or merge manually."));
                return [2 /*return*/, { migrated: false, skipped: false, changes: changes, warnings: warnings }];
            }
            try {
                if (!legacyDir) {
                    throw new Error("Legacy state dir not found");
                }
                node_fs_1.default.renameSync(legacyDir, targetDir);
            }
            catch (err) {
                warnings.push("Failed to move legacy state dir (".concat(legacyDir !== null && legacyDir !== void 0 ? legacyDir : "unknown", " \u2192 ").concat(targetDir, "): ").concat(String(err)));
                return [2 /*return*/, { migrated: false, skipped: false, changes: changes, warnings: warnings }];
            }
            try {
                if (!legacyDir) {
                    throw new Error("Legacy state dir not found");
                }
                node_fs_1.default.symlinkSync(targetDir, legacyDir, "dir");
                changes.push(formatStateDirMigration(legacyDir, targetDir));
            }
            catch (err) {
                try {
                    if (process.platform === "win32") {
                        if (!legacyDir) {
                            throw new Error("Legacy state dir not found", { cause: err });
                        }
                        node_fs_1.default.symlinkSync(targetDir, legacyDir, "junction");
                        changes.push(formatStateDirMigration(legacyDir, targetDir));
                    }
                    else {
                        throw err;
                    }
                }
                catch (fallbackErr) {
                    try {
                        if (!legacyDir) {
                            // oxlint-disable-next-line preserve-caught-error
                            throw new Error("Legacy state dir not found", { cause: fallbackErr });
                        }
                        node_fs_1.default.renameSync(targetDir, legacyDir);
                        warnings.push("State dir migration rolled back (failed to link legacy path): ".concat(String(fallbackErr)));
                        return [2 /*return*/, { migrated: false, skipped: false, changes: [], warnings: warnings }];
                    }
                    catch (rollbackErr) {
                        warnings.push("State dir moved but failed to link legacy path (".concat(legacyDir !== null && legacyDir !== void 0 ? legacyDir : "unknown", " \u2192 ").concat(targetDir, "): ").concat(String(fallbackErr)));
                        warnings.push("Rollback failed; set OPENCLAW_STATE_DIR=".concat(targetDir, " to avoid split state: ").concat(String(rollbackErr)));
                        changes.push("State dir: ".concat(legacyDir !== null && legacyDir !== void 0 ? legacyDir : "unknown", " \u2192 ").concat(targetDir));
                    }
                }
            }
            return [2 /*return*/, { migrated: changes.length > 0, skipped: false, changes: changes, warnings: warnings }];
        });
    });
}
function detectLegacyStateMigrations(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, homedir, stateDir, oauthDir, targetAgentId, rawMainKey, targetMainKey, targetScope, sessionsLegacyDir, sessionsLegacyStorePath, sessionsTargetDir, sessionsTargetStorePath, legacySessionEntries, hasLegacySessions, targetSessionParsed, legacyKeys, legacyAgentDir, targetAgentDir, hasLegacyAgentDir, targetWhatsAppAuthDir, hasLegacyWhatsAppAuth, preview;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
            homedir = (_b = params.homedir) !== null && _b !== void 0 ? _b : node_os_1.default.homedir;
            stateDir = (0, paths_js_1.resolveStateDir)(env, homedir);
            oauthDir = (0, paths_js_1.resolveOAuthDir)(env, stateDir);
            targetAgentId = (0, session_key_js_1.normalizeAgentId)((0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg));
            rawMainKey = (_c = params.cfg.session) === null || _c === void 0 ? void 0 : _c.mainKey;
            targetMainKey = typeof rawMainKey === "string" && rawMainKey.trim().length > 0
                ? rawMainKey.trim()
                : session_key_js_1.DEFAULT_MAIN_KEY;
            targetScope = (_d = params.cfg.session) === null || _d === void 0 ? void 0 : _d.scope;
            sessionsLegacyDir = node_path_1.default.join(stateDir, "sessions");
            sessionsLegacyStorePath = node_path_1.default.join(sessionsLegacyDir, "sessions.json");
            sessionsTargetDir = node_path_1.default.join(stateDir, "agents", targetAgentId, "sessions");
            sessionsTargetStorePath = node_path_1.default.join(sessionsTargetDir, "sessions.json");
            legacySessionEntries = (0, state_migrations_fs_js_1.safeReadDir)(sessionsLegacyDir);
            hasLegacySessions = (0, state_migrations_fs_js_1.fileExists)(sessionsLegacyStorePath) ||
                legacySessionEntries.some(function (e) { return e.isFile() && e.name.endsWith(".jsonl"); });
            targetSessionParsed = (0, state_migrations_fs_js_1.fileExists)(sessionsTargetStorePath)
                ? (0, state_migrations_fs_js_1.readSessionStoreJson5)(sessionsTargetStorePath)
                : { store: {}, ok: true };
            legacyKeys = targetSessionParsed.ok
                ? listLegacySessionKeys({
                    store: targetSessionParsed.store,
                    agentId: targetAgentId,
                    mainKey: targetMainKey,
                    scope: targetScope,
                })
                : [];
            legacyAgentDir = node_path_1.default.join(stateDir, "agent");
            targetAgentDir = node_path_1.default.join(stateDir, "agents", targetAgentId, "agent");
            hasLegacyAgentDir = (0, state_migrations_fs_js_1.existsDir)(legacyAgentDir);
            targetWhatsAppAuthDir = node_path_1.default.join(oauthDir, "whatsapp", session_key_js_1.DEFAULT_ACCOUNT_ID);
            hasLegacyWhatsAppAuth = (0, state_migrations_fs_js_1.fileExists)(node_path_1.default.join(oauthDir, "creds.json")) &&
                !(0, state_migrations_fs_js_1.fileExists)(node_path_1.default.join(targetWhatsAppAuthDir, "creds.json"));
            preview = [];
            if (hasLegacySessions) {
                preview.push("- Sessions: ".concat(sessionsLegacyDir, " \u2192 ").concat(sessionsTargetDir));
            }
            if (legacyKeys.length > 0) {
                preview.push("- Sessions: canonicalize legacy keys in ".concat(sessionsTargetStorePath));
            }
            if (hasLegacyAgentDir) {
                preview.push("- Agent dir: ".concat(legacyAgentDir, " \u2192 ").concat(targetAgentDir));
            }
            if (hasLegacyWhatsAppAuth) {
                preview.push("- WhatsApp auth: ".concat(oauthDir, " \u2192 ").concat(targetWhatsAppAuthDir, " (keep oauth.json)"));
            }
            return [2 /*return*/, {
                    targetAgentId: targetAgentId,
                    targetMainKey: targetMainKey,
                    targetScope: targetScope,
                    stateDir: stateDir,
                    oauthDir: oauthDir,
                    sessions: {
                        legacyDir: sessionsLegacyDir,
                        legacyStorePath: sessionsLegacyStorePath,
                        targetDir: sessionsTargetDir,
                        targetStorePath: sessionsTargetStorePath,
                        hasLegacy: hasLegacySessions || legacyKeys.length > 0,
                        legacyKeys: legacyKeys,
                    },
                    agentDir: {
                        legacyDir: legacyAgentDir,
                        targetDir: targetAgentDir,
                        hasLegacy: hasLegacyAgentDir,
                    },
                    whatsappAuth: {
                        legacyDir: oauthDir,
                        targetDir: targetWhatsAppAuthDir,
                        hasLegacy: hasLegacyWhatsAppAuth,
                    },
                    preview: preview,
                }];
        });
    });
}
function migrateLegacySessions(detected, now) {
    return __awaiter(this, void 0, void 0, function () {
        var changes, warnings, legacyParsed, targetParsed, legacyStore, targetStore, canonicalizedTarget, canonicalizedLegacy, merged, _i, _a, _b, key, entry, mainKey, latest, normalized, _c, _d, _e, key, entry, normalizedEntry, entries, _f, entries_1, entry, from, to, legacyLeft, backupDir;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    changes = [];
                    warnings = [];
                    if (!detected.sessions.hasLegacy) {
                        return [2 /*return*/, { changes: changes, warnings: warnings }];
                    }
                    (0, state_migrations_fs_js_1.ensureDir)(detected.sessions.targetDir);
                    legacyParsed = (0, state_migrations_fs_js_1.fileExists)(detected.sessions.legacyStorePath)
                        ? (0, state_migrations_fs_js_1.readSessionStoreJson5)(detected.sessions.legacyStorePath)
                        : { store: {}, ok: true };
                    targetParsed = (0, state_migrations_fs_js_1.fileExists)(detected.sessions.targetStorePath)
                        ? (0, state_migrations_fs_js_1.readSessionStoreJson5)(detected.sessions.targetStorePath)
                        : { store: {}, ok: true };
                    legacyStore = legacyParsed.store;
                    targetStore = targetParsed.store;
                    canonicalizedTarget = canonicalizeSessionStore({
                        store: targetStore,
                        agentId: detected.targetAgentId,
                        mainKey: detected.targetMainKey,
                        scope: detected.targetScope,
                    });
                    canonicalizedLegacy = canonicalizeSessionStore({
                        store: legacyStore,
                        agentId: detected.targetAgentId,
                        mainKey: detected.targetMainKey,
                        scope: detected.targetScope,
                    });
                    merged = __assign({}, canonicalizedTarget.store);
                    for (_i = 0, _a = Object.entries(canonicalizedLegacy.store); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], entry = _b[1];
                        merged[key] = mergeSessionEntry({
                            existing: merged[key],
                            incoming: entry,
                            preferIncomingOnTie: false,
                        });
                    }
                    mainKey = (0, session_key_js_1.buildAgentMainSessionKey)({
                        agentId: detected.targetAgentId,
                        mainKey: detected.targetMainKey,
                    });
                    if (!merged[mainKey]) {
                        latest = pickLatestLegacyDirectEntry(legacyStore);
                        if (latest === null || latest === void 0 ? void 0 : latest.sessionId) {
                            merged[mainKey] = latest;
                            changes.push("Migrated latest direct-chat session \u2192 ".concat(mainKey));
                        }
                    }
                    if (!legacyParsed.ok) {
                        warnings.push("Legacy sessions store unreadable; left in place at ".concat(detected.sessions.legacyStorePath));
                    }
                    if (!((legacyParsed.ok || targetParsed.ok) &&
                        (Object.keys(legacyStore).length > 0 || Object.keys(targetStore).length > 0))) return [3 /*break*/, 2];
                    normalized = {};
                    for (_c = 0, _d = Object.entries(merged); _c < _d.length; _c++) {
                        _e = _d[_c], key = _e[0], entry = _e[1];
                        normalizedEntry = normalizeSessionEntry(entry);
                        if (!normalizedEntry) {
                            continue;
                        }
                        normalized[key] = normalizedEntry;
                    }
                    return [4 /*yield*/, (0, sessions_js_1.saveSessionStore)(detected.sessions.targetStorePath, normalized)];
                case 1:
                    _g.sent();
                    changes.push("Merged sessions store \u2192 ".concat(detected.sessions.targetStorePath));
                    if (canonicalizedTarget.legacyKeys.length > 0) {
                        changes.push("Canonicalized ".concat(canonicalizedTarget.legacyKeys.length, " legacy session key(s)"));
                    }
                    _g.label = 2;
                case 2:
                    entries = (0, state_migrations_fs_js_1.safeReadDir)(detected.sessions.legacyDir);
                    for (_f = 0, entries_1 = entries; _f < entries_1.length; _f++) {
                        entry = entries_1[_f];
                        if (!entry.isFile()) {
                            continue;
                        }
                        if (entry.name === "sessions.json") {
                            continue;
                        }
                        from = node_path_1.default.join(detected.sessions.legacyDir, entry.name);
                        to = node_path_1.default.join(detected.sessions.targetDir, entry.name);
                        if ((0, state_migrations_fs_js_1.fileExists)(to)) {
                            continue;
                        }
                        try {
                            node_fs_1.default.renameSync(from, to);
                            changes.push("Moved ".concat(entry.name, " \u2192 agents/").concat(detected.targetAgentId, "/sessions"));
                        }
                        catch (err) {
                            warnings.push("Failed moving ".concat(from, ": ").concat(String(err)));
                        }
                    }
                    if (legacyParsed.ok) {
                        try {
                            if ((0, state_migrations_fs_js_1.fileExists)(detected.sessions.legacyStorePath)) {
                                node_fs_1.default.rmSync(detected.sessions.legacyStorePath, { force: true });
                            }
                        }
                        catch (_h) {
                            // ignore
                        }
                    }
                    removeDirIfEmpty(detected.sessions.legacyDir);
                    legacyLeft = (0, state_migrations_fs_js_1.safeReadDir)(detected.sessions.legacyDir).filter(function (e) { return e.isFile(); });
                    if (legacyLeft.length > 0) {
                        backupDir = "".concat(detected.sessions.legacyDir, ".legacy-").concat(now());
                        try {
                            node_fs_1.default.renameSync(detected.sessions.legacyDir, backupDir);
                            warnings.push("Left legacy sessions at ".concat(backupDir));
                        }
                        catch (_j) {
                            // ignore
                        }
                    }
                    return [2 /*return*/, { changes: changes, warnings: warnings }];
            }
        });
    });
}
function migrateLegacyAgentDir(detected, now) {
    return __awaiter(this, void 0, void 0, function () {
        var changes, warnings, entries, _i, entries_2, entry, from, to, backupDir;
        return __generator(this, function (_a) {
            changes = [];
            warnings = [];
            if (!detected.agentDir.hasLegacy) {
                return [2 /*return*/, { changes: changes, warnings: warnings }];
            }
            (0, state_migrations_fs_js_1.ensureDir)(detected.agentDir.targetDir);
            entries = (0, state_migrations_fs_js_1.safeReadDir)(detected.agentDir.legacyDir);
            for (_i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
                entry = entries_2[_i];
                from = node_path_1.default.join(detected.agentDir.legacyDir, entry.name);
                to = node_path_1.default.join(detected.agentDir.targetDir, entry.name);
                if (node_fs_1.default.existsSync(to)) {
                    continue;
                }
                try {
                    node_fs_1.default.renameSync(from, to);
                    changes.push("Moved agent file ".concat(entry.name, " \u2192 agents/").concat(detected.targetAgentId, "/agent"));
                }
                catch (err) {
                    warnings.push("Failed moving ".concat(from, ": ").concat(String(err)));
                }
            }
            removeDirIfEmpty(detected.agentDir.legacyDir);
            if (!emptyDirOrMissing(detected.agentDir.legacyDir)) {
                backupDir = node_path_1.default.join(detected.stateDir, "agents", detected.targetAgentId, "agent.legacy-".concat(now()));
                try {
                    node_fs_1.default.renameSync(detected.agentDir.legacyDir, backupDir);
                    warnings.push("Left legacy agent dir at ".concat(backupDir));
                }
                catch (err) {
                    warnings.push("Failed relocating legacy agent dir: ".concat(String(err)));
                }
            }
            return [2 /*return*/, { changes: changes, warnings: warnings }];
        });
    });
}
function migrateLegacyWhatsAppAuth(detected) {
    return __awaiter(this, void 0, void 0, function () {
        var changes, warnings, entries, _i, entries_3, entry, from, to;
        return __generator(this, function (_a) {
            changes = [];
            warnings = [];
            if (!detected.whatsappAuth.hasLegacy) {
                return [2 /*return*/, { changes: changes, warnings: warnings }];
            }
            (0, state_migrations_fs_js_1.ensureDir)(detected.whatsappAuth.targetDir);
            entries = (0, state_migrations_fs_js_1.safeReadDir)(detected.whatsappAuth.legacyDir);
            for (_i = 0, entries_3 = entries; _i < entries_3.length; _i++) {
                entry = entries_3[_i];
                if (!entry.isFile()) {
                    continue;
                }
                if (entry.name === "oauth.json") {
                    continue;
                }
                if (!(0, state_migrations_fs_js_1.isLegacyWhatsAppAuthFile)(entry.name)) {
                    continue;
                }
                from = node_path_1.default.join(detected.whatsappAuth.legacyDir, entry.name);
                to = node_path_1.default.join(detected.whatsappAuth.targetDir, entry.name);
                if ((0, state_migrations_fs_js_1.fileExists)(to)) {
                    continue;
                }
                try {
                    node_fs_1.default.renameSync(from, to);
                    changes.push("Moved WhatsApp auth ".concat(entry.name, " \u2192 whatsapp/default"));
                }
                catch (err) {
                    warnings.push("Failed moving ".concat(from, ": ").concat(String(err)));
                }
            }
            return [2 /*return*/, { changes: changes, warnings: warnings }];
        });
    });
}
function runLegacyStateMigrations(params) {
    return __awaiter(this, void 0, void 0, function () {
        var now, detected, sessions, agentDir, whatsappAuth;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now = (_a = params.now) !== null && _a !== void 0 ? _a : (function () { return Date.now(); });
                    detected = params.detected;
                    return [4 /*yield*/, migrateLegacySessions(detected, now)];
                case 1:
                    sessions = _b.sent();
                    return [4 /*yield*/, migrateLegacyAgentDir(detected, now)];
                case 2:
                    agentDir = _b.sent();
                    return [4 /*yield*/, migrateLegacyWhatsAppAuth(detected)];
                case 3:
                    whatsappAuth = _b.sent();
                    return [2 /*return*/, {
                            changes: __spreadArray(__spreadArray(__spreadArray([], sessions.changes, true), agentDir.changes, true), whatsappAuth.changes, true),
                            warnings: __spreadArray(__spreadArray(__spreadArray([], sessions.warnings, true), agentDir.warnings, true), whatsappAuth.warnings, true),
                        }];
            }
        });
    });
}
function autoMigrateLegacyAgentDir(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, autoMigrateLegacyState(params)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function autoMigrateLegacyState(params) {
    return __awaiter(this, void 0, void 0, function () {
        var env, stateDirResult, detected, now, sessions, agentDir, changes, warnings, logger;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (autoMigrateChecked) {
                        return [2 /*return*/, { migrated: false, skipped: true, changes: [], warnings: [] }];
                    }
                    autoMigrateChecked = true;
                    env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
                    return [4 /*yield*/, autoMigrateLegacyStateDir({
                            env: env,
                            homedir: params.homedir,
                            log: params.log,
                        })];
                case 1:
                    stateDirResult = _f.sent();
                    if (((_b = env.OPENCLAW_AGENT_DIR) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = env.PI_CODING_AGENT_DIR) === null || _c === void 0 ? void 0 : _c.trim())) {
                        return [2 /*return*/, {
                                migrated: stateDirResult.migrated,
                                skipped: true,
                                changes: stateDirResult.changes,
                                warnings: stateDirResult.warnings,
                            }];
                    }
                    return [4 /*yield*/, detectLegacyStateMigrations({
                            cfg: params.cfg,
                            env: env,
                            homedir: params.homedir,
                        })];
                case 2:
                    detected = _f.sent();
                    if (!detected.sessions.hasLegacy && !detected.agentDir.hasLegacy) {
                        return [2 /*return*/, {
                                migrated: stateDirResult.migrated,
                                skipped: false,
                                changes: stateDirResult.changes,
                                warnings: stateDirResult.warnings,
                            }];
                    }
                    now = (_d = params.now) !== null && _d !== void 0 ? _d : (function () { return Date.now(); });
                    return [4 /*yield*/, migrateLegacySessions(detected, now)];
                case 3:
                    sessions = _f.sent();
                    return [4 /*yield*/, migrateLegacyAgentDir(detected, now)];
                case 4:
                    agentDir = _f.sent();
                    changes = __spreadArray(__spreadArray(__spreadArray([], stateDirResult.changes, true), sessions.changes, true), agentDir.changes, true);
                    warnings = __spreadArray(__spreadArray(__spreadArray([], stateDirResult.warnings, true), sessions.warnings, true), agentDir.warnings, true);
                    logger = (_e = params.log) !== null && _e !== void 0 ? _e : (0, subsystem_js_1.createSubsystemLogger)("state-migrations");
                    if (changes.length > 0) {
                        logger.info("Auto-migrated legacy state:\n".concat(changes.map(function (entry) { return "- ".concat(entry); }).join("\n")));
                    }
                    if (warnings.length > 0) {
                        logger.warn("Legacy state migration warnings:\n".concat(warnings.map(function (entry) { return "- ".concat(entry); }).join("\n")));
                    }
                    return [2 /*return*/, {
                            migrated: changes.length > 0,
                            skipped: false,
                            changes: changes,
                            warnings: warnings,
                        }];
            }
        });
    });
}
