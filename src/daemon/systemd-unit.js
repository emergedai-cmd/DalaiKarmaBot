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
exports.buildSystemdUnit = buildSystemdUnit;
exports.parseSystemdExecStart = parseSystemdExecStart;
exports.parseSystemdEnvAssignment = parseSystemdEnvAssignment;
function systemdEscapeArg(value) {
    if (!/[\\s"\\\\]/.test(value)) {
        return value;
    }
    return "\"".concat(value.replace(/\\\\/g, "\\\\\\\\").replace(/"/g, '\\\\"'), "\"");
}
function renderEnvLines(env) {
    if (!env) {
        return [];
    }
    var entries = Object.entries(env).filter(function (_a) {
        var value = _a[1];
        return typeof value === "string" && value.trim();
    });
    if (entries.length === 0) {
        return [];
    }
    return entries.map(function (_a) {
        var _b;
        var key = _a[0], value = _a[1];
        return "Environment=".concat(systemdEscapeArg("".concat(key, "=").concat((_b = value === null || value === void 0 ? void 0 : value.trim()) !== null && _b !== void 0 ? _b : "")));
    });
}
function buildSystemdUnit(_a) {
    var description = _a.description, programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, environment = _a.environment;
    var execStart = programArguments.map(systemdEscapeArg).join(" ");
    var descriptionLine = "Description=".concat((description === null || description === void 0 ? void 0 : description.trim()) || "OpenClaw Gateway");
    var workingDirLine = workingDirectory
        ? "WorkingDirectory=".concat(systemdEscapeArg(workingDirectory))
        : null;
    var envLines = renderEnvLines(environment);
    return __spreadArray(__spreadArray([
        "[Unit]",
        descriptionLine,
        "After=network-online.target",
        "Wants=network-online.target",
        "",
        "[Service]",
        "ExecStart=".concat(execStart),
        "Restart=always",
        "RestartSec=5",
        // KillMode=process ensures systemd only waits for the main process to exit.
        // Without this, podman's conmon (container monitor) processes block shutdown
        // since they run as children of the gateway and stay in the same cgroup.
        "KillMode=process",
        workingDirLine
    ], envLines, true), [
        "",
        "[Install]",
        "WantedBy=default.target",
        "",
    ], false).filter(function (line) { return line !== null; })
        .join("\n");
}
function parseSystemdExecStart(value) {
    var args = [];
    var current = "";
    var inQuotes = false;
    var escapeNext = false;
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var char = value_1[_i];
        if (escapeNext) {
            current += char;
            escapeNext = false;
            continue;
        }
        if (char === "\\\\") {
            escapeNext = true;
            continue;
        }
        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (!inQuotes && /\s/.test(char)) {
            if (current) {
                args.push(current);
                current = "";
            }
            continue;
        }
        current += char;
    }
    if (current) {
        args.push(current);
    }
    return args;
}
function parseSystemdEnvAssignment(raw) {
    var trimmed = raw.trim();
    if (!trimmed) {
        return null;
    }
    var unquoted = (function () {
        if (!(trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            return trimmed;
        }
        var out = "";
        var escapeNext = false;
        for (var _i = 0, _a = trimmed.slice(1, -1); _i < _a.length; _i++) {
            var ch = _a[_i];
            if (escapeNext) {
                out += ch;
                escapeNext = false;
                continue;
            }
            if (ch === "\\\\") {
                escapeNext = true;
                continue;
            }
            out += ch;
        }
        return out;
    })();
    var eq = unquoted.indexOf("=");
    if (eq <= 0) {
        return null;
    }
    var key = unquoted.slice(0, eq).trim();
    if (!key) {
        return null;
    }
    var value = unquoted.slice(eq + 1);
    return { key: key, value: value };
}
