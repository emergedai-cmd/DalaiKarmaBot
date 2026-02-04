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
exports.installChromeExtension = installChromeExtension;
exports.registerBrowserExtensionCommands = registerBrowserExtensionCommands;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var trash_js_1 = require("../browser/trash.js");
var paths_js_1 = require("../config/paths.js");
var globals_js_1 = require("../globals.js");
var clipboard_js_1 = require("../infra/clipboard.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var utils_js_1 = require("../utils.js");
var command_format_js_1 = require("./command-format.js");
function bundledExtensionRootDir() {
    var here = node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url));
    return node_path_1.default.resolve(here, "../../assets/chrome-extension");
}
function installedExtensionRootDir() {
    return node_path_1.default.join(paths_js_1.STATE_DIR, "browser", "chrome-extension");
}
function hasManifest(dir) {
    return node_fs_1.default.existsSync(node_path_1.default.join(dir, "manifest.json"));
}
function installChromeExtension(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var src, stateDir, dest;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    src = (_a = opts === null || opts === void 0 ? void 0 : opts.sourceDir) !== null && _a !== void 0 ? _a : bundledExtensionRootDir();
                    if (!hasManifest(src)) {
                        throw new Error("Bundled Chrome extension is missing. Reinstall OpenClaw and try again.");
                    }
                    stateDir = (_b = opts === null || opts === void 0 ? void 0 : opts.stateDir) !== null && _b !== void 0 ? _b : paths_js_1.STATE_DIR;
                    dest = node_path_1.default.join(stateDir, "browser", "chrome-extension");
                    node_fs_1.default.mkdirSync(node_path_1.default.dirname(dest), { recursive: true });
                    if (!node_fs_1.default.existsSync(dest)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, trash_js_1.movePathToTrash)(dest).catch(function () {
                            var backup = "".concat(dest, ".old-").concat(Date.now());
                            node_fs_1.default.renameSync(dest, backup);
                        })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2: return [4 /*yield*/, node_fs_1.default.promises.cp(src, dest, { recursive: true })];
                case 3:
                    _c.sent();
                    if (!hasManifest(dest)) {
                        throw new Error("Chrome extension install failed (manifest.json missing). Try again.");
                    }
                    return [2 /*return*/, { path: dest }];
            }
        });
    });
}
function registerBrowserExtensionCommands(browser, parentOpts) {
    var _this = this;
    var ext = browser.command("extension").description("Chrome extension helpers");
    ext
        .command("install")
        .description("Install the Chrome extension to a stable local path")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, installed, err_1, displayPath, copied;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, installChromeExtension()];
                case 2:
                    installed = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4:
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify({ ok: true, path: installed.path }, null, 2));
                        return [2 /*return*/];
                    }
                    displayPath = (0, utils_js_1.shortenHomePath)(installed.path);
                    runtime_js_1.defaultRuntime.log(displayPath);
                    return [4 /*yield*/, (0, clipboard_js_1.copyToClipboard)(installed.path).catch(function () { return false; })];
                case 5:
                    copied = _a.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.info)([
                        copied ? "Copied to clipboard." : "Copy to clipboard unavailable.",
                        "Next:",
                        "- Chrome \u2192 chrome://extensions \u2192 enable \u201CDeveloper mode\u201D",
                        "- \u201CLoad unpacked\u201D \u2192 select: ".concat(displayPath),
                        "- Pin \u201COpenClaw Browser Relay\u201D, then click it on the tab (badge shows ON)",
                        "",
                        "".concat(theme_js_1.theme.muted("Docs:"), " ").concat((0, links_js_1.formatDocsLink)("/tools/chrome-extension", "docs.openclaw.ai/tools/chrome-extension")),
                    ].join("\n")));
                    return [2 /*return*/];
            }
        });
    }); });
    ext
        .command("path")
        .description("Print the path to the installed Chrome extension (load unpacked)")
        .action(function (_opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, dir, displayPath, copied;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = parentOpts(cmd);
                    dir = installedExtensionRootDir();
                    if (!hasManifest(dir)) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)([
                            "Chrome extension is not installed. Run: \"".concat((0, command_format_js_1.formatCliCommand)("openclaw browser extension install"), "\""),
                            "Docs: ".concat((0, links_js_1.formatDocsLink)("/tools/chrome-extension", "docs.openclaw.ai/tools/chrome-extension")),
                        ].join("\n")));
                        runtime_js_1.defaultRuntime.exit(1);
                    }
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify({ path: dir }, null, 2));
                        return [2 /*return*/];
                    }
                    displayPath = (0, utils_js_1.shortenHomePath)(dir);
                    runtime_js_1.defaultRuntime.log(displayPath);
                    return [4 /*yield*/, (0, clipboard_js_1.copyToClipboard)(dir).catch(function () { return false; })];
                case 1:
                    copied = _a.sent();
                    if (copied) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.info)("Copied to clipboard."));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
