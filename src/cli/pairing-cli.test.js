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
var commander_1 = require("commander");
var vitest_1 = require("vitest");
var listChannelPairingRequests = vitest_1.vi.fn();
var approveChannelPairingCode = vitest_1.vi.fn();
var notifyPairingApproved = vitest_1.vi.fn();
var pairingIdLabels = {
    telegram: "telegramUserId",
    discord: "discordUserId",
};
var normalizeChannelId = vitest_1.vi.fn(function (raw) {
    if (!raw) {
        return null;
    }
    if (raw === "imsg") {
        return "imessage";
    }
    if (["telegram", "discord", "imessage"].includes(raw)) {
        return raw;
    }
    return null;
});
var getPairingAdapter = vitest_1.vi.fn(function (channel) {
    var _a;
    return ({
        idLabel: (_a = pairingIdLabels[channel]) !== null && _a !== void 0 ? _a : "userId",
    });
});
var listPairingChannels = vitest_1.vi.fn(function () { return ["telegram", "discord", "imessage"]; });
vitest_1.vi.mock("../pairing/pairing-store.js", function () { return ({
    listChannelPairingRequests: listChannelPairingRequests,
    approveChannelPairingCode: approveChannelPairingCode,
}); });
vitest_1.vi.mock("../channels/plugins/pairing.js", function () { return ({
    listPairingChannels: listPairingChannels,
    notifyPairingApproved: notifyPairingApproved,
    getPairingAdapter: getPairingAdapter,
}); });
vitest_1.vi.mock("../channels/plugins/index.js", function () { return ({
    normalizeChannelId: normalizeChannelId,
}); });
vitest_1.vi.mock("../config/config.js", function () { return ({
    loadConfig: vitest_1.vi.fn().mockReturnValue({}),
}); });
(0, vitest_1.describe)("pairing cli", function () {
    (0, vitest_1.it)("evaluates pairing channels when registering the CLI (not at import)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listPairingChannels.mockClear();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    (0, vitest_1.expect)(listPairingChannels).not.toHaveBeenCalled();
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    (0, vitest_1.expect)(listPairingChannels).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("labels Telegram ids as telegramUserId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, log, program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    listChannelPairingRequests.mockResolvedValueOnce([
                        {
                            id: "123",
                            code: "ABC123",
                            createdAt: "2026-01-08T00:00:00Z",
                            lastSeenAt: "2026-01-08T00:00:00Z",
                            meta: { username: "peter" },
                        },
                    ]);
                    log = vitest_1.vi.spyOn(console, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "list", "--channel", "telegram"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    output = log.mock.calls.map(function (call) { return call.join(" "); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("telegramUserId");
                    (0, vitest_1.expect)(output).toContain("123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts channel as positional for list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    listChannelPairingRequests.mockResolvedValueOnce([]);
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "list", "telegram"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(listChannelPairingRequests).toHaveBeenCalledWith("telegram");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("normalizes channel aliases", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    listChannelPairingRequests.mockResolvedValueOnce([]);
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "list", "imsg"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(normalizeChannelId).toHaveBeenCalledWith("imsg");
                    (0, vitest_1.expect)(listChannelPairingRequests).toHaveBeenCalledWith("imessage");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts extension channels outside the registry", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    listChannelPairingRequests.mockResolvedValueOnce([]);
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "list", "zalo"], { from: "user" })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(normalizeChannelId).toHaveBeenCalledWith("zalo");
                    (0, vitest_1.expect)(listChannelPairingRequests).toHaveBeenCalledWith("zalo");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("labels Discord ids as discordUserId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, log, program, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    listChannelPairingRequests.mockResolvedValueOnce([
                        {
                            id: "999",
                            code: "DEF456",
                            createdAt: "2026-01-08T00:00:00Z",
                            lastSeenAt: "2026-01-08T00:00:00Z",
                            meta: { tag: "Ada#0001" },
                        },
                    ]);
                    log = vitest_1.vi.spyOn(console, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "list", "--channel", "discord"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    output = log.mock.calls.map(function (call) { return call.join(" "); }).join("\n");
                    (0, vitest_1.expect)(output).toContain("discordUserId");
                    (0, vitest_1.expect)(output).toContain("999");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts channel as positional for approve (npm-run compatible)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var registerPairingCli, log, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pairing-cli.js"); })];
                case 1:
                    registerPairingCli = (_a.sent()).registerPairingCli;
                    approveChannelPairingCode.mockResolvedValueOnce({
                        id: "123",
                        entry: {
                            id: "123",
                            code: "ABCDEFGH",
                            createdAt: "2026-01-08T00:00:00Z",
                            lastSeenAt: "2026-01-08T00:00:00Z",
                        },
                    });
                    log = vitest_1.vi.spyOn(console, "log").mockImplementation(function () { });
                    program = new commander_1.Command();
                    program.name("test");
                    registerPairingCli(program);
                    return [4 /*yield*/, program.parseAsync(["pairing", "approve", "telegram", "ABCDEFGH"], {
                            from: "user",
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(approveChannelPairingCode).toHaveBeenCalledWith({
                        channel: "telegram",
                        code: "ABCDEFGH",
                    });
                    (0, vitest_1.expect)(log).toHaveBeenCalledWith(vitest_1.expect.stringContaining("Approved"));
                    return [2 /*return*/];
            }
        });
    }); });
});
