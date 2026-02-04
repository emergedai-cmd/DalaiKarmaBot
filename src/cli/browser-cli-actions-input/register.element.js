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
exports.registerBrowserElementCommands = registerBrowserElementCommands;
var globals_js_1 = require("../../globals.js");
var runtime_js_1 = require("../../runtime.js");
var shared_js_1 = require("./shared.js");
function registerBrowserElementCommands(browser, parentOpts) {
    var _this = this;
    browser
        .command("click")
        .description("Click an element by ref from snapshot")
        .argument("<ref>", "Ref id from snapshot")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--double", "Double click", false)
        .option("--button <left|right|middle>", "Mouse button to use")
        .option("--modifiers <list>", "Comma-separated modifiers (Shift,Alt,Meta)")
        .action(function (ref, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, refValue, modifiers, result, suffix, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    refValue = (0, shared_js_1.requireRef)(ref);
                    if (!refValue) {
                        return [2 /*return*/];
                    }
                    modifiers = opts.modifiers
                        ? String(opts.modifiers)
                            .split(",")
                            .map(function (v) { return v.trim(); })
                            .filter(Boolean)
                        : undefined;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "click",
                                ref: refValue,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                doubleClick: Boolean(opts.double),
                                button: ((_c = opts.button) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                modifiers: modifiers,
                            },
                        })];
                case 2:
                    result = _d.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    suffix = result.url ? " on ".concat(result.url) : "";
                    runtime_js_1.defaultRuntime.log("clicked ref ".concat(refValue).concat(suffix));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_1)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("type")
        .description("Type into an element by ref from snapshot")
        .argument("<ref>", "Ref id from snapshot")
        .argument("<text>", "Text to type")
        .option("--submit", "Press Enter after typing", false)
        .option("--slowly", "Type slowly (human-like)", false)
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (ref, text, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, refValue, result, err_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    refValue = (0, shared_js_1.requireRef)(ref);
                    if (!refValue) {
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "type",
                                ref: refValue,
                                text: text,
                                submit: Boolean(opts.submit),
                                slowly: Boolean(opts.slowly),
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            },
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("typed into ref ".concat(refValue));
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
        .command("press")
        .description("Press a key")
        .argument("<key>", "Key to press (e.g. Enter)")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (key, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, result, err_3;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: { kind: "press", key: key, targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined },
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("pressed ".concat(key));
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
        .command("hover")
        .description("Hover an element by ai ref")
        .argument("<ref>", "Ref id from snapshot")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (ref, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, result, err_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: { kind: "hover", ref: ref, targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined },
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("hovered ref ".concat(ref));
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
    browser
        .command("scrollintoview")
        .description("Scroll an element into view by ref from snapshot")
        .argument("<ref>", "Ref id from snapshot")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .option("--timeout-ms <ms>", "How long to wait for scroll (default: 20000)", function (v) {
        return Number(v);
    })
        .action(function (ref, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, refValue, result, err_5;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    refValue = (0, shared_js_1.requireRef)(ref);
                    if (!refValue) {
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "scrollIntoView",
                                ref: refValue,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                timeoutMs: Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined,
                            },
                            timeoutMs: Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : undefined,
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("scrolled into view: ".concat(refValue));
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_5)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("drag")
        .description("Drag from one ref to another")
        .argument("<startRef>", "Start ref id")
        .argument("<endRef>", "End ref id")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (startRef, endRef, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, result, err_6;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "drag",
                                startRef: startRef,
                                endRef: endRef,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            },
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("dragged ".concat(startRef, " \u2192 ").concat(endRef));
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_6)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    browser
        .command("select")
        .description("Select option(s) in a select element")
        .argument("<ref>", "Ref id from snapshot")
        .argument("<values...>", "Option values to select")
        .option("--target-id <id>", "CDP target id (or unique prefix)")
        .action(function (ref, values, opts, cmd) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parent, profile, result, err_7;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, shared_js_1.resolveBrowserActionContext)(cmd, parentOpts), parent = _a.parent, profile = _a.profile;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, shared_js_1.callBrowserAct)({
                            parent: parent,
                            profile: profile,
                            body: {
                                kind: "select",
                                ref: ref,
                                values: values,
                                targetId: ((_b = opts.targetId) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            },
                        })];
                case 2:
                    result = _c.sent();
                    if (parent === null || parent === void 0 ? void 0 : parent.json) {
                        runtime_js_1.defaultRuntime.log(JSON.stringify(result, null, 2));
                        return [2 /*return*/];
                    }
                    runtime_js_1.defaultRuntime.log("selected ".concat(values.join(", ")));
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _c.sent();
                    runtime_js_1.defaultRuntime.error((0, globals_js_1.danger)(String(err_7)));
                    runtime_js_1.defaultRuntime.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
