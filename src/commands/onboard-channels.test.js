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
var channel_js_1 = require("../../extensions/discord/src/channel.js");
var channel_js_2 = require("../../extensions/imessage/src/channel.js");
var channel_js_3 = require("../../extensions/signal/src/channel.js");
var channel_js_4 = require("../../extensions/slack/src/channel.js");
var channel_js_5 = require("../../extensions/telegram/src/channel.js");
var channel_js_6 = require("../../extensions/whatsapp/src/channel.js");
var runtime_js_1 = require("../plugins/runtime.js");
var channel_plugins_js_1 = require("../test-utils/channel-plugins.js");
var onboard_channels_js_1 = require("./onboard-channels.js");
vitest_1.vi.mock("node:fs/promises", function () { return ({
    default: {
        access: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("ENOENT");
            });
        }); }),
    },
}); });
vitest_1.vi.mock("../channel-web.js", function () { return ({
    loginWeb: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }),
}); });
vitest_1.vi.mock("./onboard-helpers.js", function () { return ({
    detectBinary: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, false];
    }); }); }),
}); });
(0, vitest_1.describe)("setupChannels", function () {
    (0, vitest_1.beforeEach)(function () {
        (0, runtime_js_1.setActivePluginRegistry)((0, channel_plugins_js_1.createTestRegistry)([
            { pluginId: "discord", plugin: channel_js_1.discordPlugin, source: "test" },
            { pluginId: "slack", plugin: channel_js_4.slackPlugin, source: "test" },
            { pluginId: "telegram", plugin: channel_js_5.telegramPlugin, source: "test" },
            { pluginId: "whatsapp", plugin: channel_js_6.whatsappPlugin, source: "test" },
            { pluginId: "signal", plugin: channel_js_3.signalPlugin, source: "test" },
            { pluginId: "imessage", plugin: channel_js_2.imessagePlugin, source: "test" },
        ]));
    });
    (0, vitest_1.it)("QuickStart uses single-select (no multiselect) and doesn't prompt for Telegram token when WhatsApp is chosen", function () { return __awaiter(void 0, void 0, void 0, function () {
        var select, multiselect, text, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    select = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, "whatsapp"];
                    }); }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected multiselect");
                        });
                    }); });
                    text = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var message = _b.message;
                        return __generator(this, function (_c) {
                            if (message.includes("Enter Telegram bot token")) {
                                throw new Error("unexpected Telegram token prompt");
                            }
                            if (message.includes("Your personal WhatsApp number")) {
                                return [2 /*return*/, "+15555550123"];
                            }
                            throw new Error("unexpected text prompt: ".concat(message));
                        });
                    }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)({}, runtime, prompter, {
                            skipConfirm: true,
                            quickstartDefaults: true,
                            forceAllowFromChannels: ["whatsapp"],
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(select).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Select channel (QuickStart)" }));
                    (0, vitest_1.expect)(multiselect).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("prompts for configured channel action and skips configuration when told to skip", function () { return __awaiter(void 0, void 0, void 0, function () {
        var select, multiselect, text, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    select = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var message = _b.message;
                        return __generator(this, function (_c) {
                            if (message === "Select channel (QuickStart)") {
                                return [2 /*return*/, "telegram"];
                            }
                            if (message.includes("already configured")) {
                                return [2 /*return*/, "skip"];
                            }
                            throw new Error("unexpected select prompt: ".concat(message));
                        });
                    }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected multiselect");
                        });
                    }); });
                    text = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var message = _b.message;
                        return __generator(this, function (_c) {
                            throw new Error("unexpected text prompt: ".concat(message));
                        });
                    }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: multiselect,
                        text: text,
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)({
                            channels: {
                                telegram: {
                                    botToken: "token",
                                },
                            },
                        }, runtime, prompter, {
                            skipConfirm: true,
                            quickstartDefaults: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(select).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Select channel (QuickStart)" }));
                    (0, vitest_1.expect)(select).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: vitest_1.expect.stringContaining("already configured") }));
                    (0, vitest_1.expect)(multiselect).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(text).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds disabled hint to channel selection when a channel is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var selectionCount, select, multiselect, prompter, runtime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectionCount = 0;
                    select = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var opts, telegram;
                        var message = _b.message, options = _b.options;
                        return __generator(this, function (_c) {
                            if (message === "Select a channel") {
                                selectionCount += 1;
                                opts = options;
                                telegram = opts.find(function (opt) { return opt.value === "telegram"; });
                                (0, vitest_1.expect)(telegram === null || telegram === void 0 ? void 0 : telegram.hint).toContain("disabled");
                                return [2 /*return*/, selectionCount === 1 ? "telegram" : "__done__"];
                            }
                            if (message.includes("already configured")) {
                                return [2 /*return*/, "skip"];
                            }
                            return [2 /*return*/, "__done__"];
                        });
                    }); });
                    multiselect = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error("unexpected multiselect");
                        });
                    }); });
                    prompter = {
                        intro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        outro: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        note: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }),
                        select: select,
                        multiselect: multiselect,
                        text: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ""];
                        }); }); }),
                        confirm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, false];
                        }); }); }),
                        progress: vitest_1.vi.fn(function () { return ({ update: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }); }),
                    };
                    runtime = {
                        log: vitest_1.vi.fn(),
                        error: vitest_1.vi.fn(),
                        exit: vitest_1.vi.fn(function (code) {
                            throw new Error("exit:".concat(code));
                        }),
                    };
                    return [4 /*yield*/, (0, onboard_channels_js_1.setupChannels)({
                            channels: {
                                telegram: {
                                    botToken: "token",
                                    enabled: false,
                                },
                            },
                        }, runtime, prompter, {
                            skipConfirm: true,
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(select).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: "Select a channel" }));
                    (0, vitest_1.expect)(multiselect).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
