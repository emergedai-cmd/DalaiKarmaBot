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
var promises_1 = require("node:fs/promises");
var vitest_1 = require("vitest");
var test_helpers_js_1 = require("./test-helpers.js");
(0, vitest_1.describe)("config backup rotation", function () {
    (0, vitest_1.it)("keeps a 5-deep backup ring for config writes", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, test_helpers_js_1.withTempHome)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, resolveConfigPath, writeConfigFile, configPath, buildConfig, version, readName;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./config.js"); })];
                                case 1:
                                    _a = _b.sent(), resolveConfigPath = _a.resolveConfigPath, writeConfigFile = _a.writeConfigFile;
                                    configPath = resolveConfigPath();
                                    buildConfig = function (version) {
                                        return ({
                                            agents: { list: [{ id: "v".concat(version) }] },
                                        });
                                    };
                                    version = 0;
                                    _b.label = 2;
                                case 2:
                                    if (!(version <= 6)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, writeConfigFile(buildConfig(version))];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4:
                                    version += 1;
                                    return [3 /*break*/, 2];
                                case 5:
                                    readName = function () {
                                        var args_1 = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            args_1[_i] = arguments[_i];
                                        }
                                        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (suffix) {
                                            var raw;
                                            var _a, _b, _c, _d;
                                            if (suffix === void 0) { suffix = ""; }
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0: return [4 /*yield*/, promises_1.default.readFile("".concat(configPath).concat(suffix), "utf-8")];
                                                    case 1:
                                                        raw = _e.sent();
                                                        return [2 /*return*/, ((_d = (_c = (_b = (_a = JSON.parse(raw).agents) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null)];
                                                }
                                            });
                                        });
                                    };
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName()).resolves.toBe("v6")];
                                case 6:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName(".bak")).resolves.toBe("v5")];
                                case 7:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName(".bak.1")).resolves.toBe("v4")];
                                case 8:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName(".bak.2")).resolves.toBe("v3")];
                                case 9:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName(".bak.3")).resolves.toBe("v2")];
                                case 10:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(readName(".bak.4")).resolves.toBe("v1")];
                                case 11:
                                    _b.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat("".concat(configPath, ".bak.5"))).rejects.toThrow()];
                                case 12:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
