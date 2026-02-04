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
exports.readSystemdUserLingerStatus = readSystemdUserLingerStatus;
exports.enableSystemdUserLinger = enableSystemdUserLinger;
var node_os_1 = require("node:os");
var exec_js_1 = require("../process/exec.js");
function resolveLoginctlUser(env) {
    var _a, _b;
    var fromEnv = ((_a = env.USER) === null || _a === void 0 ? void 0 : _a.trim()) || ((_b = env.LOGNAME) === null || _b === void 0 ? void 0 : _b.trim());
    if (fromEnv) {
        return fromEnv;
    }
    try {
        return node_os_1.default.userInfo().username;
    }
    catch (_c) {
        return null;
    }
}
function readSystemdUserLingerStatus(env) {
    return __awaiter(this, void 0, void 0, function () {
        var user, stdout, line, value, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = resolveLoginctlUser(env);
                    if (!user) {
                        return [2 /*return*/, null];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, exec_js_1.runExec)("loginctl", ["show-user", user, "-p", "Linger"], {
                            timeoutMs: 5000,
                        })];
                case 2:
                    stdout = (_c.sent()).stdout;
                    line = stdout
                        .split("\n")
                        .map(function (entry) { return entry.trim(); })
                        .find(function (entry) { return entry.startsWith("Linger="); });
                    value = (_b = line === null || line === void 0 ? void 0 : line.split("=")[1]) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                    if (value === "yes" || value === "no") {
                        return [2 /*return*/, { user: user, linger: value }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
function enableSystemdUserLinger(params) {
    return __awaiter(this, void 0, void 0, function () {
        var user, needsSudo, sudoArgs, argv, result, error_1, message;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = (_a = params.user) !== null && _a !== void 0 ? _a : resolveLoginctlUser(params.env);
                    if (!user) {
                        return [2 /*return*/, { ok: false, stdout: "", stderr: "Missing user", code: 1 }];
                    }
                    needsSudo = typeof process.getuid === "function" ? process.getuid() !== 0 : true;
                    sudoArgs = needsSudo && params.sudoMode !== undefined
                        ? __spreadArray(["sudo"], (params.sudoMode === "non-interactive" ? ["-n"] : []), true) : [];
                    argv = __spreadArray(__spreadArray([], sudoArgs, true), ["loginctl", "enable-linger", user], false);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, exec_js_1.runCommandWithTimeout)(argv, { timeoutMs: 30000 })];
                case 2:
                    result = _c.sent();
                    return [2 /*return*/, {
                            ok: result.code === 0,
                            stdout: result.stdout,
                            stderr: result.stderr,
                            code: (_b = result.code) !== null && _b !== void 0 ? _b : 1,
                        }];
                case 3:
                    error_1 = _c.sent();
                    message = error_1 instanceof Error ? error_1.message : String(error_1);
                    return [2 /*return*/, { ok: false, stdout: "", stderr: message, code: 1 }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
