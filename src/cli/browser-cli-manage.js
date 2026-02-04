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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrowserManageCommands = registerBrowserManageCommands;
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var browser_cli_shared_js_1 = require("./browser-cli-shared.js");
var cli_utils_js_1 = require("./cli-utils.js");
function runBrowserCommand(action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err)));
        runtime_js_1.defaultRuntime.exit(1);
    });
}
function registerBrowserManageCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("status")
        .description("Show browser status")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var status, detectedPath, detectedDisplay;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "GET",
                                            path: "/",
                                            query: (parent === null || parent === void 0 ? void 0 : parent.browserProfile) ? { profile: parent.browserProfile } : undefined,
                                        }, {
                                            timeoutMs: 1500,
                                        })];
                                    case 1:
                                        status = _f.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(status, null, 2));
                                            return [2 /*return*/];
                                        }
                                        detectedPath = (_a = status.detectedExecutablePath) !== null && _a !== void 0 ? _a : status.executablePath;
                                        detectedDisplay = detectedPath ? (0, utils_js_1.shortenHomePath)(detectedPath) : "auto";
                                        runtime_js_1.defaultRuntime.log(__spreadArray([
                                            "profile: ".concat((_b = status.profile) !== null && _b !== void 0 ? _b : "openclaw"),
                                            "enabled: ".concat(status.enabled),
                                            "running: ".concat(status.running),
                                            "cdpPort: ".concat(status.cdpPort),
                                            "cdpUrl: ".concat((_c = status.cdpUrl) !== null && _c !== void 0 ? _c : "http://127.0.0.1:".concat(status.cdpPort)),
                                            "browser: ".concat((_d = status.chosenBrowser) !== null && _d !== void 0 ? _d : "unknown"),
                                            "detectedBrowser: ".concat((_e = status.detectedBrowser) !== null && _e !== void 0 ? _e : "unknown"),
                                            "detectedPath: ".concat(detectedDisplay),
                                            "profileColor: ".concat(status.color)
                                        ], (status.detectError ? ["detectError: ".concat(status.detectError)] : []), true).join("\n"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("start")
        .description("Start the browser (no-op if already running)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var status, name;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/start",
                                            query: profile ? { profile: profile } : undefined,
                                        }, { timeoutMs: 15000 })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                                method: "GET",
                                                path: "/",
                                                query: profile ? { profile: profile } : undefined,
                                            }, { timeoutMs: 1500 })];
                                    case 2:
                                        status = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(status, null, 2));
                                            return [2 /*return*/];
                                        }
                                        name = (_a = status.profile) !== null && _a !== void 0 ? _a : "openclaw";
                                        runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("\uD83E\uDD9E browser [".concat(name, "] running: ").concat(status.running)));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("stop")
        .description("Stop the browser (best-effort)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var status, name;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/stop",
                                            query: profile ? { profile: profile } : undefined,
                                        }, { timeoutMs: 15000 })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                                method: "GET",
                                                path: "/",
                                                query: profile ? { profile: profile } : undefined,
                                            }, { timeoutMs: 1500 })];
                                    case 2:
                                        status = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(status, null, 2));
                                            return [2 /*return*/];
                                        }
                                        name = (_a = status.profile) !== null && _a !== void 0 ? _a : "openclaw";
                                        runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("\uD83E\uDD9E browser [".concat(name, "] running: ").concat(status.running)));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("reset-profile")
        .description("Reset browser profile (moves it to Trash)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, dest;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/reset-profile",
                                            query: profile ? { profile: profile } : undefined,
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (!result.moved) {
                                            runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("\uD83E\uDD9E browser profile already missing."));
                                            return [2 /*return*/];
                                        }
                                        dest = (_a = result.to) !== null && _a !== void 0 ? _a : result.from;
                                        runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("\uD83E\uDD9E browser profile moved to Trash (".concat(dest, ")")));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("tabs")
        .description("List open tabs")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, tabs;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "GET",
                                            path: "/tabs",
                                            query: profile ? { profile: profile } : undefined,
                                        }, { timeoutMs: 3000 })];
                                    case 1:
                                        result = _b.sent();
                                        tabs = (_a = result.tabs) !== null && _a !== void 0 ? _a : [];
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify({ tabs: tabs }, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (tabs.length === 0) {
                                            runtime_js_1.defaultRuntime.log("No tabs (browser closed or no targets).");
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(tabs
                                            .map(function (t, i) { return "".concat(i + 1, ". ").concat(t.title || "(untitled)", "\n   ").concat(t.url, "\n   id: ").concat(t.targetId); })
                                            .join("\n"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var tab = browser
        .command("tab")
        .description("Tab shortcuts (index-based)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, tabs;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/action",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                action: "list",
                                            },
                                        }, { timeoutMs: 10000 })];
                                    case 1:
                                        result = _b.sent();
                                        tabs = (_a = result.tabs) !== null && _a !== void 0 ? _a : [];
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify({ tabs: tabs }, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (tabs.length === 0) {
                                            runtime_js_1.defaultRuntime.log("No tabs (browser closed or no targets).");
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(tabs
                                            .map(function (t, i) { return "".concat(i + 1, ". ").concat(t.title || "(untitled)", "\n   ").concat(t.url, "\n   id: ").concat(t.targetId); })
                                            .join("\n"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    tab
        .command("new")
        .description("Open a new tab (about:blank)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/action",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { action: "new" },
                                        }, { timeoutMs: 10000 })];
                                    case 1:
                                        result = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("opened new tab");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    tab
        .command("select")
        .description("Focus tab by index (1-based)")
        .argument("<index>", "Tab index (1-based)", function (v) { return Number(v); })
        .action(function (index, _opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    if (!Number.isFinite(index) || index < 1) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("index must be a positive number"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/action",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { action: "select", index: Math.floor(index) - 1 },
                                        }, { timeoutMs: 10000 })];
                                    case 1:
                                        result = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("selected tab ".concat(Math.floor(index)));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    tab
        .command("close")
        .description("Close tab by index (1-based); default: first tab")
        .argument("[index]", "Tab index (1-based)", function (v) { return Number(v); })
        .action(function (index, _opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, idx;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    idx = typeof index === "number" && Number.isFinite(index) ? Math.floor(index) - 1 : undefined;
                    if (typeof idx === "number" && idx < 0) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("index must be >= 1"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/action",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { action: "close", index: idx },
                                        }, { timeoutMs: 10000 })];
                                    case 1:
                                        result = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("closed tab");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("open")
        .description("Open a URL in a new tab")
        .argument("<url>", "URL to open")
        .action(function (url, _opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var tab;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/open",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { url: url },
                                        }, { timeoutMs: 15000 })];
                                    case 1:
                                        tab = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(tab, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("opened: ".concat(tab.url, "\nid: ").concat(tab.targetId));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("focus")
        .description("Focus a tab by target id (or unique prefix)")
        .argument("<targetId>", "Target id or unique prefix")
        .action(function (targetId, _opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/tabs/focus",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { targetId: targetId },
                                        }, { timeoutMs: 5000 })];
                                    case 1:
                                        _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify({ ok: true }, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("focused tab ".concat(targetId));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("close")
        .description("Close a tab (target id optional)")
        .argument("[targetId]", "Target id or unique prefix (optional)")
        .action(function (targetId, _opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(targetId === null || targetId === void 0 ? void 0 : targetId.trim())) return [3 /*break*/, 2];
                                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                                method: "DELETE",
                                                path: "/tabs/".concat(encodeURIComponent(targetId.trim())),
                                                query: profile ? { profile: profile } : undefined,
                                            }, { timeoutMs: 5000 })];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/act",
                                            query: profile ? { profile: profile } : undefined,
                                            body: { kind: "close" },
                                        }, { timeoutMs: 20000 })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify({ ok: true }, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("closed tab");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Profile management commands
    browser
        .command("profiles")
        .description("List all browser profiles")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, profiles;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "GET",
                                            path: "/profiles",
                                        }, { timeoutMs: 3000 })];
                                    case 1:
                                        result = _b.sent();
                                        profiles = (_a = result.profiles) !== null && _a !== void 0 ? _a : [];
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify({ profiles: profiles }, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (profiles.length === 0) {
                                            runtime_js_1.defaultRuntime.log("No profiles configured.");
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(profiles
                                            .map(function (p) {
                                            var status = p.running ? "running" : "stopped";
                                            var tabs = p.running ? " (".concat(p.tabCount, " tabs)") : "";
                                            var def = p.isDefault ? " [default]" : "";
                                            var loc = p.isRemote ? "cdpUrl: ".concat(p.cdpUrl) : "port: ".concat(p.cdpPort);
                                            var remote = p.isRemote ? " [remote]" : "";
                                            return "".concat(p.name, ": ").concat(status).concat(tabs).concat(def).concat(remote, "\n  ").concat(loc, ", color: ").concat(p.color);
                                        })
                                            .join("\n"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("create-profile")
        .description("Create a new browser profile")
        .requiredOption("--name <name>", "Profile name (lowercase, numbers, hyphens)")
        .option("--color <hex>", "Profile color (hex format, e.g. #0066CC)")
        .option("--cdp-url <url>", "CDP URL for remote Chrome (http/https)")
        .option("--driver <driver>", "Profile driver (openclaw|extension). Default: openclaw")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, loc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/profiles/create",
                                            body: {
                                                name: opts.name,
                                                color: opts.color,
                                                cdpUrl: opts.cdpUrl,
                                                driver: opts.driver === "extension" ? "extension" : undefined,
                                            },
                                        }, { timeoutMs: 10000 })];
                                    case 1:
                                        result = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        loc = result.isRemote ? "  cdpUrl: ".concat(result.cdpUrl) : "  port: ".concat(result.cdpPort);
                                        runtime_js_1.defaultRuntime.log((0, globals_js_1.info)("\uD83E\uDD9E Created profile \"".concat(result.profile, "\"\n").concat(loc, "\n  color: ").concat(result.color).concat(opts.driver === "extension" ? "\n  driver: extension" : "")));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("delete-profile")
        .description("Delete a browser profile")
        .requiredOption("--name <name>", "Profile name to delete")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result, msg;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "DELETE",
                                            path: "/profiles/".concat(encodeURIComponent(opts.name)),
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _a.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        msg = result.deleted
                                            ? "\uD83E\uDD9E Deleted profile \"".concat(result.profile, "\" (user data removed)")
                                            : "\uD83E\uDD9E Deleted profile \"".concat(result.profile, "\" (no user data found)");
                                        runtime_js_1.defaultRuntime.log((0, globals_js_1.info)(msg));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
