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
exports.registerBrowserFormWaitEvalCommands = registerBrowserFormWaitEvalCommands;
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var shared_js_1 = require("./shared.js");
function registerBrowserFormWaitEvalCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("fill")
        .description("Fill a form with JSON field descriptors")
        .option("--fields <json>", "JSON array of field objects")
        .option("--fields-file <path>", "Read JSON array from a file")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, fields, result, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, shared_js_1.readFields)({
                            fields: opts.fields,
                            fieldsFile: opts.fieldsFile,
                        })];
                case 2:
                    fields = _c.sent();
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "fill",
                                fields: fields,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            },
                        })];
                case 3:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("filled ".concat(fields.length, " field(s)"));
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("wait")
        .description("Wait for time, selector, URL, load state, or JS conditions")
        .argument("[selector]", "CSS selector to wait for (visible)")
        .option("--time <ms>", "Wait for N milliseconds", function (v) { return Number(v); })
        .option("--text <value>", "Wait for text to appear")
        .option("--text-gone <value>", "Wait for text to disappear")
        .option("--url <pattern>", "Wait for URL (supports globs like **/dash)")
        .option("--load <load|domcontentloaded|networkidle>", "Wait for load state")
        .option("--fn <js>", "Wait for JS condition (passed to waitForFunction)")
        .option("--timeout-ms <ms>", "How long to wait for each condition (default: 20000)", function (v) { return Number(v); })
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (selector, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, sel, load, timeoutMs, result, err_2;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    sel = (selector === null || selector === void 0 ? void 0 : selector.trim()) || undefined;
                    load = opts.load === "load" || opts.load === "domcontentloaded" || opts.load === "networkidle"
                        ? opts.load
                        : undefined;
                    timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined;
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "wait",
                                timeMs: Number.isFinite(opts.time) ? opts.time : undefined,
                                text: ((_b = opts.text) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                textGone: ((_c = opts.textGone) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                selector: sel,
                                url: ((_d = opts.url) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
                                loadState: load,
                                fn: ((_e = opts.fn) === null || _e === void 0 ? void 0 : _e.trim()) || undefined,
                                targetId: ((_f = opts.targetId) === null || _f === void 0 ? void 0 : _f.trim()) || undefined,
                                timeoutMs: timeoutMs,
                            },
                            timeoutMs: timeoutMs,
                        })];
                case 2:
                    result = _g.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("wait complete");
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _g.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_2)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("evaluate")
        .description("Evaluate a function against the page or a ref")
        .option("--fn <code>", "Function source, e.g. (el) => el.textContent")
        .option("--ref <id>", "Ref from snapshot")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, result, err_3;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    if (!opts.fn) {
                        runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)("Missing --fn"));
                        runtime_js_1.defaultRuntime.exit(1);
                        return [2 /*return*/];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "evaluate",
                                fn: opts.fn,
                                ref: ((_b = opts.ref) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                targetId: ((_c = opts.targetId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                            },
                        })];
                case 2:
                    result = _e.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log(JSON.stringify((_d = result.result) !== null && _d !== void 0 ? _d : null, null, 2));
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _e.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_3)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
