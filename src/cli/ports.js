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
exports.parseLsofOutput = parseLsofOutput;
exports.listPortListeners = listPortListeners;
exports.forceFreePort = forceFreePort;
exports.forceFreePortAndWait = forceFreePortAndWait;
var node_child_process_1 = require("node:child_process");
var ports_lsof_js_1 = require("../infra/ports-lsof.js");
var utils_js_1 = require("../utils.js");
function parseLsofOutput(output) {
    var lines = output.split(/\r?\n/).filter(Boolean);
    var results = [];
    var current = {};
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.startsWith("p")) {
            if (current.pid) {
                results.push(current);
            }
            current = { pid: Number.parseInt(line.slice(1), 10) };
        }
        else if (line.startsWith("c")) {
            current.command = line.slice(1);
        }
    }
    if (current.pid) {
        results.push(current);
    }
    return results;
}
function listPortListeners(port) {
    try {
        var lsof = (0, ports_lsof_js_1.resolveLsofCommandSync)();
        var out = (0, node_child_process_1.execFileSync)(lsof, ["-nP", "-iTCP:".concat(port), "-sTCP:LISTEN", "-FpFc"], {
            encoding: "utf-8",
        });
        return parseLsofOutput(out);
    }
    catch (err) {
        var status_1 = err.status;
        var code = err.code;
        if (code === "ENOENT") {
            throw new Error("lsof not found; required for --force", { cause: err });
        }
        if (status_1 === 1) {
            return [];
        } // no listeners
        throw err instanceof Error ? err : new Error(String(err));
    }
}
function forceFreePort(port) {
    var listeners = listPortListeners(port);
    for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
        var proc = listeners_1[_i];
        try {
            process.kill(proc.pid, "SIGTERM");
        }
        catch (err) {
            throw new Error("failed to kill pid ".concat(proc.pid).concat(proc.command ? " (".concat(proc.command, ")") : "", ": ").concat(String(err)), { cause: err });
        }
    }
    return listeners;
}
function killPids(listeners, signal) {
    for (var _i = 0, listeners_2 = listeners; _i < listeners_2.length; _i++) {
        var proc = listeners_2[_i];
        try {
            process.kill(proc.pid, signal);
        }
        catch (err) {
            throw new Error("failed to kill pid ".concat(proc.pid).concat(proc.command ? " (".concat(proc.command, ")") : "", ": ").concat(String(err)), { cause: err });
        }
    }
}
function forceFreePortAndWait(port_1) {
    return __awaiter(this, arguments, void 0, function (port, opts) {
        var timeoutMs, intervalMs, sigtermTimeoutMs, killed, waitedMs, triesSigterm, i, remaining, remainingBudget, triesSigkill, i, still;
        var _a, _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    timeoutMs = Math.max((_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 1500, 0);
                    intervalMs = Math.max((_b = opts.intervalMs) !== null && _b !== void 0 ? _b : 100, 1);
                    sigtermTimeoutMs = Math.min(Math.max((_c = opts.sigtermTimeoutMs) !== null && _c !== void 0 ? _c : 600, 0), timeoutMs);
                    killed = forceFreePort(port);
                    if (killed.length === 0) {
                        return [2 /*return*/, { killed: killed, waitedMs: 0, escalatedToSigkill: false }];
                    }
                    waitedMs = 0;
                    triesSigterm = intervalMs > 0 ? Math.ceil(sigtermTimeoutMs / intervalMs) : 0;
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < triesSigterm)) return [3 /*break*/, 4];
                    if (listPortListeners(port).length === 0) {
                        return [2 /*return*/, { killed: killed, waitedMs: waitedMs, escalatedToSigkill: false }];
                    }
                    return [4 /*yield*/, (0, utils_js_1.sleep)(intervalMs)];
                case 2:
                    _d.sent();
                    waitedMs += intervalMs;
                    _d.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (listPortListeners(port).length === 0) {
                        return [2 /*return*/, { killed: killed, waitedMs: waitedMs, escalatedToSigkill: false }];
                    }
                    remaining = listPortListeners(port);
                    killPids(remaining, "SIGKILL");
                    remainingBudget = Math.max(timeoutMs - waitedMs, 0);
                    triesSigkill = intervalMs > 0 ? Math.ceil(remainingBudget / intervalMs) : 0;
                    i = 0;
                    _d.label = 5;
                case 5:
                    if (!(i < triesSigkill)) return [3 /*break*/, 8];
                    if (listPortListeners(port).length === 0) {
                        return [2 /*return*/, { killed: killed, waitedMs: waitedMs, escalatedToSigkill: true }];
                    }
                    return [4 /*yield*/, (0, utils_js_1.sleep)(intervalMs)];
                case 6:
                    _d.sent();
                    waitedMs += intervalMs;
                    _d.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    still = listPortListeners(port);
                    if (still.length === 0) {
                        return [2 /*return*/, { killed: killed, waitedMs: waitedMs, escalatedToSigkill: true }];
                    }
                    throw new Error("port ".concat(port, " still has listeners after --force: ").concat(still.map(function (p) { return p.pid; }).join(", ")));
            }
        });
    });
}
