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
exports.noteStateIntegrity = noteStateIntegrity;
exports.noteWorkspaceBackupTip = noteWorkspaceBackupTip;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var paths_js_1 = require("../config/paths.js");
var sessions_js_1 = require("../config/sessions.js");
var note_js_1 = require("../terminal/note.js");
var utils_js_1 = require("../utils.js");
function existsDir(dir) {
    try {
        return node_fs_1.default.existsSync(dir) && node_fs_1.default.statSync(dir).isDirectory();
    }
    catch (_a) {
        return false;
    }
}
function existsFile(filePath) {
    try {
        return node_fs_1.default.existsSync(filePath) && node_fs_1.default.statSync(filePath).isFile();
    }
    catch (_a) {
        return false;
    }
}
function canWriteDir(dir) {
    try {
        node_fs_1.default.accessSync(dir, node_fs_1.default.constants.W_OK);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function ensureDir(dir) {
    try {
        node_fs_1.default.mkdirSync(dir, { recursive: true });
        return { ok: true };
    }
    catch (err) {
        return { ok: false, error: String(err) };
    }
}
function dirPermissionHint(dir) {
    var uid = typeof process.getuid === "function" ? process.getuid() : null;
    var gid = typeof process.getgid === "function" ? process.getgid() : null;
    try {
        var stat = node_fs_1.default.statSync(dir);
        if (uid !== null && stat.uid !== uid) {
            return "Owner mismatch (uid ".concat(stat.uid, "). Run: sudo chown -R $USER \"").concat(dir, "\"");
        }
        if (gid !== null && stat.gid !== gid) {
            return "Group mismatch (gid ".concat(stat.gid, "). If access fails, run: sudo chown -R $USER \"").concat(dir, "\"");
        }
    }
    catch (_a) {
        return null;
    }
    return null;
}
function addUserRwx(mode) {
    var perms = mode & 511;
    return perms | 448;
}
function countJsonlLines(filePath) {
    try {
        var raw = node_fs_1.default.readFileSync(filePath, "utf-8");
        if (!raw) {
            return 0;
        }
        var count = 0;
        for (var i = 0; i < raw.length; i += 1) {
            if (raw[i] === "\n") {
                count += 1;
            }
        }
        if (!raw.endsWith("\n")) {
            count += 1;
        }
        return count;
    }
    catch (_a) {
        return 0;
    }
}
function findOtherStateDirs(stateDir) {
    var resolvedState = node_path_1.default.resolve(stateDir);
    var roots = process.platform === "darwin" ? ["/Users"] : process.platform === "linux" ? ["/home"] : [];
    var found = [];
    var _loop_1 = function (root) {
        var entries = [];
        try {
            entries = node_fs_1.default.readdirSync(root, { withFileTypes: true });
        }
        catch (_a) {
            return "continue";
        }
        var _loop_2 = function (entry) {
            if (!entry.isDirectory()) {
                return "continue";
            }
            if (entry.name.startsWith(".")) {
                return "continue";
            }
            var candidates = [".openclaw"].map(function (dir) { return node_path_1.default.resolve(root, entry.name, dir); });
            for (var _c = 0, candidates_1 = candidates; _c < candidates_1.length; _c++) {
                var candidate = candidates_1[_c];
                if (candidate === resolvedState) {
                    continue;
                }
                if (existsDir(candidate)) {
                    found.push(candidate);
                }
            }
        };
        for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
            var entry = entries_1[_b];
            _loop_2(entry);
        }
    };
    for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
        var root = roots_1[_i];
        _loop_1(root);
    }
    return found;
}
function noteStateIntegrity(cfg, prompter, configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var warnings, changes, env, homedir, stateDir, defaultStateDir, oauthDir, agentId, sessionsDir, storePath, storeDir, displayStateDir, displayOauthDir, displaySessionsDir, displayStoreDir, displayConfigPath, stateDirExists, create, created, hint, repair, stat, target, stat, tighten, err_1, stat, tighten, err_2, dirCandidates, displayDirFor, _i, dirCandidates_1, _a, dir, label, displayDir, create, created, hint, repair, stat, target, extraStateDirs, _b, _c, other, store, entries, recent, missing, mainKey, mainEntry, transcriptPath, lineCount;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    warnings = [];
                    changes = [];
                    env = process.env;
                    homedir = node_os_1.default.homedir;
                    stateDir = (0, paths_js_1.resolveStateDir)(env, homedir);
                    defaultStateDir = node_path_1.default.join(homedir(), ".openclaw");
                    oauthDir = (0, paths_js_1.resolveOAuthDir)(env, stateDir);
                    agentId = (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
                    sessionsDir = (0, sessions_js_1.resolveSessionTranscriptsDirForAgent)(agentId, env, homedir);
                    storePath = (0, sessions_js_1.resolveStorePath)((_d = cfg.session) === null || _d === void 0 ? void 0 : _d.store, { agentId: agentId });
                    storeDir = node_path_1.default.dirname(storePath);
                    displayStateDir = (0, utils_js_1.shortenHomePath)(stateDir);
                    displayOauthDir = (0, utils_js_1.shortenHomePath)(oauthDir);
                    displaySessionsDir = (0, utils_js_1.shortenHomePath)(sessionsDir);
                    displayStoreDir = (0, utils_js_1.shortenHomePath)(storeDir);
                    displayConfigPath = configPath ? (0, utils_js_1.shortenHomePath)(configPath) : undefined;
                    stateDirExists = existsDir(stateDir);
                    if (!!stateDirExists) return [3 /*break*/, 2];
                    warnings.push("- CRITICAL: state directory missing (".concat(displayStateDir, "). Sessions, credentials, logs, and config are stored there."));
                    if (((_e = cfg.gateway) === null || _e === void 0 ? void 0 : _e.mode) === "remote") {
                        warnings.push("- Gateway is in remote mode; run doctor on the remote host where the gateway runs.");
                    }
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Create ".concat(displayStateDir, " now?"),
                            initialValue: false,
                        })];
                case 1:
                    create = _f.sent();
                    if (create) {
                        created = ensureDir(stateDir);
                        if (created.ok) {
                            changes.push("- Created ".concat(displayStateDir));
                            stateDirExists = true;
                        }
                        else {
                            warnings.push("- Failed to create ".concat(displayStateDir, ": ").concat(created.error));
                        }
                    }
                    _f.label = 2;
                case 2:
                    if (!(stateDirExists && !canWriteDir(stateDir))) return [3 /*break*/, 4];
                    warnings.push("- State directory not writable (".concat(displayStateDir, ")."));
                    hint = dirPermissionHint(stateDir);
                    if (hint) {
                        warnings.push("  ".concat(hint));
                    }
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Repair permissions on ".concat(displayStateDir, "?"),
                            initialValue: true,
                        })];
                case 3:
                    repair = _f.sent();
                    if (repair) {
                        try {
                            stat = node_fs_1.default.statSync(stateDir);
                            target = addUserRwx(stat.mode);
                            node_fs_1.default.chmodSync(stateDir, target);
                            changes.push("- Repaired permissions on ".concat(displayStateDir));
                        }
                        catch (err) {
                            warnings.push("- Failed to repair ".concat(displayStateDir, ": ").concat(String(err)));
                        }
                    }
                    _f.label = 4;
                case 4:
                    if (!(stateDirExists && process.platform !== "win32")) return [3 /*break*/, 9];
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, 8, , 9]);
                    stat = node_fs_1.default.statSync(stateDir);
                    if (!((stat.mode & 63) !== 0)) return [3 /*break*/, 7];
                    warnings.push("- State directory permissions are too open (".concat(displayStateDir, "). Recommend chmod 700."));
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Tighten permissions on ".concat(displayStateDir, " to 700?"),
                            initialValue: true,
                        })];
                case 6:
                    tighten = _f.sent();
                    if (tighten) {
                        node_fs_1.default.chmodSync(stateDir, 448);
                        changes.push("- Tightened permissions on ".concat(displayStateDir, " to 700"));
                    }
                    _f.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _f.sent();
                    warnings.push("- Failed to read ".concat(displayStateDir, " permissions: ").concat(String(err_1)));
                    return [3 /*break*/, 9];
                case 9:
                    if (!(configPath && existsFile(configPath) && process.platform !== "win32")) return [3 /*break*/, 14];
                    _f.label = 10;
                case 10:
                    _f.trys.push([10, 13, , 14]);
                    stat = node_fs_1.default.statSync(configPath);
                    if (!((stat.mode & 63) !== 0)) return [3 /*break*/, 12];
                    warnings.push("- Config file is group/world readable (".concat(displayConfigPath !== null && displayConfigPath !== void 0 ? displayConfigPath : configPath, "). Recommend chmod 600."));
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Tighten permissions on ".concat(displayConfigPath !== null && displayConfigPath !== void 0 ? displayConfigPath : configPath, " to 600?"),
                            initialValue: true,
                        })];
                case 11:
                    tighten = _f.sent();
                    if (tighten) {
                        node_fs_1.default.chmodSync(configPath, 384);
                        changes.push("- Tightened permissions on ".concat(displayConfigPath !== null && displayConfigPath !== void 0 ? displayConfigPath : configPath, " to 600"));
                    }
                    _f.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_2 = _f.sent();
                    warnings.push("- Failed to read config permissions (".concat(displayConfigPath !== null && displayConfigPath !== void 0 ? displayConfigPath : configPath, "): ").concat(String(err_2)));
                    return [3 /*break*/, 14];
                case 14:
                    if (!stateDirExists) return [3 /*break*/, 20];
                    dirCandidates = new Map();
                    dirCandidates.set(sessionsDir, "Sessions dir");
                    dirCandidates.set(storeDir, "Session store dir");
                    dirCandidates.set(oauthDir, "OAuth dir");
                    displayDirFor = function (dir) {
                        if (dir === sessionsDir) {
                            return displaySessionsDir;
                        }
                        if (dir === storeDir) {
                            return displayStoreDir;
                        }
                        if (dir === oauthDir) {
                            return displayOauthDir;
                        }
                        return (0, utils_js_1.shortenHomePath)(dir);
                    };
                    _i = 0, dirCandidates_1 = dirCandidates;
                    _f.label = 15;
                case 15:
                    if (!(_i < dirCandidates_1.length)) return [3 /*break*/, 20];
                    _a = dirCandidates_1[_i], dir = _a[0], label = _a[1];
                    displayDir = displayDirFor(dir);
                    if (!!existsDir(dir)) return [3 /*break*/, 17];
                    warnings.push("- CRITICAL: ".concat(label, " missing (").concat(displayDir, ")."));
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Create ".concat(label, " at ").concat(displayDir, "?"),
                            initialValue: true,
                        })];
                case 16:
                    create = _f.sent();
                    if (create) {
                        created = ensureDir(dir);
                        if (created.ok) {
                            changes.push("- Created ".concat(label, ": ").concat(displayDir));
                        }
                        else {
                            warnings.push("- Failed to create ".concat(displayDir, ": ").concat(created.error));
                        }
                    }
                    return [3 /*break*/, 19];
                case 17:
                    if (!!canWriteDir(dir)) return [3 /*break*/, 19];
                    warnings.push("- ".concat(label, " not writable (").concat(displayDir, ")."));
                    hint = dirPermissionHint(dir);
                    if (hint) {
                        warnings.push("  ".concat(hint));
                    }
                    return [4 /*yield*/, prompter.confirmSkipInNonInteractive({
                            message: "Repair permissions on ".concat(label, "?"),
                            initialValue: true,
                        })];
                case 18:
                    repair = _f.sent();
                    if (repair) {
                        try {
                            stat = node_fs_1.default.statSync(dir);
                            target = addUserRwx(stat.mode);
                            node_fs_1.default.chmodSync(dir, target);
                            changes.push("- Repaired permissions on ".concat(label, ": ").concat(displayDir));
                        }
                        catch (err) {
                            warnings.push("- Failed to repair ".concat(displayDir, ": ").concat(String(err)));
                        }
                    }
                    _f.label = 19;
                case 19:
                    _i++;
                    return [3 /*break*/, 15];
                case 20:
                    extraStateDirs = new Set();
                    if (node_path_1.default.resolve(stateDir) !== node_path_1.default.resolve(defaultStateDir)) {
                        if (existsDir(defaultStateDir)) {
                            extraStateDirs.add(defaultStateDir);
                        }
                    }
                    for (_b = 0, _c = findOtherStateDirs(stateDir); _b < _c.length; _b++) {
                        other = _c[_b];
                        extraStateDirs.add(other);
                    }
                    if (extraStateDirs.size > 0) {
                        warnings.push(__spreadArray(__spreadArray([
                            "- Multiple state directories detected. This can split session history."
                        ], Array.from(extraStateDirs).map(function (dir) { return "  - ".concat((0, utils_js_1.shortenHomePath)(dir)); }), true), [
                            "  Active state dir: ".concat(displayStateDir),
                        ], false).join("\n"));
                    }
                    store = (0, sessions_js_1.loadSessionStore)(storePath);
                    entries = Object.entries(store).filter(function (_a) {
                        var entry = _a[1];
                        return entry && typeof entry === "object";
                    });
                    if (entries.length > 0) {
                        recent = entries
                            .slice()
                            .toSorted(function (a, b) {
                            var aUpdated = typeof a[1].updatedAt === "number" ? a[1].updatedAt : 0;
                            var bUpdated = typeof b[1].updatedAt === "number" ? b[1].updatedAt : 0;
                            return bUpdated - aUpdated;
                        })
                            .slice(0, 5);
                        missing = recent.filter(function (_a) {
                            var entry = _a[1];
                            var sessionId = entry.sessionId;
                            if (!sessionId) {
                                return false;
                            }
                            var transcriptPath = (0, sessions_js_1.resolveSessionFilePath)(sessionId, entry, {
                                agentId: agentId,
                            });
                            return !existsFile(transcriptPath);
                        });
                        if (missing.length > 0) {
                            warnings.push("- ".concat(missing.length, "/").concat(recent.length, " recent sessions are missing transcripts. Check for deleted session files or split state dirs."));
                        }
                        mainKey = (0, sessions_js_1.resolveMainSessionKey)(cfg);
                        mainEntry = store[mainKey];
                        if (mainEntry === null || mainEntry === void 0 ? void 0 : mainEntry.sessionId) {
                            transcriptPath = (0, sessions_js_1.resolveSessionFilePath)(mainEntry.sessionId, mainEntry, { agentId: agentId });
                            if (!existsFile(transcriptPath)) {
                                warnings.push("- Main session transcript missing (".concat((0, utils_js_1.shortenHomePath)(transcriptPath), "). History will appear to reset."));
                            }
                            else {
                                lineCount = countJsonlLines(transcriptPath);
                                if (lineCount <= 1) {
                                    warnings.push("- Main session transcript has only ".concat(lineCount, " line. Session history may not be appending."));
                                }
                            }
                        }
                    }
                    if (warnings.length > 0) {
                        (0, note_js_1.note)(warnings.join("\n"), "State integrity");
                    }
                    if (changes.length > 0) {
                        (0, note_js_1.note)(changes.join("\n"), "Doctor changes");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function noteWorkspaceBackupTip(workspaceDir) {
    if (!existsDir(workspaceDir)) {
        return;
    }
    var gitMarker = node_path_1.default.join(workspaceDir, ".git");
    if (node_fs_1.default.existsSync(gitMarker)) {
        return;
    }
    (0, note_js_1.note)([
        "- Tip: back up the workspace in a private git repo (GitHub or GitLab).",
        "- Keep ~/.openclaw out of git; it contains credentials and session history.",
        "- Details: /concepts/agent-workspace#git-backup-recommended",
    ].join("\n"), "Workspace");
}
