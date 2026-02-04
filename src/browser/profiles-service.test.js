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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var config_js_1 = require("./config.js");
var profiles_service_js_1 = require("./profiles-service.js");
vitest_1.vi.mock("../config/config.js", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { loadConfig: vitest_1.vi.fn(), writeConfigFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) })];
        }
    });
}); });
vitest_1.vi.mock("./trash.js", function () { return ({
    movePathToTrash: vitest_1.vi.fn(function (targetPath) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, targetPath];
    }); }); }),
}); });
vitest_1.vi.mock("./chrome.js", function () { return ({
    resolveOpenClawUserDataDir: vitest_1.vi.fn(function () { return "/tmp/openclaw-test/openclaw/user-data"; }),
}); });
var config_js_2 = require("../config/config.js");
var chrome_js_1 = require("./chrome.js");
var trash_js_1 = require("./trash.js");
function createCtx(resolved) {
    var _this = this;
    var state = {
        server: null,
        port: 0,
        resolved: resolved,
        profiles: new Map(),
    };
    var ctx = {
        state: function () { return state; },
        listProfiles: vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); }),
        forProfile: vitest_1.vi.fn(function () { return ({
            stopRunningBrowser: vitest_1.vi.fn(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ stopped: true })];
            }); }); }),
        }); }),
    };
    return { state: state, ctx: ctx };
}
(0, vitest_1.describe)("BrowserProfilesService", function () {
    (0, vitest_1.it)("allocates next local port for new profiles", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, _a, ctx, state, service, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resolved = (0, config_js_1.resolveBrowserConfig)({});
                    _a = createCtx(resolved), ctx = _a.ctx, state = _a.state;
                    vitest_1.vi.mocked(config_js_2.loadConfig).mockReturnValue({ browser: { profiles: {} } });
                    service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
                    return [4 /*yield*/, service.createProfile({ name: "work" })];
                case 1:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.cdpPort).toBe(18801);
                    (0, vitest_1.expect)(result.isRemote).toBe(false);
                    (0, vitest_1.expect)((_b = state.resolved.profiles.work) === null || _b === void 0 ? void 0 : _b.cdpPort).toBe(18801);
                    (0, vitest_1.expect)(config_js_2.writeConfigFile).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts per-profile cdpUrl for remote Chrome", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, ctx, service, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = (0, config_js_1.resolveBrowserConfig)({});
                    ctx = createCtx(resolved).ctx;
                    vitest_1.vi.mocked(config_js_2.loadConfig).mockReturnValue({ browser: { profiles: {} } });
                    service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
                    return [4 /*yield*/, service.createProfile({
                            name: "remote",
                            cdpUrl: "http://10.0.0.42:9222",
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.cdpUrl).toBe("http://10.0.0.42:9222");
                    (0, vitest_1.expect)(result.cdpPort).toBe(9222);
                    (0, vitest_1.expect)(result.isRemote).toBe(true);
                    (0, vitest_1.expect)(config_js_2.writeConfigFile).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        browser: vitest_1.expect.objectContaining({
                            profiles: vitest_1.expect.objectContaining({
                                remote: vitest_1.expect.objectContaining({
                                    cdpUrl: "http://10.0.0.42:9222",
                                }),
                            }),
                        }),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes remote profiles without stopping or removing local data", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, ctx, service, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = (0, config_js_1.resolveBrowserConfig)({
                        profiles: {
                            remote: { cdpUrl: "http://10.0.0.42:9222", color: "#0066CC" },
                        },
                    });
                    ctx = createCtx(resolved).ctx;
                    vitest_1.vi.mocked(config_js_2.loadConfig).mockReturnValue({
                        browser: {
                            defaultProfile: "openclaw",
                            profiles: {
                                openclaw: { cdpPort: 18800, color: "#FF4500" },
                                remote: { cdpUrl: "http://10.0.0.42:9222", color: "#0066CC" },
                            },
                        },
                    });
                    service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
                    return [4 /*yield*/, service.deleteProfile("remote")];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.deleted).toBe(false);
                    (0, vitest_1.expect)(ctx.forProfile).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(trash_js_1.movePathToTrash).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("deletes local profiles and moves data to Trash", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, ctx, tempDir, userDataDir, service, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolved = (0, config_js_1.resolveBrowserConfig)({
                        profiles: {
                            work: { cdpPort: 18801, color: "#0066CC" },
                        },
                    });
                    ctx = createCtx(resolved).ctx;
                    vitest_1.vi.mocked(config_js_2.loadConfig).mockReturnValue({
                        browser: {
                            defaultProfile: "openclaw",
                            profiles: {
                                openclaw: { cdpPort: 18800, color: "#FF4500" },
                                work: { cdpPort: 18801, color: "#0066CC" },
                            },
                        },
                    });
                    tempDir = node_fs_1.default.mkdtempSync(node_path_1.default.join("/tmp", "openclaw-profile-"));
                    userDataDir = node_path_1.default.join(tempDir, "work", "user-data");
                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(userDataDir), { recursive: true });
                    vitest_1.vi.mocked(chrome_js_1.resolveOpenClawUserDataDir).mockReturnValue(userDataDir);
                    service = (0, profiles_service_js_1.createBrowserProfilesService)(ctx);
                    return [4 /*yield*/, service.deleteProfile("work")];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.deleted).toBe(true);
                    (0, vitest_1.expect)(trash_js_1.movePathToTrash).toHaveBeenCalledWith(node_path_1.default.dirname(userDataDir));
                    return [2 /*return*/];
            }
        });
    }); });
});
