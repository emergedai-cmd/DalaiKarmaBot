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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var dotenv_js_1 = require("./dotenv.js");
function writeEnvFile(filePath, contents) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.dirname(filePath), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(filePath, contents, "utf8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("loadDotEnv", function () {
    (0, vitest_1.it)("loads ~/.openclaw/.env as fallback without overriding CWD .env", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevEnv, prevCwd, base, cwdDir, stateDir, _i, _a, key, _b, _c, _d, key, value;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    prevEnv = __assign({}, process.env);
                    prevCwd = process.cwd();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-dotenv-test-"))];
                case 1:
                    base = _e.sent();
                    cwdDir = node_path_1.default.join(base, "cwd");
                    stateDir = node_path_1.default.join(base, "state");
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    return [4 /*yield*/, writeEnvFile(node_path_1.default.join(stateDir, ".env"), "FOO=from-global\nBAR=1\n")];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, writeEnvFile(node_path_1.default.join(cwdDir, ".env"), "FOO=from-cwd\n")];
                case 3:
                    _e.sent();
                    process.chdir(cwdDir);
                    delete process.env.FOO;
                    delete process.env.BAR;
                    (0, dotenv_js_1.loadDotEnv)({ quiet: true });
                    (0, vitest_1.expect)(process.env.FOO).toBe("from-cwd");
                    (0, vitest_1.expect)(process.env.BAR).toBe("1");
                    process.chdir(prevCwd);
                    for (_i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (!(key in prevEnv)) {
                            delete process.env[key];
                        }
                    }
                    for (_b = 0, _c = Object.entries(prevEnv); _b < _c.length; _b++) {
                        _d = _c[_b], key = _d[0], value = _d[1];
                        if (value === undefined) {
                            delete process.env[key];
                        }
                        else {
                            process.env[key] = value;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not override an already-set env var from the shell", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prevEnv, prevCwd, base, cwdDir, stateDir, _i, _a, key, _b, _c, _d, key, value;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    prevEnv = __assign({}, process.env);
                    prevCwd = process.cwd();
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-dotenv-test-"))];
                case 1:
                    base = _e.sent();
                    cwdDir = node_path_1.default.join(base, "cwd");
                    stateDir = node_path_1.default.join(base, "state");
                    process.env.OPENCLAW_STATE_DIR = stateDir;
                    process.env.FOO = "from-shell";
                    return [4 /*yield*/, writeEnvFile(node_path_1.default.join(stateDir, ".env"), "FOO=from-global\n")];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, writeEnvFile(node_path_1.default.join(cwdDir, ".env"), "FOO=from-cwd\n")];
                case 3:
                    _e.sent();
                    process.chdir(cwdDir);
                    (0, dotenv_js_1.loadDotEnv)({ quiet: true });
                    (0, vitest_1.expect)(process.env.FOO).toBe("from-shell");
                    process.chdir(prevCwd);
                    for (_i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (!(key in prevEnv)) {
                            delete process.env[key];
                        }
                    }
                    for (_b = 0, _c = Object.entries(prevEnv); _b < _c.length; _b++) {
                        _d = _c[_b], key = _d[0], value = _d[1];
                        if (value === undefined) {
                            delete process.env[key];
                        }
                        else {
                            process.env[key] = value;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
