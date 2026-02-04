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
exports.parseSshConfigOutput = parseSshConfigOutput;
exports.resolveSshConfig = resolveSshConfig;
var node_child_process_1 = require("node:child_process");
function parsePort(value) {
    if (!value) {
        return undefined;
    }
    var parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return undefined;
    }
    return parsed;
}
function parseSshConfigOutput(output) {
    var result = { identityFiles: [] };
    var lines = output.split("\n");
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var raw = lines_1[_i];
        var line = raw.trim();
        if (!line) {
            continue;
        }
        var _a = line.split(/\s+/), key = _a[0], rest = _a.slice(1);
        var value = rest.join(" ").trim();
        if (!key || !value) {
            continue;
        }
        switch (key) {
            case "user":
                result.user = value;
                break;
            case "hostname":
                result.host = value;
                break;
            case "port":
                result.port = parsePort(value);
                break;
            case "identityfile":
                if (value !== "none") {
                    result.identityFiles.push(value);
                }
                break;
            default:
                break;
        }
    }
    return result;
}
function resolveSshConfig(target_1) {
    return __awaiter(this, arguments, void 0, function (target, opts) {
        var sshPath, args, userHost;
        var _a;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sshPath = "/usr/bin/ssh";
                    args = ["-G"];
                    if (target.port > 0 && target.port !== 22) {
                        args.push("-p", String(target.port));
                    }
                    if ((_a = opts.identity) === null || _a === void 0 ? void 0 : _a.trim()) {
                        args.push("-i", opts.identity.trim());
                    }
                    userHost = target.user ? "".concat(target.user, "@").concat(target.host) : target.host;
                    // Use "--" so userHost can't be parsed as an ssh option.
                    args.push("--", userHost);
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var _a, _b, _c;
                            var child = (0, node_child_process_1.spawn)(sshPath, args, {
                                stdio: ["ignore", "pipe", "ignore"],
                            });
                            var stdout = "";
                            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf8");
                            (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("data", function (chunk) {
                                stdout += String(chunk);
                            });
                            var timeoutMs = Math.max(200, (_c = opts.timeoutMs) !== null && _c !== void 0 ? _c : 800);
                            var timer = setTimeout(function () {
                                try {
                                    child.kill("SIGKILL");
                                }
                                finally {
                                    resolve(null);
                                }
                            }, timeoutMs);
                            child.once("error", function () {
                                clearTimeout(timer);
                                resolve(null);
                            });
                            child.once("exit", function (code) {
                                clearTimeout(timer);
                                if (code !== 0 || !stdout.trim()) {
                                    resolve(null);
                                    return;
                                }
                                resolve(parseSshConfigOutput(stdout));
                            });
                        })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
