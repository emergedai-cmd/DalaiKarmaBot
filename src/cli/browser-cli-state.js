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
exports.registerBrowserStateCommands = registerBrowserStateCommands;
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var boolean_js_1 = require("../utils/boolean.js");
var browser_cli_shared_js_1 = require("./browser-cli-shared.js");
var browser_cli_state_cookies_storage_js_1 = require("./browser-cli-state.cookies-storage.js");
var cli_utils_js_1 = require("./cli-utils.js");
function parseOnOff(raw) {
    var parsed = (0, boolean_js_1.parseBooleanValue)(raw);
    return parsed === undefined ? null : parsed;
}
function runBrowserCommand(action) {
    return (0, cli_utils_js_1.runCommandWithRuntime)(runtime_js_1.defaultRuntime, action, function (err) {
        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err)));
        runtime_js_1.defaultRuntime.exit(1);
    });
}
function registerBrowserStateCommands(browser, parentOpts) {
    var _this = this;
    (0, browser_cli_state_cookies_storage_js_1.registerBrowserCookiesAndStorageCommands)(browser, parentOpts);
    var set = browser.command("set").description("Browser environment settings");
    set
        .command("viewport")
        .description("Set viewport size (alias for resize)")
        .argument("<width>", "Viewport width", function (v) { return Number(v); })
        .argument("<height>", "Viewport height", function (v) { return Number(v); })
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (width, height, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    if (!Number.isFinite(width) || !Number.isFinite(height)) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("width and height must be numbers"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/act",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                kind: "resize",
                                                width: width,
                                                height: height,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("viewport set: ".concat(width, "x").concat(height));
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
    set
        .command("offline")
        .description("Toggle offline mode")
        .argument("<on|off>", "on/off")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (value, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, offline;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    offline = parseOnOff(value);
                    if (offline === null) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Expected on|off"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/offline",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                offline: offline,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("offline: ".concat(offline));
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
    set
        .command("headers")
        .description("Set extra HTTP headers (JSON object)")
        .requiredOption("--json <json>", "JSON object of headers")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var parsed, headers, _i, _a, _b, k, v, result;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        parsed = JSON.parse(String(opts.json));
                                        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                                            throw new Error("headers json must be an object");
                                        }
                                        headers = {};
                                        for (_i = 0, _a = Object.entries(parsed); _i < _a.length; _i++) {
                                            _b = _a[_i], k = _b[0], v = _b[1];
                                            if (typeof v === "string") {
                                                headers[k] = v;
                                            }
                                        }
                                        return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                                method: "POST",
                                                path: "/set/headers",
                                                query: profile ? { profile: profile } : undefined,
                                                body: {
                                                    headers: headers,
                                                    targetId: ((_c = opts.targetId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                                },
                                            }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _d.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("headers set");
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
    set
        .command("credentials")
        .description("Set HTTP basic auth credentials")
        .option("--clear", "Clear credentials", false)
        .argument("[username]", "Username")
        .argument("[password]", "Password")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (username, password, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/credentials",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                username: (username === null || username === void 0 ? void 0 : username.trim()) || undefined,
                                                password: password,
                                                clear: Boolean(opts.clear),
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(opts.clear ? "credentials cleared" : "credentials set");
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
    set
        .command("geo")
        .description("Set geolocation (and grant permission)")
        .option("--clear", "Clear geolocation + permissions", false)
        .argument("[latitude]", "Latitude", function (v) { return Number(v); })
        .argument("[longitude]", "Longitude", function (v) { return Number(v); })
        .option("--accuracy <m>", "Accuracy in meters", function (v) { return Number(v); })
        .option("--origin <origin>", "Origin to grant permissions for")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (latitude, longitude, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/geolocation",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                latitude: Number.isFinite(latitude) ? latitude : undefined,
                                                longitude: Number.isFinite(longitude) ? longitude : undefined,
                                                accuracy: Number.isFinite(opts.accuracy) ? opts.accuracy : undefined,
                                                origin: ((_a = opts.origin) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                                clear: Boolean(opts.clear),
                                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _c.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log(opts.clear ? "geolocation cleared" : "geolocation set");
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
    set
        .command("media")
        .description("Emulate prefers-color-scheme")
        .argument("<dark|light|none>", "dark/light/none")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (value, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, v, colorScheme;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    v = value.trim().toLowerCase();
                    colorScheme = v === "dark" ? "dark" : v === "light" ? "light" : v === "none" ? "none" : null;
                    if (!colorScheme) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Expected dark|light|none"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/media",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                colorScheme: colorScheme,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("media colorScheme: ".concat(colorScheme));
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
    set
        .command("timezone")
        .description("Override timezone (CDP)")
        .argument("<timezoneId>", "Timezone ID (e.g. America/New_York)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (timezoneId, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/timezone",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                timezoneId: timezoneId,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("timezone: ".concat(timezoneId));
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
    set
        .command("locale")
        .description("Override locale (CDP)")
        .argument("<locale>", "Locale (e.g. en-US)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (locale, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/locale",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                locale: locale,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("locale: ".concat(locale));
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
    set
        .command("device")
        .description('Apply a Playwright device descriptor (e.g. "iPhone 14")')
        .argument("<name>", "Device name (Playwright devices)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (name, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    return [4 /*yield*/, runBrowserCommand(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                                            method: "POST",
                                            path: "/set/device",
                                            query: profile ? { profile: profile } : undefined,
                                            body: {
                                                name: name,
                                                targetId: ((_a = opts.targetId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                            },
                                        }, { timeoutMs: 20000 })];
                                    case 1:
                                        result = _b.sent();
                                        if (parent === null || parent === void 0 ? void 0 : parent.json) {
                                            runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                                            return [2 /*return*/];
                                        }
                                        runtime_js_1.defaultRuntime.log("device: ".concat(name));
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
