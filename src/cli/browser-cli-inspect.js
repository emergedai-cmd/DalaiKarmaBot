"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.registerBrowserInspectCommands = registerBrowserInspectCommands;
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var runtime_js_1 = require("../runtime.js");
var utils_js_1 = require("../utils.js");
var browser_cli_shared_js_1 = require("./browser-cli-shared.js");
function registerBrowserInspectCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("screenshot")
        .description("Capture a screenshot (MEDIA:<path>)")
        .argument("[targetId]", "CDP target id (or unique prefix)")
        .option("--full-page", "Capture full scrollable page", false)
        .option("--ref <ref>", "ARIA ref from ai snapshot")
        .option("--element <selector>", "CSS selector for element screenshot")
        .option("--type <png|jpeg>", "Output type (default: png)", "png")
        .action(function (targetId, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
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
                            method: "POST",
                            path: "/screenshot",
                            query: profile ? { profile: profile } : undefined,
                            body: {
                                targetId: (targetId === null || targetId === void 0 ? void 0 : targetId.trim()) || undefined,
                                fullPage: Boolean(opts.fullPage),
                                ref: ((_a = opts.ref) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                element: ((_b = opts.element) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                type: opts.type === "jpeg" ? "jpeg" : "png",
                            },
                        }, { timeoutMs: 20000 })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("MEDIA:".concat((0, utils_js_1.shortenHomePath)(result.path)));
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
    browser
        .command("snapshot")
        .description("Capture a snapshot (default: ai; aria is the accessibility tree)")
        .option("--format <aria|ai>", "Snapshot format (default: ai)", "ai")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--limit <n>", "Max nodes (default: 500/800)", function (v) { return Number(v); })
        .option("--mode <efficient>", "Snapshot preset (efficient)")
        .option("--efficient", "Use the efficient snapshot preset", false)
        .option("--interactive", "Role snapshot: interactive elements only", false)
        .option("--compact", "Role snapshot: compact output", false)
        .option("--depth <n>", "Role snapshot: max depth", function (v) { return Number(v); })
        .option("--selector <sel>", "Role snapshot: scope to CSS selector")
        .option("--frame <sel>", "Role snapshot: scope to an iframe selector")
        .option("--labels", "Include viewport label overlay screenshot", false)
        .option("--out <path>", "Write snapshot to a file")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var parent, profile, format, configMode, mode, query, result, fs, payload, nodes, err_2;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    parent = parentOpts(cmd);
                    profile = parent === null || parent === void 0 ? void 0 : parent.browserProfile;
                    format = opts.format === "aria" ? "aria" : "ai";
                    configMode = format === "ai" && ((_b = (_a = (0, config_js_1.loadConfig)().browser) === null || _a === void 0 ? void 0 : _a.snapshotDefaults) === null || _b === void 0 ? void 0 : _b.mode) === "efficient"
                        ? "efficient"
                        : undefined;
                    mode = opts.efficient === true || opts.mode === "efficient" ? "efficient" : configMode;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 9, , 10]);
                    query = {
                        format: format,
                        targetId: ((_c = opts.targetId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                        limit: Number.isFinite(opts.limit) ? opts.limit : undefined,
                        interactive: opts.interactive ? true : undefined,
                        compact: opts.compact ? true : undefined,
                        depth: Number.isFinite(opts.depth) ? opts.depth : undefined,
                        selector: ((_d = opts.selector) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
                        frame: ((_e = opts.frame) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
                        labels: opts.labels ? true : undefined,
                        mode: mode,
                        profile: profile,
                    };
                    return [4 /*yield*/, (0, browser_cli_shared_js_1.callBrowserRequest)(parent, {
                            method: "GET",
                            path: "/snapshot",
                            query: query,
                        }, { timeoutMs: 20000 })];
                case 2:
                    result = _f.sent();
                    if (!opts.out) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("node:fs/promises"); })];
                case 3:
                    fs = _f.sent();
                    if (!(result.format === "ai")) return [3 /*break*/, 5];
                    return [4 /*yield*/, fs.writeFile(opts.out, result.snapshot, "utf8")];
                case 4:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 5:
                    payload = JSON.stringify(result, null, 2);
                    return [4 /*yield*/, fs.writeFile(opts.out, payload, "utf8")];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7:
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(__assign({ ok: true, out: opts.out }, (result.format === "ai" && result.imagePath
                            ? { imagePath: result.imagePath }
                            : {})), null, 2));
                    }
                    else {
                        runtime_js_1.defaultRuntime.log((0, utils_js_1.shortenHomePath)(opts.out));
                        if (result.format === "ai" && result.imagePath) {
                            runtime_js_1.defaultRuntime.log("MEDIA:".concat((0, utils_js_1.shortenHomePath)(result.imagePath)));
                        }
                    }
                    return [2 /*return*/];
                case 8:
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    if (result.format === "ai") {
                        runtime_js_1.defaultRuntime.log(result.snapshot);
                        if (result.imagePath) {
                            runtime_js_1.defaultRuntime.log("MEDIA:".concat((0, utils_js_1.shortenHomePath)(result.imagePath)));
                        }
                        return [2 /*return*/];
                    }
                    nodes = "nodes" in result ? result.nodes : [];
                    runtime_js_1.defaultRuntime.log(nodes
                        .map(function (n) {
                        var indent = "  ".repeat(Math.min(20, n.depth));
                        var name = n.name ? " \"".concat(n.name, "\"") : "";
                        var value = n.value ? " = \"".concat(n.value, "\"") : "";
                        return "".concat(indent, "- ").concat(n.role).concat(name).concat(value);
                    })
                        .join("\n"));
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _f.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
}
