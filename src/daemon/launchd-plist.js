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
exports.readLaunchAgentProgramArgumentsFromFile = readLaunchAgentProgramArgumentsFromFile;
exports.buildLaunchAgentPlist = buildLaunchAgentPlist;
var promises_1 = require("node:fs/promises");
var plistEscape = function (value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
};
var plistUnescape = function (value) {
    return value
        .replaceAll("&apos;", "'")
        .replaceAll("&quot;", '"')
        .replaceAll("&gt;", ">")
        .replaceAll("&lt;", "<")
        .replaceAll("&amp;", "&");
};
var renderEnvDict = function (env) {
    if (!env) {
        return "";
    }
    var entries = Object.entries(env).filter(function (_a) {
        var value = _a[1];
        return typeof value === "string" && value.trim();
    });
    if (entries.length === 0) {
        return "";
    }
    var items = entries
        .map(function (_a) {
        var _b;
        var key = _a[0], value = _a[1];
        return "\n    <key>".concat(plistEscape(key), "</key>\n    <string>").concat(plistEscape((_b = value === null || value === void 0 ? void 0 : value.trim()) !== null && _b !== void 0 ? _b : ""), "</string>");
    })
        .join("");
    return "\n    <key>EnvironmentVariables</key>\n    <dict>".concat(items, "\n    </dict>");
};
function readLaunchAgentProgramArgumentsFromFile(plistPath) {
    return __awaiter(this, void 0, void 0, function () {
        var plist, programMatch, args, workingDirMatch, workingDirectory, envMatch, environment, _i, _a, pair, key, value, _b;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(plistPath, "utf8")];
                case 1:
                    plist = _f.sent();
                    programMatch = plist.match(/<key>ProgramArguments<\/key>\s*<array>([\s\S]*?)<\/array>/i);
                    if (!programMatch) {
                        return [2 /*return*/, null];
                    }
                    args = Array.from(programMatch[1].matchAll(/<string>([\s\S]*?)<\/string>/gi)).map(function (match) { var _a; return plistUnescape((_a = match[1]) !== null && _a !== void 0 ? _a : "").trim(); });
                    workingDirMatch = plist.match(/<key>WorkingDirectory<\/key>\s*<string>([\s\S]*?)<\/string>/i);
                    workingDirectory = workingDirMatch ? plistUnescape((_c = workingDirMatch[1]) !== null && _c !== void 0 ? _c : "").trim() : "";
                    envMatch = plist.match(/<key>EnvironmentVariables<\/key>\s*<dict>([\s\S]*?)<\/dict>/i);
                    environment = {};
                    if (envMatch) {
                        for (_i = 0, _a = envMatch[1].matchAll(/<key>([\s\S]*?)<\/key>\s*<string>([\s\S]*?)<\/string>/gi); _i < _a.length; _i++) {
                            pair = _a[_i];
                            key = plistUnescape((_d = pair[1]) !== null && _d !== void 0 ? _d : "").trim();
                            if (!key) {
                                continue;
                            }
                            value = plistUnescape((_e = pair[2]) !== null && _e !== void 0 ? _e : "").trim();
                            environment[key] = value;
                        }
                    }
                    return [2 /*return*/, __assign(__assign(__assign({ programArguments: args.filter(Boolean) }, (workingDirectory ? { workingDirectory: workingDirectory } : {})), (Object.keys(environment).length > 0 ? { environment: environment } : {})), { sourcePath: plistPath })];
                case 2:
                    _b = _f.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function buildLaunchAgentPlist(_a) {
    var label = _a.label, comment = _a.comment, programArguments = _a.programArguments, workingDirectory = _a.workingDirectory, stdoutPath = _a.stdoutPath, stderrPath = _a.stderrPath, environment = _a.environment;
    var argsXml = programArguments
        .map(function (arg) { return "\n      <string>".concat(plistEscape(arg), "</string>"); })
        .join("");
    var workingDirXml = workingDirectory
        ? "\n    <key>WorkingDirectory</key>\n    <string>".concat(plistEscape(workingDirectory), "</string>")
        : "";
    var commentXml = (comment === null || comment === void 0 ? void 0 : comment.trim())
        ? "\n    <key>Comment</key>\n    <string>".concat(plistEscape(comment.trim()), "</string>")
        : "";
    var envXml = renderEnvDict(environment);
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n  <dict>\n    <key>Label</key>\n    <string>".concat(plistEscape(label), "</string>\n    ").concat(commentXml, "\n    <key>RunAtLoad</key>\n    <true/>\n    <key>KeepAlive</key>\n    <true/>\n    <key>ProgramArguments</key>\n    <array>").concat(argsXml, "\n    </array>\n    ").concat(workingDirXml, "\n    <key>StandardOutPath</key>\n    <string>").concat(plistEscape(stdoutPath), "</string>\n    <key>StandardErrorPath</key>\n    <string>").concat(plistEscape(stderrPath), "</string>").concat(envXml, "\n  </dict>\n</plist>\n");
}
