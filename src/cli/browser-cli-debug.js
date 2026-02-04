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
exports.registerBrowserDebugCommands = registerBrowserDebugCommands;
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var browser_cli_shared_js_1 = require("./browser-cli-shared.js");
var cli_utils_js_1 = require("./cli-utils.js");
function runBrowserDebug(action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err)));
        runtime_js_1.defaultRuntime.exit(1);
    });
}
function registerBrowserDebugCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("highlight")
        .description("Highlight an element by ref")
        .argument("<ref>", "Ref id from snapshot")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (ref, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserDebug(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/highlight",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                ref: ref.trim(),
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("highlighted ".concat(ref.trim()));
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
        .command("errors")
        .description("Get recent page errors")
        .option("--clear", "Clear stored errors after reading", false)
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserDebug(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "GET",
                                            path: "/errors",
                                            query: {
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                clear: Boolean(opts.clear),
                                                profile: profile,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (!result.errors.length) {
                                            runtime_js_1.defaultRuntime.log("No page errors.");
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(result.errors
                                            .map(function (e) { return "".concat(e.timestamp, " ").concat(e.name ? "".concat(e.name, ": ") : "").concat(e.message); })
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
        .command("requests")
        .description("Get recent network requests (best-effort)")
        .option("--filter <text>", "Only show URLs that contain this substring")
        .option("--clear", "Clear stored requests after reading", false)
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserDebug(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "GET",
                                            path: "/requests",
                                            query: {
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                filter: ((_b = opts.filter) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                                clear: Boolean(opts.clear),
                                                profile: profile,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _c.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        if (!result.requests.length) {
                                            runtime_js_1.defaultRuntime.log("No requests recorded.");
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(result.requests
                                            .map(function (r) {
                                            var status = typeof r.status === "number" ? " ".concat(r.status) : "";
                                            var ok = r.ok === true ? " ok" : r.ok === false ? " fail" : "";
                                            var fail = r.failureText ? " (".concat(r.failureText, ")") : "";
                                            return "".concat(r.timestamp, " ").concat(r.method).concat(status).concat(ok, " ").concat(r.url).concat(fail);
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
    var trace = browser.command("trace").description("Record a Playwright trace");
    trace
        .command("start")
        .description("Start trace recording")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--no-screenshots", "Disable screenshots")
        .option("--no-snapshots", "Disable snapshots")
        .option("--sources", "Include sources (bigger traces)", false)
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserDebug(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/trace/start",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                screenshots: Boolean(opts.screenshots),
                                                snapshots: Boolean(opts.snapshots),
                                                sources: Boolean(opts.sources),
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("trace started");
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
    trace
        .command("stop")
        .description("Stop trace recording and write a .zip")
        .option("--out <path>", "Output path for the trace zip")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserDebug(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/trace/stop",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                path: ((_b = opts.out) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _c.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("TRACE:".concat((0, utils_js_1.shortenHomePath)(result.path)));
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
