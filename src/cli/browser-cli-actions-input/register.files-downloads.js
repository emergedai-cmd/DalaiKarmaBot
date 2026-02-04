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
exports.registerBrowserFilesAndDownloadsCommands = registerBrowserFilesAndDownloadsCommands;
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var utils_js_1 = require("../../utils.js");
var browser_cli_shared_js_1 = require("../browser-cli-shared.js");
var shared_js_1 = require("./shared.js");
function registerBrowserFilesAndDownloadsCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("upload")
        .description("Arm file upload for the next file chooser")
        .argument("<paths...>", "File paths to upload")
        .option("--ref <ref>", "Ref id from snapshot to click after arming")
        .option("--input-ref <ref>", "Ref id for <input type=file> to set directly")
        .option("--element <selector>", "CSS selector for <input type=file>")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--timeout-ms <ms>", "How long to wait for the next file chooser (default: 120000)", function (v) { return Number(v); })
        .action(function (paths, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, timeoutMs, result, err_1;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined;
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/hooks/file-chooser",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                paths: paths,
                                ref: ((_b = opts.ref) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                inputRef: ((_c = opts.inputRef) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                element: ((_d = opts.element) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
                                targetId: ((_e = opts.targetId) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
                                timeoutMs: timeoutMs,
                            },
                        }, { timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20000 })];
                case 2:
                    result = _f.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("upload armed for ".concat(paths.length, " file(s)"));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _f.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("waitfordownload")
        .description("Wait for the next download (and save it)")
        .argument("[path]", "Save path (default: /tmp/openclaw/downloads/...)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--timeout-ms <ms>", "How long to wait for the next download (default: 120000)", function (v) { return Number(v); })
        .action(function (outPath, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, timeoutMs, result, err_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined;
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/wait/download",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                path: (outPath === null || outPath === void 0 ? void 0 : outPath.trim()) || undefined,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                timeoutMs: timeoutMs,
                            },
                        }, { timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20000 })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("downloaded: ".concat((0, utils_js_1.shortenHomePath)(result.download.path)));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("download")
        .description("Click a ref and save the resulting download")
        .argument("<ref>", "Ref id from snapshot to click")
        .argument("<path>", "Save path")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--timeout-ms <ms>", "How long to wait for the download to start (default: 120000)", function (v) { return Number(v); })
        .action(function (ref, outPath, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, timeoutMs, result, err_3;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined;
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/download",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                ref: ref,
                                path: outPath,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                timeoutMs: timeoutMs,
                            },
                        }, { timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20000 })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("downloaded: ".concat((0, utils_js_1.shortenHomePath)(result.download.path)));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("dialog")
        .description("Arm the next modal dialog (alert/confirm/prompt)")
        .option("--accept", "Accept the dialog", false)
        .option("--dismiss", "Dismiss the dialog", false)
        .option("--prompt <text>", "Prompt response text")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--timeout-ms <ms>", "How long to wait for the next dialog (default: 120000)", function (v) { return Number(v); })
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, accept, timeoutMs, result, err_4;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    accept = opts.accept ? true : opts.dismiss ? false : undefined;
                    if (accept === undefined) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Specify --accept or --dismiss"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined;
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "POST",
                            path: "/hooks/dialog",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                accept: accept,
                                promptText: ((_b = opts.prompt) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                targetId: ((_c = opts.targetId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                timeoutMs: timeoutMs,
                            },
                        }, { timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : 20000 })];
                case 2:
                    result = _d.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("dialog armed");
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _d.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_4)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
