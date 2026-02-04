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
var vitest_1 = require("vitest");
vitest_1.vi.mock("node:child_process", function () { return ({
    execFileSync: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("node:fs", function () {
    var existsSync = vitest_1.vi.fn();
    var readFileSync = vitest_1.vi.fn();
    return {
        existsSync: existsSync,
        readFileSync: readFileSync,
        default: { existsSync: existsSync, readFileSync: readFileSync },
    };
});
var node_child_process_1 = require("node:child_process");
var fs = require("node:fs");
(0, vitest_1.describe)("browser default executable detection", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.resetModules();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("prefers default Chromium browser on macOS", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveBrowserExecutableForPlatform, exe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(node_child_process_1.execFileSync).mockImplementation(function (cmd, args) {
                        var argsStr = Array.isArray(args) ? args.join(" ") : "";
                        if (cmd === "/usr/bin/plutil" && argsStr.includes("LSHandlers")) {
                            return JSON.stringify([
                                { LSHandlerURLScheme: "http", LSHandlerRoleAll: "com.google.Chrome" },
                            ]);
                        }
                        if (cmd === "/usr/bin/osascript" && argsStr.includes("path to application id")) {
                            return "/Applications/Google Chrome.app";
                        }
                        if (cmd === "/usr/bin/defaults") {
                            return "Google Chrome";
                        }
                        return "";
                    });
                    vitest_1.vi.mocked(fs.existsSync).mockImplementation(function (p) {
                        var value = String(p);
                        if (value.includes("com.apple.launchservices.secure.plist")) {
                            return true;
                        }
                        return value.includes("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./chrome.executables.js"); })];
                case 1:
                    resolveBrowserExecutableForPlatform = (_a.sent()).resolveBrowserExecutableForPlatform;
                    exe = resolveBrowserExecutableForPlatform({}, "darwin");
                    (0, vitest_1.expect)(exe === null || exe === void 0 ? void 0 : exe.path).toContain("Google Chrome.app/Contents/MacOS/Google Chrome");
                    (0, vitest_1.expect)(exe === null || exe === void 0 ? void 0 : exe.kind).toBe("chrome");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back when default browser is non-Chromium on macOS", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveBrowserExecutableForPlatform, exe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(node_child_process_1.execFileSync).mockImplementation(function (cmd, args) {
                        var argsStr = Array.isArray(args) ? args.join(" ") : "";
                        if (cmd === "/usr/bin/plutil" && argsStr.includes("LSHandlers")) {
                            return JSON.stringify([
                                { LSHandlerURLScheme: "http", LSHandlerRoleAll: "com.apple.Safari" },
                            ]);
                        }
                        return "";
                    });
                    vitest_1.vi.mocked(fs.existsSync).mockImplementation(function (p) {
                        var value = String(p);
                        if (value.includes("com.apple.launchservices.secure.plist")) {
                            return true;
                        }
                        return value.includes("Google Chrome.app/Contents/MacOS/Google Chrome");
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./chrome.executables.js"); })];
                case 1:
                    resolveBrowserExecutableForPlatform = (_a.sent()).resolveBrowserExecutableForPlatform;
                    exe = resolveBrowserExecutableForPlatform({}, "darwin");
                    (0, vitest_1.expect)(exe === null || exe === void 0 ? void 0 : exe.path).toContain("Google Chrome.app/Contents/MacOS/Google Chrome");
                    return [2 /*return*/];
            }
        });
    }); });
});
