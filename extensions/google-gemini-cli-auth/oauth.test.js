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
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
// Mock fs module before importing the module under test
var mockExistsSync = vitest_1.vi.fn();
var mockReadFileSync = vitest_1.vi.fn();
var mockRealpathSync = vitest_1.vi.fn();
var mockReaddirSync = vitest_1.vi.fn();
vitest_1.vi.mock("node:fs", function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, importOriginal()];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { existsSync: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return mockExistsSync.apply(void 0, args);
                        }, readFileSync: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return mockReadFileSync.apply(void 0, args);
                        }, realpathSync: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return mockRealpathSync.apply(void 0, args);
                        }, readdirSync: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return mockReaddirSync.apply(void 0, args);
                        } })];
        }
    });
}); });
(0, vitest_1.describe)("extractGeminiCliCredentials", function () {
    var normalizePath = function (value) {
        return value.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
    };
    var rootDir = (0, node_path_1.parse)(process.cwd()).root || "/";
    var FAKE_CLIENT_ID = "123456789-abcdef.apps.googleusercontent.com";
    var FAKE_CLIENT_SECRET = "GOCSPX-FakeSecretValue123";
    var FAKE_OAUTH2_CONTENT = "\n    const clientId = \"".concat(FAKE_CLIENT_ID, "\";\n    const clientSecret = \"").concat(FAKE_CLIENT_SECRET, "\";\n  ");
    var originalPath;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            vitest_1.vi.resetModules();
            vitest_1.vi.clearAllMocks();
            originalPath = process.env.PATH;
            return [2 /*return*/];
        });
    }); });
    (0, vitest_1.afterEach)(function () {
        process.env.PATH = originalPath;
    });
    (0, vitest_1.it)("returns null when gemini binary is not in PATH", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, extractGeminiCliCredentials, clearCredentialsCache;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    process.env.PATH = "/nonexistent";
                    mockExistsSync.mockReturnValue(false);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./oauth.js"); })];
                case 1:
                    _a = _b.sent(), extractGeminiCliCredentials = _a.extractGeminiCliCredentials, clearCredentialsCache = _a.clearCredentialsCache;
                    clearCredentialsCache();
                    (0, vitest_1.expect)(extractGeminiCliCredentials()).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("extracts credentials from oauth2.js in known path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeBinDir, fakeGeminiPath, fakeResolvedPath, fakeOauth2Path, _a, extractGeminiCliCredentials, clearCredentialsCache, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fakeBinDir = (0, node_path_1.join)(rootDir, "fake", "bin");
                    fakeGeminiPath = (0, node_path_1.join)(fakeBinDir, "gemini");
                    fakeResolvedPath = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "dist", "index.js");
                    fakeOauth2Path = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js");
                    process.env.PATH = fakeBinDir;
                    mockExistsSync.mockImplementation(function (p) {
                        var normalized = normalizePath(p);
                        if (normalized === normalizePath(fakeGeminiPath)) {
                            return true;
                        }
                        if (normalized === normalizePath(fakeOauth2Path)) {
                            return true;
                        }
                        return false;
                    });
                    mockRealpathSync.mockReturnValue(fakeResolvedPath);
                    mockReadFileSync.mockReturnValue(FAKE_OAUTH2_CONTENT);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./oauth.js"); })];
                case 1:
                    _a = _b.sent(), extractGeminiCliCredentials = _a.extractGeminiCliCredentials, clearCredentialsCache = _a.clearCredentialsCache;
                    clearCredentialsCache();
                    result = extractGeminiCliCredentials();
                    (0, vitest_1.expect)(result).toEqual({
                        clientId: FAKE_CLIENT_ID,
                        clientSecret: FAKE_CLIENT_SECRET,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when oauth2.js cannot be found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeBinDir, fakeGeminiPath, fakeResolvedPath, _a, extractGeminiCliCredentials, clearCredentialsCache;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fakeBinDir = (0, node_path_1.join)(rootDir, "fake", "bin");
                    fakeGeminiPath = (0, node_path_1.join)(fakeBinDir, "gemini");
                    fakeResolvedPath = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "dist", "index.js");
                    process.env.PATH = fakeBinDir;
                    mockExistsSync.mockImplementation(function (p) { return normalizePath(p) === normalizePath(fakeGeminiPath); });
                    mockRealpathSync.mockReturnValue(fakeResolvedPath);
                    mockReaddirSync.mockReturnValue([]); // Empty directory for recursive search
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./oauth.js"); })];
                case 1:
                    _a = _b.sent(), extractGeminiCliCredentials = _a.extractGeminiCliCredentials, clearCredentialsCache = _a.clearCredentialsCache;
                    clearCredentialsCache();
                    (0, vitest_1.expect)(extractGeminiCliCredentials()).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when oauth2.js lacks credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeBinDir, fakeGeminiPath, fakeResolvedPath, fakeOauth2Path, _a, extractGeminiCliCredentials, clearCredentialsCache;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fakeBinDir = (0, node_path_1.join)(rootDir, "fake", "bin");
                    fakeGeminiPath = (0, node_path_1.join)(fakeBinDir, "gemini");
                    fakeResolvedPath = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "dist", "index.js");
                    fakeOauth2Path = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js");
                    process.env.PATH = fakeBinDir;
                    mockExistsSync.mockImplementation(function (p) {
                        var normalized = normalizePath(p);
                        if (normalized === normalizePath(fakeGeminiPath)) {
                            return true;
                        }
                        if (normalized === normalizePath(fakeOauth2Path)) {
                            return true;
                        }
                        return false;
                    });
                    mockRealpathSync.mockReturnValue(fakeResolvedPath);
                    mockReadFileSync.mockReturnValue("// no credentials here");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./oauth.js"); })];
                case 1:
                    _a = _b.sent(), extractGeminiCliCredentials = _a.extractGeminiCliCredentials, clearCredentialsCache = _a.clearCredentialsCache;
                    clearCredentialsCache();
                    (0, vitest_1.expect)(extractGeminiCliCredentials()).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caches credentials after first extraction", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeBinDir, fakeGeminiPath, fakeResolvedPath, fakeOauth2Path, _a, extractGeminiCliCredentials, clearCredentialsCache, result1, readCount, result2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fakeBinDir = (0, node_path_1.join)(rootDir, "fake", "bin");
                    fakeGeminiPath = (0, node_path_1.join)(fakeBinDir, "gemini");
                    fakeResolvedPath = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "dist", "index.js");
                    fakeOauth2Path = (0, node_path_1.join)(rootDir, "fake", "lib", "node_modules", "@google", "gemini-cli", "node_modules", "@google", "gemini-cli-core", "dist", "src", "code_assist", "oauth2.js");
                    process.env.PATH = fakeBinDir;
                    mockExistsSync.mockImplementation(function (p) {
                        var normalized = normalizePath(p);
                        if (normalized === normalizePath(fakeGeminiPath)) {
                            return true;
                        }
                        if (normalized === normalizePath(fakeOauth2Path)) {
                            return true;
                        }
                        return false;
                    });
                    mockRealpathSync.mockReturnValue(fakeResolvedPath);
                    mockReadFileSync.mockReturnValue(FAKE_OAUTH2_CONTENT);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./oauth.js"); })];
                case 1:
                    _a = _b.sent(), extractGeminiCliCredentials = _a.extractGeminiCliCredentials, clearCredentialsCache = _a.clearCredentialsCache;
                    clearCredentialsCache();
                    result1 = extractGeminiCliCredentials();
                    (0, vitest_1.expect)(result1).not.toBeNull();
                    readCount = mockReadFileSync.mock.calls.length;
                    result2 = extractGeminiCliCredentials();
                    (0, vitest_1.expect)(result2).toEqual(result1);
                    (0, vitest_1.expect)(mockReadFileSync.mock.calls.length).toBe(readCount);
                    return [2 /*return*/];
            }
        });
    }); });
});
