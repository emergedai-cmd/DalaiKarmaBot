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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var copyToClipboard = vitest_1.vi.fn();
var runtime = {
    log: vitest_1.vi.fn(),
    error: vitest_1.vi.fn(),
    exit: vitest_1.vi.fn(),
};
vitest_1.vi.mock("../infra/clipboard.js", function () { return ({
    copyToClipboard: copyToClipboard,
}); });
vitest_1.vi.mock("../runtime.js", function () { return ({
    defaultRuntime: runtime,
}); });
(0, vitest_1.describe)("browser extension install", function () {
    (0, vitest_1.it)("installs into the state dir (never node_modules)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tmp, installChromeExtension, sourceDir, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmp = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-ext-"));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./browser-cli-extension.js"); })];
                case 1:
                    installChromeExtension = (_a.sent()).installChromeExtension;
                    sourceDir = node_path_1.default.resolve(process.cwd(), "assets/chrome-extension");
                    return [4 /*yield*/, installChromeExtension({ stateDir: tmp, sourceDir: sourceDir })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.path).toBe(node_path_1.default.join(tmp, "browser", "chrome-extension"));
                    (0, vitest_1.expect)(node_fs_1.default.existsSync(node_path_1.default.join(result.path, "manifest.json"))).toBe(true);
                    (0, vitest_1.expect)(result.path.includes("node_modules")).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("copies extension path to clipboard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prev, tmp, dir, Command, registerBrowserExtensionCommands, program, browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = process.env.OPENCLAW_STATE_DIR;
                    tmp = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-ext-path-"));
                    process.env.OPENCLAW_STATE_DIR = tmp;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 6]);
                    copyToClipboard.mockReset();
                    copyToClipboard.mockResolvedValue(true);
                    runtime.log.mockReset();
                    runtime.error.mockReset();
                    runtime.exit.mockReset();
                    dir = node_path_1.default.join(tmp, "browser", "chrome-extension");
                    node_fs_1.default.mkdirSync(dir, { recursive: true });
                    node_fs_1.default.writeFileSync(node_path_1.default.join(dir, "manifest.json"), JSON.stringify({ manifest_version: 3 }));
                    vitest_1.vi.resetModules();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("commander"); })];
                case 2:
                    Command = (_a.sent()).Command;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./browser-cli-extension.js"); })];
                case 3:
                    registerBrowserExtensionCommands = (_a.sent()).registerBrowserExtensionCommands;
                    program = new Command();
                    browser = program.command("browser").option("--json", false);
                    registerBrowserExtensionCommands(browser, function (cmd) { var _a, _b; return (_b = (_a = cmd.parent) === null || _a === void 0 ? void 0 : _a.opts) === null || _b === void 0 ? void 0 : _b.call(_a); });
                    return [4 /*yield*/, program.parseAsync(["browser", "extension", "path"], { from: "user" })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(copyToClipboard).toHaveBeenCalledWith(dir);
                    return [3 /*break*/, 6];
                case 5:
                    if (prev === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prev;
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
