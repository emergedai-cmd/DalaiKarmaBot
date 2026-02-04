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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var io_js_1 = require("./io.js");
function withTempHome(run) {
    return __awaiter(this, void 0, void 0, function () {
        var home;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-config-"))];
                case 1:
                    home = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, run(home)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promises_1.default.rm(home, { recursive: true, force: true })];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function writeConfig(home_1, dirname_1, port_1) {
    return __awaiter(this, arguments, void 0, function (home, dirname, port, filename) {
        var dir, configPath;
        if (filename === void 0) { filename = "openclaw.json"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_path_1.default.join(home, dirname);
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    configPath = node_path_1.default.join(dir, filename);
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify({ gateway: { port: port } }, null, 2))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, configPath];
            }
        });
    });
}
(0, vitest_1.describe)("config io paths", function () {
    (0, vitest_1.it)("uses ~/.openclaw/openclaw.json when config exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var configPath, io;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeConfig(home, ".openclaw", 19001)];
                                case 1:
                                    configPath = _b.sent();
                                    io = (0, io_js_1.createConfigIO)({
                                        env: {},
                                        homedir: function () { return home; },
                                    });
                                    (0, vitest_1.expect)(io.configPath).toBe(configPath);
                                    (0, vitest_1.expect)((_a = io.loadConfig().gateway) === null || _a === void 0 ? void 0 : _a.port).toBe(19001);
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
    (0, vitest_1.it)("defaults to ~/.openclaw/openclaw.json when config is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var io;
                        return __generator(this, function (_a) {
                            io = (0, io_js_1.createConfigIO)({
                                env: {},
                                homedir: function () { return home; },
                            });
                            (0, vitest_1.expect)(io.configPath).toBe(node_path_1.default.join(home, ".openclaw", "openclaw.json"));
                            return [2 /*return*/];
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors explicit OPENCLAW_CONFIG_PATH override", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var customPath, io;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, writeConfig(home, ".openclaw", 20002, "custom.json")];
                                case 1:
                                    customPath = _b.sent();
                                    io = (0, io_js_1.createConfigIO)({
                                        env: { OPENCLAW_CONFIG_PATH: customPath },
                                        homedir: function () { return home; },
                                    });
                                    (0, vitest_1.expect)(io.configPath).toBe(customPath);
                                    (0, vitest_1.expect)((_a = io.loadConfig().gateway) === null || _a === void 0 ? void 0 : _a.port).toBe(20002);
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
