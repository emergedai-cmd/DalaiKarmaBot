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
var tempDirs = [];
function makeTempDir() {
    return __awaiter(this, void 0, void 0, function () {
        var dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-hooks-e2e-"))];
                case 1:
                    dir = _a.sent();
                    tempDirs.push(dir);
                    return [2 /*return*/, dir];
            }
        });
    });
}
(0, vitest_1.describe)("hooks install (e2e)", function () {
    var prevStateDir;
    var prevBundledDir;
    var workspaceDir;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeTempDir()];
                case 1:
                    baseDir = _a.sent();
                    workspaceDir = node_path_1.default.join(baseDir, "workspace");
                    return [4 /*yield*/, promises_1.default.mkdir(workspaceDir, { recursive: true })];
                case 2:
                    _a.sent();
                    prevStateDir = process.env.OPENCLAW_STATE_DIR;
                    prevBundledDir = process.env.OPENCLAW_BUNDLED_HOOKS_DIR;
                    process.env.OPENCLAW_STATE_DIR = node_path_1.default.join(baseDir, "state");
                    process.env.OPENCLAW_BUNDLED_HOOKS_DIR = node_path_1.default.join(baseDir, "bundled-none");
                    vitest_1.vi.resetModules();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, dir, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (prevStateDir === undefined) {
                        delete process.env.OPENCLAW_STATE_DIR;
                    }
                    else {
                        process.env.OPENCLAW_STATE_DIR = prevStateDir;
                    }
                    if (prevBundledDir === undefined) {
                        delete process.env.OPENCLAW_BUNDLED_HOOKS_DIR;
                    }
                    else {
                        process.env.OPENCLAW_BUNDLED_HOOKS_DIR = prevBundledDir;
                    }
                    vitest_1.vi.resetModules();
                    _i = 0, _a = tempDirs.splice(0);
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    dir = _a[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.rm(dir, { recursive: true, force: true })];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("installs a hook pack and triggers the handler", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseDir, packDir, hookDir, installHooksFromPath, installResult, _a, clearInternalHooks, createInternalHookEvent, triggerInternalHook, loadInternalHooks, loaded, event;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeTempDir()];
                case 1:
                    baseDir = _b.sent();
                    packDir = node_path_1.default.join(baseDir, "hook-pack");
                    hookDir = node_path_1.default.join(packDir, "hooks", "hello-hook");
                    return [4 /*yield*/, promises_1.default.mkdir(hookDir, { recursive: true })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(packDir, "package.json"), JSON.stringify({
                            name: "@acme/hello-hooks",
                            version: "0.0.0",
                            openclaw: { hooks: ["./hooks/hello-hook"] },
                        }, null, 2), "utf-8")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(hookDir, "HOOK.md"), [
                            "---",
                            'name: "hello-hook"',
                            'description: "Test hook"',
                            'metadata: {"openclaw":{"events":["command:new"]}}',
                            "---",
                            "",
                            "# Hello Hook",
                            "",
                        ].join("\n"), "utf-8")];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, promises_1.default.writeFile(node_path_1.default.join(hookDir, "handler.js"), "export default async function(event) { event.messages.push('hook-ok'); }\n", "utf-8")];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./install.js"); })];
                case 6:
                    installHooksFromPath = (_b.sent()).installHooksFromPath;
                    return [4 /*yield*/, installHooksFromPath({ path: packDir })];
                case 7:
                    installResult = _b.sent();
                    (0, vitest_1.expect)(installResult.ok).toBe(true);
                    if (!installResult.ok) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./internal-hooks.js"); })];
                case 8:
                    _a = _b.sent(), clearInternalHooks = _a.clearInternalHooks, createInternalHookEvent = _a.createInternalHookEvent, triggerInternalHook = _a.triggerInternalHook;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./loader.js"); })];
                case 9:
                    loadInternalHooks = (_b.sent()).loadInternalHooks;
                    clearInternalHooks();
                    return [4 /*yield*/, loadInternalHooks({ hooks: { internal: { enabled: true } } }, workspaceDir)];
                case 10:
                    loaded = _b.sent();
                    (0, vitest_1.expect)(loaded).toBe(1);
                    event = createInternalHookEvent("command", "new", "test-session");
                    return [4 /*yield*/, triggerInternalHook(event)];
                case 11:
                    _b.sent();
                    (0, vitest_1.expect)(event.messages).toContain("hook-ok");
                    return [2 /*return*/];
            }
        });
    }); });
});
