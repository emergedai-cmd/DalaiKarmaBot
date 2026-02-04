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
exports.getUpdateCheckResult = getUpdateCheckResult;
exports.resolveUpdateAvailability = resolveUpdateAvailability;
exports.formatUpdateAvailableHint = formatUpdateAvailableHint;
exports.formatUpdateOneLiner = formatUpdateOneLiner;
var command_format_js_1 = require("../cli/command-format.js");
var openclaw_root_js_1 = require("../infra/openclaw-root.js");
var update_check_js_1 = require("../infra/update-check.js");
var version_js_1 = require("../version.js");
function getUpdateCheckResult(params) {
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, openclaw_root_js_1.resolveOpenClawPackageRoot)({
                        moduleUrl: import.meta.url,
                        argv1: process.argv[1],
                        cwd: process.cwd(),
                    })];
                case 1:
                    root = _a.sent();
                    return [4 /*yield*/, (0, update_check_js_1.checkUpdateStatus)({
                            root: root,
                            timeoutMs: params.timeoutMs,
                            fetchGit: params.fetchGit,
                            includeRegistry: params.includeRegistry,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function resolveUpdateAvailability(update) {
    var _a, _b, _c;
    var latestVersion = (_b = (_a = update.registry) === null || _a === void 0 ? void 0 : _a.latestVersion) !== null && _b !== void 0 ? _b : null;
    var registryCmp = latestVersion ? (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, latestVersion) : null;
    var hasRegistryUpdate = registryCmp != null && registryCmp < 0;
    var gitBehind = update.installKind === "git" && typeof ((_c = update.git) === null || _c === void 0 ? void 0 : _c.behind) === "number"
        ? update.git.behind
        : null;
    var hasGitUpdate = gitBehind != null && gitBehind > 0;
    return {
        available: hasGitUpdate || hasRegistryUpdate,
        hasGitUpdate: hasGitUpdate,
        hasRegistryUpdate: hasRegistryUpdate,
        latestVersion: hasRegistryUpdate ? latestVersion : null,
        gitBehind: gitBehind,
    };
}
function formatUpdateAvailableHint(update) {
    var availability = resolveUpdateAvailability(update);
    if (!availability.available) {
        return null;
    }
    var details = [];
    if (availability.hasGitUpdate && availability.gitBehind != null) {
        details.push("git behind ".concat(availability.gitBehind));
    }
    if (availability.hasRegistryUpdate && availability.latestVersion) {
        details.push("npm ".concat(availability.latestVersion));
    }
    var suffix = details.length > 0 ? " (".concat(details.join(" · "), ")") : "";
    return "Update available".concat(suffix, ". Run: ").concat((0, command_format_js_1.formatCliCommand)("openclaw update"));
}
function formatUpdateOneLiner(update) {
    var _a, _b, _c, _d;
    var parts = [];
    if (update.installKind === "git" && update.git) {
        var branch = update.git.branch ? "git ".concat(update.git.branch) : "git";
        parts.push(branch);
        if (update.git.upstream) {
            parts.push("\u2194 ".concat(update.git.upstream));
        }
        if (update.git.dirty === true) {
            parts.push("dirty");
        }
        if (update.git.behind != null && update.git.ahead != null) {
            if (update.git.behind === 0 && update.git.ahead === 0) {
                parts.push("up to date");
            }
            else if (update.git.behind > 0 && update.git.ahead === 0) {
                parts.push("behind ".concat(update.git.behind));
            }
            else if (update.git.behind === 0 && update.git.ahead > 0) {
                parts.push("ahead ".concat(update.git.ahead));
            }
            else if (update.git.behind > 0 && update.git.ahead > 0) {
                parts.push("diverged (ahead ".concat(update.git.ahead, ", behind ").concat(update.git.behind, ")"));
            }
        }
        if (update.git.fetchOk === false) {
            parts.push("fetch failed");
        }
        if ((_a = update.registry) === null || _a === void 0 ? void 0 : _a.latestVersion) {
            var cmp = (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, update.registry.latestVersion);
            if (cmp === 0) {
                parts.push("npm latest ".concat(update.registry.latestVersion));
            }
            else if (cmp != null && cmp < 0) {
                parts.push("npm update ".concat(update.registry.latestVersion));
            }
            else {
                parts.push("npm latest ".concat(update.registry.latestVersion, " (local newer)"));
            }
        }
        else if ((_b = update.registry) === null || _b === void 0 ? void 0 : _b.error) {
            parts.push("npm latest unknown");
        }
    }
    else {
        parts.push(update.packageManager !== "unknown" ? update.packageManager : "pkg");
        if ((_c = update.registry) === null || _c === void 0 ? void 0 : _c.latestVersion) {
            var cmp = (0, update_check_js_1.compareSemverStrings)(version_js_1.VERSION, update.registry.latestVersion);
            if (cmp === 0) {
                parts.push("npm latest ".concat(update.registry.latestVersion));
            }
            else if (cmp != null && cmp < 0) {
                parts.push("npm update ".concat(update.registry.latestVersion));
            }
            else {
                parts.push("npm latest ".concat(update.registry.latestVersion, " (local newer)"));
            }
        }
        else if ((_d = update.registry) === null || _d === void 0 ? void 0 : _d.error) {
            parts.push("npm latest unknown");
        }
    }
    if (update.deps) {
        if (update.deps.status === "ok") {
            parts.push("deps ok");
        }
        if (update.deps.status === "missing") {
            parts.push("deps missing");
        }
        if (update.deps.status === "stale") {
            parts.push("deps stale");
        }
    }
    return "Update: ".concat(parts.join(" · "));
}
