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
exports.registerBrowserCookiesAndStorageCommands = registerBrowserCookiesAndStorageCommands;
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var browser_cli_shared_js_1 = require("./browser-cli-shared.js");
function registerBrowserCookiesAndStorageCommands(browser, parentOpts) {
    var _this = this;
    var cookies = browser.command("cookies").description("Read/write cookies");
    cookies
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, result, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "GET",
                            path: "/cookies",
                            query: {
                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                profile: profile,
                            },
                        }, { timeoutMs: 20000 })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(JSON.stringify((_b = result.cookies) !== null && _b !== void 0 ? _b : [], null, 2));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    cookies
        .command("set")
        .description("Set a cookie (requires --url or domain+path)")
        .argument("<name>", "Cookie name")
        .argument("<value>", "Cookie value")
        .requiredOption("--url <url>", "Cookie URL scope (recommended)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (name, value, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, result, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/cookies/set",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                cookie: { name: name, value: value, url: opts.url },
                            },
                        }, { timeoutMs: 20000 })];
                case 2:
                    result = _b.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("cookie set: ".concat(name));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    cookies
        .command("clear")
        .description("Clear all cookies")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, result, err_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/cookies/clear",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                            },
                        }, { timeoutMs: 20000 })];
                case 2:
                    result = _b.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("cookies cleared");
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _b.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var storage = browser.command("storage").description("Read/write localStorage/sessionStorage");
    function registerStorageKind(kind) {
        var _this = this;
        var cmd = storage.command(kind).description("".concat(kind, "Storage commands"));
        cmd
            .command("get")
            .description("Get ".concat(kind, "Storage (all keys or one key)"))
            .argument("[key]", "Key (optional)")
            .option("--target-id <id>", "CDP target id (or unique prefix)")
            .action(function (key, opts, cmd2) { return __awaiter(_this, void 0, void 0, function () {
            var parent, profile, result, err_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        parent = parentOpts(cmd2);
                        profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                method: "GET",
                                path: "/storage/".concat(kind),
                                query: {
                                    key: (key === null || key === void 0 ? void 0 : key.trim()) || undefined,
                                    targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                    profile: profile,
                                },
                            }, { timeoutMs: 20000 })];
                    case 2:
                        result = _c.sent();
                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                            return [2 /*return*/];
                        }
                        runtime_js_1.defaultRuntime.log(JSON.stringify((_b = result.values) !== null && _b !== void 0 ? _b : {}, null, 2));
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _c.sent();
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_4)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        cmd
            .command("set")
            .description("Set a ".concat(kind, "Storage key"))
            .argument("<key>", "Key")
            .argument("<value>", "Value")
            .option("--target-id <id>", "CDP target id (or unique prefix)")
            .action(function (key, value, opts, cmd2) { return __awaiter(_this, void 0, void 0, function () {
            var parent, profile, result, err_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parent = parentOpts(cmd2);
                        profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                method: "POST",
                                path: "/storage/".concat(kind, "/set"),
                                query: profile ? { profile: profile } : undefined,
                                body: {
                                    key: key,
                                    value: value,
                                    targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                },
                            }, { timeoutMs: 20000 })];
                    case 2:
                        result = _b.sent();
                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                            return [2 /*return*/];
                        }
                        runtime_js_1.defaultRuntime.log("".concat(kind, "Storage set: ").concat(key));
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_5)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        cmd
            .command("clear")
            .description("Clear all ".concat(kind, "Storage keys"))
            .option("--target-id <id>", "CDP target id (or unique prefix)")
            .action(function (opts, cmd2) { return __awaiter(_this, void 0, void 0, function () {
            var parent, profile, result, err_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parent = parentOpts(cmd2);
                        profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                method: "POST",
                                path: "/storage/".concat(kind, "/clear"),
                                query: profile ? { profile: profile } : undefined,
                                body: {
                                    targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                },
                            }, { timeoutMs: 20000 })];
                    case 2:
                        result = _b.sent();
                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                            return [2 /*return*/];
                        }
                        runtime_js_1.defaultRuntime.log("".concat(kind, "Storage cleared"));
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _b.sent();
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_6)));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    }
    registerStorageKind("local");
    registerStorageKind("session");
}
