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
exports.resolveWindowsUserPrincipal = resolveWindowsUserPrincipal;
exports.parseIcaclsOutput = parseIcaclsOutput;
exports.summarizeWindowsAcl = summarizeWindowsAcl;
exports.inspectWindowsAcl = inspectWindowsAcl;
exports.formatWindowsAclSummary = formatWindowsAclSummary;
exports.formatIcaclsResetCommand = formatIcaclsResetCommand;
exports.createIcaclsResetCommand = createIcaclsResetCommand;
var node_os_1 = require("node:os");
var exec_js_1 = require("../process/exec.js");
var INHERIT_FLAGS = new Set(["I", "OI", "CI", "IO", "NP"]);
var WORLD_PRINCIPALS = new Set([
    "everyone",
    "users",
    "builtin\\users",
    "authenticated users",
    "nt authority\\authenticated users",
]);
var TRUSTED_BASE = new Set([
    "nt authority\\system",
    "system",
    "builtin\\administrators",
    "creator owner",
]);
var WORLD_SUFFIXES = ["\\users", "\\authenticated users"];
var TRUSTED_SUFFIXES = ["\\administrators", "\\system"];
var normalize = function (value) { return value.trim().toLowerCase(); };
function resolveWindowsUserPrincipal(env) {
    var _a, _b, _c;
    var username = ((_a = env === null || env === void 0 ? void 0 : env.USERNAME) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = node_os_1.default.userInfo().username) === null || _b === void 0 ? void 0 : _b.trim());
    if (!username) {
        return null;
    }
    var domain = (_c = env === null || env === void 0 ? void 0 : env.USERDOMAIN) === null || _c === void 0 ? void 0 : _c.trim();
    return domain ? "".concat(domain, "\\").concat(username) : username;
}
function buildTrustedPrincipals(env) {
    var trusted = new Set(TRUSTED_BASE);
    var principal = resolveWindowsUserPrincipal(env);
    if (principal) {
        trusted.add(normalize(principal));
        var parts = principal.split("\\");
        var userOnly = parts.at(-1);
        if (userOnly) {
            trusted.add(normalize(userOnly));
        }
    }
    return trusted;
}
function classifyPrincipal(principal, env) {
    var normalized = normalize(principal);
    var trusted = buildTrustedPrincipals(env);
    if (trusted.has(normalized) || TRUSTED_SUFFIXES.some(function (s) { return normalized.endsWith(s); })) {
        return "trusted";
    }
    if (WORLD_PRINCIPALS.has(normalized) || WORLD_SUFFIXES.some(function (s) { return normalized.endsWith(s); })) {
        return "world";
    }
    return "group";
}
function rightsFromTokens(tokens) {
    var upper = tokens.join("").toUpperCase();
    var canWrite = upper.includes("F") || upper.includes("M") || upper.includes("W") || upper.includes("D");
    var canRead = upper.includes("F") || upper.includes("M") || upper.includes("R");
    return { canRead: canRead, canWrite: canWrite };
}
function parseIcaclsOutput(output, targetPath) {
    var _a, _b;
    var entries = [];
    var normalizedTarget = targetPath.trim();
    var lowerTarget = normalizedTarget.toLowerCase();
    var quotedTarget = "\"".concat(normalizedTarget, "\"");
    var quotedLower = quotedTarget.toLowerCase();
    for (var _i = 0, _c = output.split(/\r?\n/); _i < _c.length; _i++) {
        var rawLine = _c[_i];
        var line = rawLine.trimEnd();
        if (!line.trim()) {
            continue;
        }
        var trimmed = line.trim();
        var lower = trimmed.toLowerCase();
        if (lower.startsWith("successfully processed") ||
            lower.startsWith("processed") ||
            lower.startsWith("failed processing") ||
            lower.startsWith("no mapping between account names")) {
            continue;
        }
        var entry = trimmed;
        if (lower.startsWith(lowerTarget)) {
            entry = trimmed.slice(normalizedTarget.length).trim();
        }
        else if (lower.startsWith(quotedLower)) {
            entry = trimmed.slice(quotedTarget.length).trim();
        }
        if (!entry) {
            continue;
        }
        var idx = entry.indexOf(":");
        if (idx === -1) {
            continue;
        }
        var principal = entry.slice(0, idx).trim();
        var rawRights = entry.slice(idx + 1).trim();
        var tokens = (_b = (_a = rawRights
            .match(/\(([^)]+)\)/g)) === null || _a === void 0 ? void 0 : _a.map(function (token) { return token.slice(1, -1).trim(); }).filter(Boolean)) !== null && _b !== void 0 ? _b : [];
        if (tokens.some(function (token) { return token.toUpperCase() === "DENY"; })) {
            continue;
        }
        var rights = tokens.filter(function (token) { return !INHERIT_FLAGS.has(token.toUpperCase()); });
        if (rights.length === 0) {
            continue;
        }
        var _d = rightsFromTokens(rights), canRead = _d.canRead, canWrite = _d.canWrite;
        entries.push({ principal: principal, rights: rights, rawRights: rawRights, canRead: canRead, canWrite: canWrite });
    }
    return entries;
}
function summarizeWindowsAcl(entries, env) {
    var trusted = [];
    var untrustedWorld = [];
    var untrustedGroup = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var classification = classifyPrincipal(entry.principal, env);
        if (classification === "trusted") {
            trusted.push(entry);
        }
        else if (classification === "world") {
            untrustedWorld.push(entry);
        }
        else {
            untrustedGroup.push(entry);
        }
    }
    return { trusted: trusted, untrustedWorld: untrustedWorld, untrustedGroup: untrustedGroup };
}
function inspectWindowsAcl(targetPath, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var exec, _a, stdout, stderr, output, entries, _b, trusted, untrustedWorld, untrustedGroup, err_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    exec = (_c = opts === null || opts === void 0 ? void 0 : opts.exec) !== null && _c !== void 0 ? _c : exec_js_1.runExec;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exec("icacls", [targetPath])];
                case 2:
                    _a = _d.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    output = "".concat(stdout, "\n").concat(stderr).trim();
                    entries = parseIcaclsOutput(output, targetPath);
                    _b = summarizeWindowsAcl(entries, opts === null || opts === void 0 ? void 0 : opts.env), trusted = _b.trusted, untrustedWorld = _b.untrustedWorld, untrustedGroup = _b.untrustedGroup;
                    return [2 /*return*/, { ok: true, entries: entries, trusted: trusted, untrustedWorld: untrustedWorld, untrustedGroup: untrustedGroup }];
                case 3:
                    err_1 = _d.sent();
                    return [2 /*return*/, {
                            ok: false,
                            entries: [],
                            trusted: [],
                            untrustedWorld: [],
                            untrustedGroup: [],
                            error: String(err_1),
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function formatWindowsAclSummary(summary) {
    if (!summary.ok) {
        return "unknown";
    }
    var untrusted = __spreadArray(__spreadArray([], summary.untrustedWorld, true), summary.untrustedGroup, true);
    if (untrusted.length === 0) {
        return "trusted-only";
    }
    return untrusted.map(function (entry) { return "".concat(entry.principal, ":").concat(entry.rawRights); }).join(", ");
}
function formatIcaclsResetCommand(targetPath, opts) {
    var _a;
    var user = (_a = resolveWindowsUserPrincipal(opts.env)) !== null && _a !== void 0 ? _a : "%USERNAME%";
    var grant = opts.isDir ? "(OI)(CI)F" : "F";
    return "icacls \"".concat(targetPath, "\" /inheritance:r /grant:r \"").concat(user, ":").concat(grant, "\" /grant:r \"SYSTEM:").concat(grant, "\"");
}
function createIcaclsResetCommand(targetPath, opts) {
    var user = resolveWindowsUserPrincipal(opts.env);
    if (!user) {
        return null;
    }
    var grant = opts.isDir ? "(OI)(CI)F" : "F";
    var args = [
        targetPath,
        "/inheritance:r",
        "/grant:r",
        "".concat(user, ":").concat(grant),
        "/grant:r",
        "SYSTEM:".concat(grant),
    ];
    return { command: "icacls", args: args, display: formatIcaclsResetCommand(targetPath, opts) };
}
