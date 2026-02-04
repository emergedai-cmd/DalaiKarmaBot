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
exports.withTempHome = withTempHome;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function snapshotEnv() {
    return {
        home: process.env.HOME,
        userProfile: process.env.USERPROFILE,
        homeDrive: process.env.HOMEDRIVE,
        homePath: process.env.HOMEPATH,
        stateDir: process.env.OPENCLAW_STATE_DIR,
    };
}
function restoreEnv(snapshot) {
    var restoreKey = function (key, value) {
        if (value === undefined) {
            delete process.env[key];
        }
        else {
            process.env[key] = value;
        }
    };
    restoreKey("HOME", snapshot.home);
    restoreKey("USERPROFILE", snapshot.userProfile);
    restoreKey("HOMEDRIVE", snapshot.homeDrive);
    restoreKey("HOMEPATH", snapshot.homePath);
    restoreKey("OPENCLAW_STATE_DIR", snapshot.stateDir);
}
function snapshotExtraEnv(keys) {
    var snapshot = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        snapshot[key] = process.env[key];
    }
    return snapshot;
}
function restoreExtraEnv(snapshot) {
    for (var _i = 0, _a = Object.entries(snapshot); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value === undefined) {
            delete process.env[key];
        }
        else {
            process.env[key] = value;
        }
    }
}
function setTempHome(base) {
    process.env.HOME = base;
    process.env.USERPROFILE = base;
    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(base, ".openclaw");
    if (process.platform !== "win32") {
        return;
    }
    var match = base.match(/^([A-Za-z]:)(.*)$/);
    if (!match) {
        return;
    }
    process.env.HOMEDRIVE = match[1];
    process.env.HOMEPATH = match[2] || "\\";
}
function withTempHome(fn_1) {
    return __awaiter(this, arguments, void 0, function (fn, opts) {
        var base, snapshot, envKeys, _i, envKeys_1, key, envSnapshot, _a, _b, _c, key, raw, value, _d;
        var _e, _f;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), (_e = opts.prefix) !== null && _e !== void 0 ? _e : "openclaw-test-home-"))];
                case 1:
                    base = _g.sent();
                    snapshot = snapshotEnv();
                    envKeys = Object.keys((_f = opts.env) !== null && _f !== void 0 ? _f : {});
                    for (_i = 0, envKeys_1 = envKeys; _i < envKeys_1.length; _i++) {
                        key = envKeys_1[_i];
                        if (key === "HOME" || key === "USERPROFILE" || key === "HOMEDRIVE" || key === "HOMEPATH") {
                            throw new Error("withTempHome: use built-in home env (got ".concat(key, ")"));
                        }
                    }
                    envSnapshot = snapshotExtraEnv(envKeys);
                    setTempHome(base);
                    return [4 /*yield*/, promises_1.default.mkdir(node_path_1.default.join(base, ".openclaw", "agents", "main", "sessions"), { recursive: true })];
                case 2:
                    _g.sent();
                    if (opts.env) {
                        for (_a = 0, _b = Object.entries(opts.env); _a < _b.length; _a++) {
                            _c = _b[_a], key = _c[0], raw = _c[1];
                            value = typeof raw === "function" ? raw(base) : raw;
                            if (value === undefined) {
                                delete process.env[key];
                            }
                            else {
                                process.env[key] = value;
                            }
                        }
                    }
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, , 5, 10]);
                    return [4 /*yield*/, fn(base)];
                case 4: return [2 /*return*/, _g.sent()];
                case 5:
                    restoreExtraEnv(envSnapshot);
                    restoreEnv(snapshot);
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, promises_1.default.rm(base, {
                            recursive: true,
                            force: true,
                            maxRetries: 10,
                            retryDelay: 50,
                        })];
                case 7:
                    _g.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _d = _g.sent();
                    return [3 /*break*/, 9];
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
