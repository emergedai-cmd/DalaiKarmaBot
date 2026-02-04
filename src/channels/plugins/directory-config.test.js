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
var directory_config_js_1 = require("./directory-config.js");
(0, vitest_1.describe)("directory (config-backed)", function () {
    (0, vitest_1.it)("lists Slack peers/groups from config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, peers, groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            slack: {
                                botToken: "xoxb-test",
                                appToken: "xapp-test",
                                dm: { allowFrom: ["U123", "user:U999"] },
                                dms: { U234: {} },
                                channels: { C111: { users: ["U777"] } },
                            },
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, directory_config_js_1.listSlackDirectoryPeersFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 1:
                    peers = _a.sent();
                    (0, vitest_1.expect)(peers === null || peers === void 0 ? void 0 : peers.map(function (e) { return e.id; }).toSorted()).toEqual([
                        "user:u123",
                        "user:u234",
                        "user:u777",
                        "user:u999",
                    ]);
                    return [4 /*yield*/, (0, directory_config_js_1.listSlackDirectoryGroupsFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 2:
                    groups = _a.sent();
                    (0, vitest_1.expect)(groups === null || groups === void 0 ? void 0 : groups.map(function (e) { return e.id; })).toEqual(["channel:c111"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists Discord peers/groups from config (numeric ids only)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, peers, groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            discord: {
                                token: "discord-test",
                                dm: { allowFrom: ["<@111>", "nope"] },
                                dms: { "222": {} },
                                guilds: {
                                    "123": {
                                        users: ["<@12345>", "not-an-id"],
                                        channels: {
                                            "555": {},
                                            "channel:666": {},
                                            general: {},
                                        },
                                    },
                                },
                            },
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, directory_config_js_1.listDiscordDirectoryPeersFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 1:
                    peers = _a.sent();
                    (0, vitest_1.expect)(peers === null || peers === void 0 ? void 0 : peers.map(function (e) { return e.id; }).toSorted()).toEqual(["user:111", "user:12345", "user:222"]);
                    return [4 /*yield*/, (0, directory_config_js_1.listDiscordDirectoryGroupsFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 2:
                    groups = _a.sent();
                    (0, vitest_1.expect)(groups === null || groups === void 0 ? void 0 : groups.map(function (e) { return e.id; }).toSorted()).toEqual(["channel:555", "channel:666"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists Telegram peers/groups from config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, peers, groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            telegram: {
                                botToken: "telegram-test",
                                allowFrom: ["123", "alice", "tg:@bob"],
                                dms: { "456": {} },
                                groups: { "-1001": {}, "*": {} },
                            },
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, directory_config_js_1.listTelegramDirectoryPeersFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 1:
                    peers = _a.sent();
                    (0, vitest_1.expect)(peers === null || peers === void 0 ? void 0 : peers.map(function (e) { return e.id; }).toSorted()).toEqual(["123", "456", "@alice", "@bob"]);
                    return [4 /*yield*/, (0, directory_config_js_1.listTelegramDirectoryGroupsFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 2:
                    groups = _a.sent();
                    (0, vitest_1.expect)(groups === null || groups === void 0 ? void 0 : groups.map(function (e) { return e.id; })).toEqual(["-1001"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists WhatsApp peers/groups from config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var cfg, peers, groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = {
                        channels: {
                            whatsapp: {
                                allowFrom: ["+15550000000", "*", "123@g.us"],
                                groups: { "999@g.us": { requireMention: true }, "*": {} },
                            },
                        },
                        // oxlint-disable-next-line typescript/no-explicit-any
                    };
                    return [4 /*yield*/, (0, directory_config_js_1.listWhatsAppDirectoryPeersFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 1:
                    peers = _a.sent();
                    (0, vitest_1.expect)(peers === null || peers === void 0 ? void 0 : peers.map(function (e) { return e.id; })).toEqual(["+15550000000"]);
                    return [4 /*yield*/, (0, directory_config_js_1.listWhatsAppDirectoryGroupsFromConfig)({
                            cfg: cfg,
                            accountId: "default",
                            query: null,
                            limit: null,
                        })];
                case 2:
                    groups = _a.sent();
                    (0, vitest_1.expect)(groups === null || groups === void 0 ? void 0 : groups.map(function (e) { return e.id; })).toEqual(["999@g.us"]);
                    return [2 /*return*/];
            }
        });
    }); });
});
