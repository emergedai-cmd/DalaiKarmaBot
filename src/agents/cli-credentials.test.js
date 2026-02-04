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
var execSyncMock = vitest_1.vi.fn();
(0, vitest_1.describe)("cli credentials", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.resetModules();
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var resetCliCredentialCachesForTest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.useRealTimers();
                    execSyncMock.mockReset();
                    delete process.env.CODEX_HOME;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    resetCliCredentialCachesForTest = (_a.sent()).resetCliCredentialCachesForTest;
                    resetCliCredentialCachesForTest();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("updates the Claude Code keychain item in place", function () { return __awaiter(void 0, void 0, void 0, function () {
        var commands, writeClaudeCliKeychainCredentials, ok, updateCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commands = [];
                    execSyncMock.mockImplementation(function (command) {
                        var cmd = String(command);
                        commands.push(cmd);
                        if (cmd.includes("find-generic-password")) {
                            return JSON.stringify({
                                claudeAiOauth: {
                                    accessToken: "old-access",
                                    refreshToken: "old-refresh",
                                    expiresAt: Date.now() + 60000,
                                },
                            });
                        }
                        return "";
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    writeClaudeCliKeychainCredentials = (_a.sent()).writeClaudeCliKeychainCredentials;
                    ok = writeClaudeCliKeychainCredentials({
                        access: "new-access",
                        refresh: "new-refresh",
                        expires: Date.now() + 60000,
                    }, { execSync: execSyncMock });
                    (0, vitest_1.expect)(ok).toBe(true);
                    (0, vitest_1.expect)(commands.some(function (cmd) { return cmd.includes("delete-generic-password"); })).toBe(false);
                    updateCommand = commands.find(function (cmd) { return cmd.includes("add-generic-password"); });
                    (0, vitest_1.expect)(updateCommand).toContain("-U");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to the file store when the keychain update fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempDir, credPath, writeKeychain, writeClaudeCliCredentials, ok, updated;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tempDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-"));
                    credPath = node_path_1.default.join(tempDir, ".claude", ".credentials.json");
                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(credPath), { recursive: true, mode: 448 });
                    node_fs_1.default.writeFileSync(credPath, "".concat(JSON.stringify({
                        claudeAiOauth: {
                            accessToken: "old-access",
                            refreshToken: "old-refresh",
                            expiresAt: Date.now() + 60000,
                        },
                    }, null, 2), "\n"), "utf8");
                    writeKeychain = vitest_1.vi.fn(function () { return false; });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    writeClaudeCliCredentials = (_d.sent()).writeClaudeCliCredentials;
                    ok = writeClaudeCliCredentials({
                        access: "new-access",
                        refresh: "new-refresh",
                        expires: Date.now() + 120000,
                    }, {
                        platform: "darwin",
                        homeDir: tempDir,
                        writeKeychain: writeKeychain,
                    });
                    (0, vitest_1.expect)(ok).toBe(true);
                    (0, vitest_1.expect)(writeKeychain).toHaveBeenCalledTimes(1);
                    updated = JSON.parse(node_fs_1.default.readFileSync(credPath, "utf8"));
                    (0, vitest_1.expect)((_a = updated.claudeAiOauth) === null || _a === void 0 ? void 0 : _a.accessToken).toBe("new-access");
                    (0, vitest_1.expect)((_b = updated.claudeAiOauth) === null || _b === void 0 ? void 0 : _b.refreshToken).toBe("new-refresh");
                    (0, vitest_1.expect)((_c = updated.claudeAiOauth) === null || _c === void 0 ? void 0 : _c.expiresAt).toBeTypeOf("number");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caches Claude Code CLI credentials within the TTL window", function () { return __awaiter(void 0, void 0, void 0, function () {
        var readClaudeCliCredentialsCached, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    execSyncMock.mockImplementation(function () {
                        return JSON.stringify({
                            claudeAiOauth: {
                                accessToken: "cached-access",
                                refreshToken: "cached-refresh",
                                expiresAt: Date.now() + 60000,
                            },
                        });
                    });
                    vitest_1.vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    readClaudeCliCredentialsCached = (_a.sent()).readClaudeCliCredentialsCached;
                    first = readClaudeCliCredentialsCached({
                        allowKeychainPrompt: true,
                        ttlMs: 15 * 60 * 1000,
                        platform: "darwin",
                        execSync: execSyncMock,
                    });
                    second = readClaudeCliCredentialsCached({
                        allowKeychainPrompt: false,
                        ttlMs: 15 * 60 * 1000,
                        platform: "darwin",
                        execSync: execSyncMock,
                    });
                    (0, vitest_1.expect)(first).toBeTruthy();
                    (0, vitest_1.expect)(second).toEqual(first);
                    (0, vitest_1.expect)(execSyncMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refreshes Claude Code CLI credentials after the TTL window", function () { return __awaiter(void 0, void 0, void 0, function () {
        var readClaudeCliCredentialsCached, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    execSyncMock.mockImplementation(function () {
                        return JSON.stringify({
                            claudeAiOauth: {
                                accessToken: "token-".concat(Date.now()),
                                refreshToken: "refresh",
                                expiresAt: Date.now() + 60000,
                            },
                        });
                    });
                    vitest_1.vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    readClaudeCliCredentialsCached = (_a.sent()).readClaudeCliCredentialsCached;
                    first = readClaudeCliCredentialsCached({
                        allowKeychainPrompt: true,
                        ttlMs: 15 * 60 * 1000,
                        platform: "darwin",
                        execSync: execSyncMock,
                    });
                    vitest_1.vi.advanceTimersByTime(15 * 60 * 1000 + 1);
                    second = readClaudeCliCredentialsCached({
                        allowKeychainPrompt: true,
                        ttlMs: 15 * 60 * 1000,
                        platform: "darwin",
                        execSync: execSyncMock,
                    });
                    (0, vitest_1.expect)(first).toBeTruthy();
                    (0, vitest_1.expect)(second).toBeTruthy();
                    (0, vitest_1.expect)(execSyncMock).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reads Codex credentials from keychain when available", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempHome, accountHash, readCodexCliCredentials, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempHome = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-codex-"));
                    process.env.CODEX_HOME = tempHome;
                    accountHash = "cli|";
                    execSyncMock.mockImplementation(function (command) {
                        var cmd = String(command);
                        (0, vitest_1.expect)(cmd).toContain("Codex Auth");
                        (0, vitest_1.expect)(cmd).toContain(accountHash);
                        return JSON.stringify({
                            tokens: {
                                access_token: "keychain-access",
                                refresh_token: "keychain-refresh",
                            },
                            last_refresh: "2026-01-01T00:00:00Z",
                        });
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    readCodexCliCredentials = (_a.sent()).readCodexCliCredentials;
                    creds = readCodexCliCredentials({ platform: "darwin", execSync: execSyncMock });
                    (0, vitest_1.expect)(creds).toMatchObject({
                        access: "keychain-access",
                        refresh: "keychain-refresh",
                        provider: "openai-codex",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to Codex auth.json when keychain is unavailable", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempHome, authPath, readCodexCliCredentials, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempHome = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-codex-"));
                    process.env.CODEX_HOME = tempHome;
                    execSyncMock.mockImplementation(function () {
                        throw new Error("not found");
                    });
                    authPath = node_path_1.default.join(tempHome, "auth.json");
                    node_fs_1.default.mkdirSync(tempHome, { recursive: true, mode: 448 });
                    node_fs_1.default.writeFileSync(authPath, JSON.stringify({
                        tokens: {
                            access_token: "file-access",
                            refresh_token: "file-refresh",
                        },
                    }), "utf8");
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./cli-credentials.js"); })];
                case 1:
                    readCodexCliCredentials = (_a.sent()).readCodexCliCredentials;
                    creds = readCodexCliCredentials({ execSync: execSyncMock });
                    (0, vitest_1.expect)(creds).toMatchObject({
                        access: "file-access",
                        refresh: "file-refresh",
                        provider: "openai-codex",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
