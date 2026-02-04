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
var node_child_process_1 = require("node:child_process");
var node_events_1 = require("node:events");
var vitest_1 = require("vitest");
vitest_1.vi.mock("node:child_process", function () {
    var spawn = vitest_1.vi.fn(function () {
        var child = new node_events_1.EventEmitter();
        var stdout = new node_events_1.EventEmitter();
        stdout.setEncoding = vitest_1.vi.fn();
        child.stdout = stdout;
        child.kill = vitest_1.vi.fn();
        process.nextTick(function () {
            stdout.emit("data", [
                "user steipete",
                "hostname peters-mac-studio-1.sheep-coho.ts.net",
                "port 2222",
                "identityfile none",
                "identityfile /tmp/id_ed25519",
                "",
            ].join("\n"));
            child.emit("exit", 0);
        });
        return child;
    });
    return { spawn: spawn };
});
var spawnMock = vitest_1.vi.mocked(node_child_process_1.spawn);
(0, vitest_1.describe)("ssh-config", function () {
    (0, vitest_1.it)("parses ssh -G output", function () { return __awaiter(void 0, void 0, void 0, function () {
        var parseSshConfigOutput, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./ssh-config.js"); })];
                case 1:
                    parseSshConfigOutput = (_a.sent()).parseSshConfigOutput;
                    parsed = parseSshConfigOutput("user bob\nhostname example.com\nport 2222\nidentityfile none\nidentityfile /tmp/id\n");
                    (0, vitest_1.expect)(parsed.user).toBe("bob");
                    (0, vitest_1.expect)(parsed.host).toBe("example.com");
                    (0, vitest_1.expect)(parsed.port).toBe(2222);
                    (0, vitest_1.expect)(parsed.identityFiles).toEqual(["/tmp/id"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("resolves ssh config via ssh -G", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSshConfig, config, args;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./ssh-config.js"); })];
                case 1:
                    resolveSshConfig = (_b.sent()).resolveSshConfig;
                    return [4 /*yield*/, resolveSshConfig({ user: "me", host: "alias", port: 22 })];
                case 2:
                    config = _b.sent();
                    (0, vitest_1.expect)(config === null || config === void 0 ? void 0 : config.user).toBe("steipete");
                    (0, vitest_1.expect)(config === null || config === void 0 ? void 0 : config.host).toBe("peters-mac-studio-1.sheep-coho.ts.net");
                    (0, vitest_1.expect)(config === null || config === void 0 ? void 0 : config.port).toBe(2222);
                    (0, vitest_1.expect)(config === null || config === void 0 ? void 0 : config.identityFiles).toEqual(["/tmp/id_ed25519"]);
                    args = (_a = spawnMock.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1];
                    (0, vitest_1.expect)(args === null || args === void 0 ? void 0 : args.slice(-2)).toEqual(["--", "me@alias"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null when ssh -G fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolveSshConfig, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spawnMock.mockImplementationOnce(function () {
                        var child = new node_events_1.EventEmitter();
                        var stdout = new node_events_1.EventEmitter();
                        stdout.setEncoding = vitest_1.vi.fn();
                        child.stdout = stdout;
                        child.kill = vitest_1.vi.fn();
                        process.nextTick(function () {
                            child.emit("exit", 1);
                        });
                        return child;
                    });
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./ssh-config.js"); })];
                case 1:
                    resolveSshConfig = (_a.sent()).resolveSshConfig;
                    return [4 /*yield*/, resolveSshConfig({ user: "me", host: "bad-host", port: 22 })];
                case 2:
                    config = _a.sent();
                    (0, vitest_1.expect)(config).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
