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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixSecurityFootguns = fixSecurityFootguns;
var json5_1 = require("json5");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var includes_js_1 = require("../config/includes.js");
var paths_js_1 = require("../config/paths.js");
var pairing_store_js_1 = require("../pairing/pairing-store.js");
var exec_js_1 = require("../process/exec.js");
var session_key_js_1 = require("../routing/session-key.js");
var windows_acl_js_1 = require("./windows-acl.js");
function safeChmod(params) {
    return __awaiter(this, void 0, void 0, function () {
        var st, current, err_1, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.lstat(params.path)];
                case 1:
                    st = _a.sent();
                    if (st.isSymbolicLink()) {
                        return [2 /*return*/, {
                                kind: "chmod",
                                path: params.path,
                                mode: params.mode,
                                ok: false,
                                skipped: "symlink",
                            }];
                    }
                    if (params.require === "dir" && !st.isDirectory()) {
                        return [2 /*return*/, {
                                kind: "chmod",
                                path: params.path,
                                mode: params.mode,
                                ok: false,
                                skipped: "not-a-directory",
                            }];
                    }
                    if (params.require === "file" && !st.isFile()) {
                        return [2 /*return*/, {
                                kind: "chmod",
                                path: params.path,
                                mode: params.mode,
                                ok: false,
                                skipped: "not-a-file",
                            }];
                    }
                    current = st.mode & 511;
                    if (current === params.mode) {
                        return [2 /*return*/, {
                                kind: "chmod",
                                path: params.path,
                                mode: params.mode,
                                ok: false,
                                skipped: "already",
                            }];
                    }
                    return [4 /*yield*/, promises_1.default.chmod(params.path, params.mode)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { kind: "chmod", path: params.path, mode: params.mode, ok: true }];
                case 3:
                    err_1 = _a.sent();
                    code = err_1.code;
                    if (code === "ENOENT") {
                        return [2 /*return*/, {
                                kind: "chmod",
                                path: params.path,
                                mode: params.mode,
                                ok: false,
                                skipped: "missing",
                            }];
                    }
                    return [2 /*return*/, {
                            kind: "chmod",
                            path: params.path,
                            mode: params.mode,
                            ok: false,
                            error: String(err_1),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function safeAclReset(params) {
    return __awaiter(this, void 0, void 0, function () {
        var display, st, cmd, exec, err_2, code;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    display = (0, windows_acl_js_1.formatIcaclsResetCommand)(params.path, {
                        isDir: params.require === "dir",
                        env: params.env,
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.lstat(params.path)];
                case 2:
                    st = _b.sent();
                    if (st.isSymbolicLink()) {
                        return [2 /*return*/, {
                                kind: "icacls",
                                path: params.path,
                                command: display,
                                ok: false,
                                skipped: "symlink",
                            }];
                    }
                    if (params.require === "dir" && !st.isDirectory()) {
                        return [2 /*return*/, {
                                kind: "icacls",
                                path: params.path,
                                command: display,
                                ok: false,
                                skipped: "not-a-directory",
                            }];
                    }
                    if (params.require === "file" && !st.isFile()) {
                        return [2 /*return*/, {
                                kind: "icacls",
                                path: params.path,
                                command: display,
                                ok: false,
                                skipped: "not-a-file",
                            }];
                    }
                    cmd = (0, windows_acl_js_1.createIcaclsResetCommand)(params.path, {
                        isDir: st.isDirectory(),
                        env: params.env,
                    });
                    if (!cmd) {
                        return [2 /*return*/, {
                                kind: "icacls",
                                path: params.path,
                                command: display,
                                ok: false,
                                skipped: "missing-user",
                            }];
                    }
                    exec = (_a = params.exec) !== null && _a !== void 0 ? _a : exec_js_1.runExec;
                    return [4 /*yield*/, exec(cmd.command, cmd.args)];
                case 3:
                    _b.sent();
                    return [2 /*return*/, { kind: "icacls", path: params.path, command: cmd.display, ok: true }];
                case 4:
                    err_2 = _b.sent();
                    code = err_2.code;
                    if (code === "ENOENT") {
                        return [2 /*return*/, {
                                kind: "icacls",
                                path: params.path,
                                command: display,
                                ok: false,
                                skipped: "missing",
                            }];
                    }
                    return [2 /*return*/, {
                            kind: "icacls",
                            path: params.path,
                            command: display,
                            ok: false,
                            error: String(err_2),
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function setGroupPolicyAllowlist(params) {
    if (!params.cfg.channels) {
        return;
    }
    var section = params.cfg.channels[params.channel];
    if (!section || typeof section !== "object") {
        return;
    }
    var topPolicy = section.groupPolicy;
    if (topPolicy === "open") {
        section.groupPolicy = "allowlist";
        params.changes.push("channels.".concat(params.channel, ".groupPolicy=open -> allowlist"));
        params.policyFlips.add("channels.".concat(params.channel, "."));
    }
    var accounts = section.accounts;
    if (!accounts || typeof accounts !== "object") {
        return;
    }
    for (var _i = 0, _a = Object.entries(accounts); _i < _a.length; _i++) {
        var _b = _a[_i], accountId = _b[0], accountValue = _b[1];
        if (!accountId) {
            continue;
        }
        if (!accountValue || typeof accountValue !== "object") {
            continue;
        }
        var account = accountValue;
        if (account.groupPolicy === "open") {
            account.groupPolicy = "allowlist";
            params.changes.push("channels.".concat(params.channel, ".accounts.").concat(accountId, ".groupPolicy=open -> allowlist"));
            params.policyFlips.add("channels.".concat(params.channel, ".accounts.").concat(accountId, "."));
        }
    }
}
function setWhatsAppGroupAllowFromFromStore(params) {
    var _a;
    var section = (_a = params.cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp;
    if (!section || typeof section !== "object") {
        return;
    }
    if (params.storeAllowFrom.length === 0) {
        return;
    }
    var maybeApply = function (prefix, obj) {
        if (!params.policyFlips.has(prefix)) {
            return;
        }
        var allowFrom = Array.isArray(obj.allowFrom) ? obj.allowFrom : [];
        var groupAllowFrom = Array.isArray(obj.groupAllowFrom) ? obj.groupAllowFrom : [];
        if (allowFrom.length > 0) {
            return;
        }
        if (groupAllowFrom.length > 0) {
            return;
        }
        obj.groupAllowFrom = params.storeAllowFrom;
        params.changes.push("".concat(prefix, "groupAllowFrom=pairing-store"));
    };
    maybeApply("channels.whatsapp.", section);
    var accounts = section.accounts;
    if (!accounts || typeof accounts !== "object") {
        return;
    }
    for (var _i = 0, _b = Object.entries(accounts); _i < _b.length; _i++) {
        var _c = _b[_i], accountId = _c[0], accountValue = _c[1];
        if (!accountValue || typeof accountValue !== "object") {
            continue;
        }
        var account = accountValue;
        maybeApply("channels.whatsapp.accounts.".concat(accountId, "."), account);
    }
}
function applyConfigFixes(params) {
    var _a, _b;
    var next = structuredClone((_a = params.cfg) !== null && _a !== void 0 ? _a : {});
    var changes = [];
    var policyFlips = new Set();
    if (((_b = next.logging) === null || _b === void 0 ? void 0 : _b.redactSensitive) === "off") {
        next.logging = __assign(__assign({}, next.logging), { redactSensitive: "tools" });
        changes.push('logging.redactSensitive=off -> "tools"');
    }
    for (var _i = 0, _c = [
        "telegram",
        "whatsapp",
        "discord",
        "signal",
        "imessage",
        "slack",
        "msteams",
    ]; _i < _c.length; _i++) {
        var channel = _c[_i];
        setGroupPolicyAllowlist({ cfg: next, channel: channel, changes: changes, policyFlips: policyFlips });
    }
    return { cfg: next, changes: changes, policyFlips: policyFlips };
}
function listDirectIncludes(parsed) {
    var out = [];
    var visit = function (value) {
        if (!value) {
            return;
        }
        if (Array.isArray(value)) {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                visit(item);
            }
            return;
        }
        if (typeof value !== "object") {
            return;
        }
        var rec = value;
        var includeVal = rec[includes_js_1.INCLUDE_KEY];
        if (typeof includeVal === "string") {
            out.push(includeVal);
        }
        else if (Array.isArray(includeVal)) {
            for (var _a = 0, includeVal_1 = includeVal; _a < includeVal_1.length; _a++) {
                var item = includeVal_1[_a];
                if (typeof item === "string") {
                    out.push(item);
                }
            }
        }
        for (var _b = 0, _c = Object.values(rec); _b < _c.length; _b++) {
            var v = _c[_b];
            visit(v);
        }
    };
    visit(parsed);
    return out;
}
function resolveIncludePath(baseConfigPath, includePath) {
    return node_path_1.default.normalize(node_path_1.default.isAbsolute(includePath)
        ? includePath
        : node_path_1.default.resolve(node_path_1.default.dirname(baseConfigPath), includePath));
}
function collectIncludePathsRecursive(params) {
    return __awaiter(this, void 0, void 0, function () {
        var visited, result, walk;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    visited = new Set();
                    result = [];
                    walk = function (basePath, parsed, depth) { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1, _i, _a, raw;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (depth > includes_js_1.MAX_INCLUDE_DEPTH) {
                                        return [2 /*return*/];
                                    }
                                    _loop_1 = function (raw) {
                                        var resolved, rawText, nestedParsed;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    resolved = resolveIncludePath(basePath, raw);
                                                    if (visited.has(resolved)) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    visited.add(resolved);
                                                    result.push(resolved);
                                                    return [4 /*yield*/, promises_1.default.readFile(resolved, "utf-8").catch(function () { return null; })];
                                                case 1:
                                                    rawText = _c.sent();
                                                    if (!rawText) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    nestedParsed = (function () {
                                                        try {
                                                            return json5_1.default.parse(rawText);
                                                        }
                                                        catch (_a) {
                                                            return null;
                                                        }
                                                    })();
                                                    if (!nestedParsed) return [3 /*break*/, 3];
                                                    // eslint-disable-next-line no-await-in-loop
                                                    return [4 /*yield*/, walk(resolved, nestedParsed, depth + 1)];
                                                case 2:
                                                    // eslint-disable-next-line no-await-in-loop
                                                    _c.sent();
                                                    _c.label = 3;
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, _a = listDirectIncludes(parsed);
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    raw = _a[_i];
                                    return [5 /*yield**/, _loop_1(raw)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, walk(params.configPath, params.parsed, 0)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function chmodCredentialsAndAgentState(params) {
    return __awaiter(this, void 0, void 0, function () {
        var credsDir, _a, _b, credsEntries, _i, credsEntries_1, entry, p, _c, _d, ids, list, _e, _f, agent, id, _g, ids_1, agentId, normalizedAgentId, agentRoot, agentDir, sessionsDir, _h, _j, _k, _l, authPath, _m, _o, _p, _q, storePath, _r, _s;
        var _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    credsDir = (0, paths_js_1.resolveOAuthDir)(params.env, params.stateDir);
                    _b = (_a = params.actions).push;
                    return [4 /*yield*/, safeChmod({ path: credsDir, mode: 448, require: "dir" })];
                case 1:
                    _b.apply(_a, [_v.sent()]);
                    return [4 /*yield*/, promises_1.default.readdir(credsDir, { withFileTypes: true }).catch(function () { return []; })];
                case 2:
                    credsEntries = _v.sent();
                    _i = 0, credsEntries_1 = credsEntries;
                    _v.label = 3;
                case 3:
                    if (!(_i < credsEntries_1.length)) return [3 /*break*/, 6];
                    entry = credsEntries_1[_i];
                    if (!entry.isFile()) {
                        return [3 /*break*/, 5];
                    }
                    if (!entry.name.endsWith(".json")) {
                        return [3 /*break*/, 5];
                    }
                    p = node_path_1.default.join(credsDir, entry.name);
                    // eslint-disable-next-line no-await-in-loop
                    _d = (_c = params.actions).push;
                    return [4 /*yield*/, safeChmod({ path: p, mode: 384, require: "file" })];
                case 4:
                    // eslint-disable-next-line no-await-in-loop
                    _d.apply(_c, [_v.sent()]);
                    _v.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    ids = new Set();
                    ids.add((0, agent_scope_js_1.resolveDefaultAgentId)(params.cfg));
                    list = Array.isArray((_t = params.cfg.agents) === null || _t === void 0 ? void 0 : _t.list) ? (_u = params.cfg.agents) === null || _u === void 0 ? void 0 : _u.list : [];
                    for (_e = 0, _f = list !== null && list !== void 0 ? list : []; _e < _f.length; _e++) {
                        agent = _f[_e];
                        if (!agent || typeof agent !== "object") {
                            continue;
                        }
                        id = typeof agent.id === "string" ? agent.id.trim() : "";
                        if (id) {
                            ids.add(id);
                        }
                    }
                    _g = 0, ids_1 = ids;
                    _v.label = 7;
                case 7:
                    if (!(_g < ids_1.length)) return [3 /*break*/, 14];
                    agentId = ids_1[_g];
                    normalizedAgentId = (0, session_key_js_1.normalizeAgentId)(agentId);
                    agentRoot = node_path_1.default.join(params.stateDir, "agents", normalizedAgentId);
                    agentDir = node_path_1.default.join(agentRoot, "agent");
                    sessionsDir = node_path_1.default.join(agentRoot, "sessions");
                    // eslint-disable-next-line no-await-in-loop
                    _j = (_h = params.actions).push;
                    return [4 /*yield*/, safeChmod({ path: agentRoot, mode: 448, require: "dir" })];
                case 8:
                    // eslint-disable-next-line no-await-in-loop
                    _j.apply(_h, [_v.sent()]);
                    // eslint-disable-next-line no-await-in-loop
                    _l = (_k = params.actions).push;
                    return [4 /*yield*/, params.applyPerms({ path: agentDir, mode: 448, require: "dir" })];
                case 9:
                    // eslint-disable-next-line no-await-in-loop
                    _l.apply(_k, [_v.sent()]);
                    authPath = node_path_1.default.join(agentDir, "auth-profiles.json");
                    // eslint-disable-next-line no-await-in-loop
                    _o = (_m = params.actions).push;
                    return [4 /*yield*/, params.applyPerms({ path: authPath, mode: 384, require: "file" })];
                case 10:
                    // eslint-disable-next-line no-await-in-loop
                    _o.apply(_m, [_v.sent()]);
                    // eslint-disable-next-line no-await-in-loop
                    _q = (_p = params.actions).push;
                    return [4 /*yield*/, params.applyPerms({ path: sessionsDir, mode: 448, require: "dir" })];
                case 11:
                    // eslint-disable-next-line no-await-in-loop
                    _q.apply(_p, [_v.sent()]);
                    storePath = node_path_1.default.join(sessionsDir, "sessions.json");
                    // eslint-disable-next-line no-await-in-loop
                    _s = (_r = params.actions).push;
                    return [4 /*yield*/, params.applyPerms({ path: storePath, mode: 384, require: "file" })];
                case 12:
                    // eslint-disable-next-line no-await-in-loop
                    _s.apply(_r, [_v.sent()]);
                    _v.label = 13;
                case 13:
                    _g++;
                    return [3 /*break*/, 7];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function fixSecurityFootguns(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var env, platform, exec, isWindows, stateDir, configPath, actions, errors, io, snap, configWritten, changes, fixed, whatsappStoreAllowFrom, err_3, applyPerms, _a, _b, _c, _d, includePaths, _i, includePaths_1, p, _e, _f;
        var _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    env = (_g = opts === null || opts === void 0 ? void 0 : opts.env) !== null && _g !== void 0 ? _g : process.env;
                    platform = (_h = opts === null || opts === void 0 ? void 0 : opts.platform) !== null && _h !== void 0 ? _h : process.platform;
                    exec = (_j = opts === null || opts === void 0 ? void 0 : opts.exec) !== null && _j !== void 0 ? _j : exec_js_1.runExec;
                    isWindows = platform === "win32";
                    stateDir = (_k = opts === null || opts === void 0 ? void 0 : opts.stateDir) !== null && _k !== void 0 ? _k : (0, paths_js_1.resolveStateDir)(env);
                    configPath = (_l = opts === null || opts === void 0 ? void 0 : opts.configPath) !== null && _l !== void 0 ? _l : (0, paths_js_1.resolveConfigPath)(env, stateDir);
                    actions = [];
                    errors = [];
                    io = (0, config_js_1.createConfigIO)({ env: env, configPath: configPath });
                    return [4 /*yield*/, io.readConfigFileSnapshot()];
                case 1:
                    snap = _o.sent();
                    if (!snap.valid) {
                        errors.push.apply(errors, snap.issues.map(function (i) { return "".concat(i.path, ": ").concat(i.message); }));
                    }
                    configWritten = false;
                    changes = [];
                    if (!snap.valid) return [3 /*break*/, 6];
                    fixed = applyConfigFixes({ cfg: snap.config, env: env });
                    changes = fixed.changes;
                    return [4 /*yield*/, (0, pairing_store_js_1.readChannelAllowFromStore)("whatsapp", env).catch(function () { return []; })];
                case 2:
                    whatsappStoreAllowFrom = _o.sent();
                    if (whatsappStoreAllowFrom.length > 0) {
                        setWhatsAppGroupAllowFromFromStore({
                            cfg: fixed.cfg,
                            storeAllowFrom: whatsappStoreAllowFrom,
                            changes: changes,
                            policyFlips: fixed.policyFlips,
                        });
                    }
                    if (!(changes.length > 0)) return [3 /*break*/, 6];
                    _o.label = 3;
                case 3:
                    _o.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, io.writeConfigFile(fixed.cfg)];
                case 4:
                    _o.sent();
                    configWritten = true;
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _o.sent();
                    errors.push("writeConfigFile failed: ".concat(String(err_3)));
                    return [3 /*break*/, 6];
                case 6:
                    applyPerms = function (params) {
                        return isWindows
                            ? safeAclReset({ path: params.path, require: params.require, env: env, exec: exec })
                            : safeChmod({ path: params.path, mode: params.mode, require: params.require });
                    };
                    _b = (_a = actions).push;
                    return [4 /*yield*/, applyPerms({ path: stateDir, mode: 448, require: "dir" })];
                case 7:
                    _b.apply(_a, [_o.sent()]);
                    _d = (_c = actions).push;
                    return [4 /*yield*/, applyPerms({ path: configPath, mode: 384, require: "file" })];
                case 8:
                    _d.apply(_c, [_o.sent()]);
                    if (!snap.exists) return [3 /*break*/, 13];
                    return [4 /*yield*/, collectIncludePathsRecursive({
                            configPath: snap.path,
                            parsed: snap.parsed,
                        }).catch(function () { return []; })];
                case 9:
                    includePaths = _o.sent();
                    _i = 0, includePaths_1 = includePaths;
                    _o.label = 10;
                case 10:
                    if (!(_i < includePaths_1.length)) return [3 /*break*/, 13];
                    p = includePaths_1[_i];
                    // eslint-disable-next-line no-await-in-loop
                    _f = (_e = actions).push;
                    return [4 /*yield*/, applyPerms({ path: p, mode: 384, require: "file" })];
                case 11:
                    // eslint-disable-next-line no-await-in-loop
                    _f.apply(_e, [_o.sent()]);
                    _o.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, chmodCredentialsAndAgentState({
                        env: env,
                        stateDir: stateDir,
                        cfg: (_m = snap.config) !== null && _m !== void 0 ? _m : {},
                        actions: actions,
                        applyPerms: applyPerms,
                    }).catch(function (err) {
                        errors.push("chmodCredentialsAndAgentState failed: ".concat(String(err)));
                    })];
                case 14:
                    _o.sent();
                    return [2 /*return*/, {
                            ok: errors.length === 0,
                            stateDir: stateDir,
                            configPath: configPath,
                            configWritten: configWritten,
                            changes: changes,
                            actions: actions,
                            errors: errors,
                        }];
            }
        });
    });
}
