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
exports.createLocalShellRunner = createLocalShellRunner;
var node_child_process_1 = require("node:child_process");
var selectors_js_1 = require("./components/selectors.js");
function createLocalShellRunner(deps) {
    var _this = this;
    var _a, _b, _c, _d, _e;
    var localExecAsked = false;
    var localExecAllowed = false;
    var createSelector = (_a = deps.createSelector) !== null && _a !== void 0 ? _a : selectors_js_1.createSearchableSelectList;
    var spawnCommand = (_b = deps.spawnCommand) !== null && _b !== void 0 ? _b : node_child_process_1.spawn;
    var getCwd = (_c = deps.getCwd) !== null && _c !== void 0 ? _c : (function () { return process.cwd(); });
    var env = (_d = deps.env) !== null && _d !== void 0 ? _d : process.env;
    var maxChars = (_e = deps.maxOutputChars) !== null && _e !== void 0 ? _e : 40000;
    var ensureLocalExecAllowed = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (localExecAllowed) {
                        return [2 /*return*/, true];
                    }
                    if (localExecAsked) {
                        return [2 /*return*/, false];
                    }
                    localExecAsked = true;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            deps.chatLog.addSystem("Allow local shell commands for this session?");
                            deps.chatLog.addSystem("This runs commands on YOUR machine (not the gateway) and may delete files or reveal secrets.");
                            deps.chatLog.addSystem("Select Yes/No (arrows + Enter), Esc to cancel.");
                            var selector = createSelector([
                                { value: "no", label: "No" },
                                { value: "yes", label: "Yes" },
                            ], 2);
                            selector.onSelect = function (item) {
                                deps.closeOverlay();
                                if (item.value === "yes") {
                                    localExecAllowed = true;
                                    deps.chatLog.addSystem("local shell: enabled for this session");
                                    resolve(true);
                                }
                                else {
                                    deps.chatLog.addSystem("local shell: not enabled");
                                    resolve(false);
                                }
                                deps.tui.requestRender();
                            };
                            selector.onCancel = function () {
                                deps.closeOverlay();
                                deps.chatLog.addSystem("local shell: cancelled");
                                deps.tui.requestRender();
                                resolve(false);
                            };
                            deps.openOverlay(selector);
                            deps.tui.requestRender();
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var runLocalShellLine = function (line) { return __awaiter(_this, void 0, void 0, function () {
        var cmd, allowed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cmd = line.slice(1);
                    // NOTE: A lone '!' is handled by the submit handler as a normal message.
                    // Keep this guard anyway in case this is called directly.
                    if (cmd === "") {
                        return [2 /*return*/];
                    }
                    if (localExecAsked && !localExecAllowed) {
                        deps.chatLog.addSystem("local shell: not enabled for this session");
                        deps.tui.requestRender();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ensureLocalExecAllowed()];
                case 1:
                    allowed = _a.sent();
                    if (!allowed) {
                        return [2 /*return*/];
                    }
                    deps.chatLog.addSystem("[local] $ ".concat(cmd));
                    deps.tui.requestRender();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            var child = spawnCommand(cmd, {
                                shell: true,
                                cwd: getCwd(),
                                env: env,
                            });
                            var stdout = "";
                            var stderr = "";
                            child.stdout.on("data", function (buf) {
                                stdout += buf.toString("utf8");
                            });
                            child.stderr.on("data", function (buf) {
                                stderr += buf.toString("utf8");
                            });
                            child.on("close", function (code, signal) {
                                var combined = (stdout + (stderr ? (stdout ? "\n" : "") + stderr : ""))
                                    .slice(0, maxChars)
                                    .trimEnd();
                                if (combined) {
                                    for (var _i = 0, _a = combined.split("\n"); _i < _a.length; _i++) {
                                        var line_1 = _a[_i];
                                        deps.chatLog.addSystem("[local] ".concat(line_1));
                                    }
                                }
                                deps.chatLog.addSystem("[local] exit ".concat(code !== null && code !== void 0 ? code : "?").concat(signal ? " (signal ".concat(String(signal), ")") : ""));
                                deps.tui.requestRender();
                                resolve();
                            });
                            child.on("error", function (err) {
                                deps.chatLog.addSystem("[local] error: ".concat(String(err)));
                                deps.tui.requestRender();
                                resolve();
                            });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { runLocalShellLine: runLocalShellLine };
}
