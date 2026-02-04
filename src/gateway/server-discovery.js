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
exports.formatBonjourInstanceName = formatBonjourInstanceName;
exports.resolveBonjourCliPath = resolveBonjourCliPath;
exports.resolveTailnetDnsHint = resolveTailnetDnsHint;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var tailscale_js_1 = require("../infra/tailscale.js");
var exec_js_1 = require("../process/exec.js");
function formatBonjourInstanceName(displayName) {
    var trimmed = displayName.trim();
    if (!trimmed) {
        return "OpenClaw";
    }
    if (/openclaw/i.test(trimmed)) {
        return trimmed;
    }
    return "".concat(trimmed, " (OpenClaw)");
}
function resolveBonjourCliPath(opts) {
    var _a, _b, _c, _d, _e, _f;
    if (opts === void 0) { opts = {}; }
    var env = (_a = opts.env) !== null && _a !== void 0 ? _a : process.env;
    var envPath = (_b = env.OPENCLAW_CLI_PATH) === null || _b === void 0 ? void 0 : _b.trim();
    if (envPath) {
        return envPath;
    }
    var statSync = (_c = opts.statSync) !== null && _c !== void 0 ? _c : node_fs_1.default.statSync;
    var isFile = function (candidate) {
        try {
            return statSync(candidate).isFile();
        }
        catch (_a) {
            return false;
        }
    };
    var execPath = (_d = opts.execPath) !== null && _d !== void 0 ? _d : process.execPath;
    var execDir = node_path_1.default.dirname(execPath);
    var siblingCli = node_path_1.default.join(execDir, "openclaw");
    if (isFile(siblingCli)) {
        return siblingCli;
    }
    var argv = (_e = opts.argv) !== null && _e !== void 0 ? _e : process.argv;
    var argvPath = argv[1];
    if (argvPath && isFile(argvPath)) {
        return argvPath;
    }
    var cwd = (_f = opts.cwd) !== null && _f !== void 0 ? _f : process.cwd();
    var distCli = node_path_1.default.join(cwd, "dist", "index.js");
    if (isFile(distCli)) {
        return distCli;
    }
    var binCli = node_path_1.default.join(cwd, "bin", "openclaw");
    if (isFile(binCli)) {
        return binCli;
    }
    return undefined;
}
function resolveTailnetDnsHint(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var env, envRaw, envValue, exec, _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    env = (_b = opts === null || opts === void 0 ? void 0 : opts.env) !== null && _b !== void 0 ? _b : process.env;
                    envRaw = (_c = env.OPENCLAW_TAILNET_DNS) === null || _c === void 0 ? void 0 : _c.trim();
                    envValue = envRaw && envRaw.length > 0 ? envRaw.replace(/\.$/, "") : "";
                    if (envValue) {
                        return [2 /*return*/, envValue];
                    }
                    if ((opts === null || opts === void 0 ? void 0 : opts.enabled) === false) {
                        return [2 /*return*/, undefined];
                    }
                    exec = (_d = opts === null || opts === void 0 ? void 0 : opts.exec) !== null && _d !== void 0 ? _d : (function (command, args) { return (0, exec_js_1.runExec)(command, args, { timeoutMs: 1500, maxBuffer: 200000 }); });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, tailscale_js_1.getTailnetHostname)(exec)];
                case 2: return [2 /*return*/, _e.sent()];
                case 3:
                    _a = _e.sent();
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
