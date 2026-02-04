"use strict";
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
exports.hasHelpOrVersion = hasHelpOrVersion;
exports.hasFlag = hasFlag;
exports.getFlagValue = getFlagValue;
exports.getVerboseFlag = getVerboseFlag;
exports.getPositiveIntFlagValue = getPositiveIntFlagValue;
exports.getCommandPath = getCommandPath;
exports.getPrimaryCommand = getPrimaryCommand;
exports.buildParseArgv = buildParseArgv;
exports.shouldMigrateStateFromPath = shouldMigrateStateFromPath;
exports.shouldMigrateState = shouldMigrateState;
var HELP_FLAGS = new Set(["-h", "--help"]);
var VERSION_FLAGS = new Set(["-v", "-V", "--version"]);
var FLAG_TERMINATOR = "--";
function hasHelpOrVersion(argv) {
    return argv.some(function (arg) { return HELP_FLAGS.has(arg) || VERSION_FLAGS.has(arg); });
}
function isValueToken(arg) {
    if (!arg) {
        return false;
    }
    if (arg === FLAG_TERMINATOR) {
        return false;
    }
    if (!arg.startsWith("-")) {
        return true;
    }
    return /^-\d+(?:\.\d+)?$/.test(arg);
}
function parsePositiveInt(value) {
    var parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return undefined;
    }
    return parsed;
}
function hasFlag(argv, name) {
    var args = argv.slice(2);
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        if (arg === FLAG_TERMINATOR) {
            break;
        }
        if (arg === name) {
            return true;
        }
    }
    return false;
}
function getFlagValue(argv, name) {
    var args = argv.slice(2);
    for (var i = 0; i < args.length; i += 1) {
        var arg = args[i];
        if (arg === FLAG_TERMINATOR) {
            break;
        }
        if (arg === name) {
            var next = args[i + 1];
            return isValueToken(next) ? next : null;
        }
        if (arg.startsWith("".concat(name, "="))) {
            var value = arg.slice(name.length + 1);
            return value ? value : null;
        }
    }
    return undefined;
}
function getVerboseFlag(argv, options) {
    if (hasFlag(argv, "--verbose")) {
        return true;
    }
    if ((options === null || options === void 0 ? void 0 : options.includeDebug) && hasFlag(argv, "--debug")) {
        return true;
    }
    return false;
}
function getPositiveIntFlagValue(argv, name) {
    var raw = getFlagValue(argv, name);
    if (raw === null || raw === undefined) {
        return raw;
    }
    return parsePositiveInt(raw);
}
function getCommandPath(argv, depth) {
    if (depth === void 0) { depth = 2; }
    var args = argv.slice(2);
    var path = [];
    for (var i = 0; i < args.length; i += 1) {
        var arg = args[i];
        if (!arg) {
            continue;
        }
        if (arg === "--") {
            break;
        }
        if (arg.startsWith("-")) {
            continue;
        }
        path.push(arg);
        if (path.length >= depth) {
            break;
        }
    }
    return path;
}
function getPrimaryCommand(argv) {
    var primary = getCommandPath(argv, 1)[0];
    return primary !== null && primary !== void 0 ? primary : null;
}
function buildParseArgv(params) {
    var _a, _b, _c, _d;
    var baseArgv = params.rawArgs && params.rawArgs.length > 0
        ? params.rawArgs
        : params.fallbackArgv && params.fallbackArgv.length > 0
            ? params.fallbackArgv
            : process.argv;
    var programName = (_a = params.programName) !== null && _a !== void 0 ? _a : "";
    var normalizedArgv = programName && baseArgv[0] === programName
        ? baseArgv.slice(1)
        : ((_b = baseArgv[0]) === null || _b === void 0 ? void 0 : _b.endsWith("openclaw"))
            ? baseArgv.slice(1)
            : baseArgv;
    var executable = ((_d = (_c = normalizedArgv[0]) === null || _c === void 0 ? void 0 : _c.split(/[/\\]/).pop()) !== null && _d !== void 0 ? _d : "").toLowerCase();
    var looksLikeNode = normalizedArgv.length >= 2 && (isNodeExecutable(executable) || isBunExecutable(executable));
    if (looksLikeNode) {
        return normalizedArgv;
    }
    return __spreadArray(["node", programName || "openclaw"], normalizedArgv, true);
}
var nodeExecutablePattern = /^node-\d+(?:\.\d+)*(?:\.exe)?$/;
function isNodeExecutable(executable) {
    return (executable === "node" ||
        executable === "node.exe" ||
        executable === "nodejs" ||
        executable === "nodejs.exe" ||
        nodeExecutablePattern.test(executable));
}
function isBunExecutable(executable) {
    return executable === "bun" || executable === "bun.exe";
}
function shouldMigrateStateFromPath(path) {
    if (path.length === 0) {
        return true;
    }
    var primary = path[0], secondary = path[1];
    if (primary === "health" || primary === "status" || primary === "sessions") {
        return false;
    }
    if (primary === "memory" && secondary === "status") {
        return false;
    }
    if (primary === "agent") {
        return false;
    }
    return true;
}
function shouldMigrateState(argv) {
    return shouldMigrateStateFromPath(getCommandPath(argv, 2));
}
