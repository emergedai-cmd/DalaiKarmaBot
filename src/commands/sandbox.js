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
exports.sandboxListCommand = sandboxListCommand;
exports.sandboxRecreateCommand = sandboxRecreateCommand;
var prompts_1 = require("@clack/prompts");
var sandbox_js_1 = require("../agents/sandbox.js");
var sandbox_display_js_1 = require("./sandbox-display.js");
// --- List Command ---
function sandboxListCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var containers, _a, browsers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!opts.browser) return [3 /*break*/, 1];
                    _a = [];
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, sandbox_js_1.listSandboxContainers)().catch(function () { return []; })];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    containers = _a;
                    if (!opts.browser) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, sandbox_js_1.listSandboxBrowsers)().catch(function () { return []; })];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = [];
                    _c.label = 6;
                case 6:
                    browsers = _b;
                    if (opts.json) {
                        runtime.log(JSON.stringify({ containers: containers, browsers: browsers }, null, 2));
                        return [2 /*return*/];
                    }
                    if (opts.browser) {
                        (0, sandbox_display_js_1.displayBrowsers)(browsers, runtime);
                    }
                    else {
                        (0, sandbox_display_js_1.displayContainers)(containers, runtime);
                    }
                    (0, sandbox_display_js_1.displaySummary)(containers, browsers, runtime);
                    return [2 /*return*/];
            }
        });
    });
}
// --- Recreate Command ---
function sandboxRecreateCommand(opts, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var filtered, _a, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!validateRecreateOptions(opts, runtime)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetchAndFilterContainers(opts)];
                case 1:
                    filtered = _b.sent();
                    if (filtered.containers.length + filtered.browsers.length === 0) {
                        runtime.log("No containers found matching the criteria.");
                        return [2 /*return*/];
                    }
                    (0, sandbox_display_js_1.displayRecreatePreview)(filtered.containers, filtered.browsers, runtime);
                    _a = !opts.force;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, confirmRecreate()];
                case 2:
                    _a = !(_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        runtime.log("Cancelled.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, removeContainers(filtered, runtime)];
                case 4:
                    result = _b.sent();
                    (0, sandbox_display_js_1.displayRecreateResult)(result, runtime);
                    if (result.failCount > 0) {
                        runtime.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// --- Validation ---
function validateRecreateOptions(opts, runtime) {
    if (!opts.all && !opts.session && !opts.agent) {
        runtime.error("Please specify --all, --session <key>, or --agent <id>");
        runtime.exit(1);
        return false;
    }
    var exclusiveCount = [opts.all, opts.session, opts.agent].filter(Boolean).length;
    if (exclusiveCount > 1) {
        runtime.error("Please specify only one of: --all, --session, --agent");
        runtime.exit(1);
        return false;
    }
    return true;
}
// --- Filtering ---
function fetchAndFilterContainers(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var allContainers, allBrowsers, containers, browsers, matchesAgent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sandbox_js_1.listSandboxContainers)().catch(function () { return []; })];
                case 1:
                    allContainers = _a.sent();
                    return [4 /*yield*/, (0, sandbox_js_1.listSandboxBrowsers)().catch(function () { return []; })];
                case 2:
                    allBrowsers = _a.sent();
                    containers = opts.browser ? [] : allContainers;
                    browsers = opts.browser ? allBrowsers : [];
                    if (opts.session) {
                        containers = containers.filter(function (c) { return c.sessionKey === opts.session; });
                        browsers = browsers.filter(function (b) { return b.sessionKey === opts.session; });
                    }
                    else if (opts.agent) {
                        matchesAgent = createAgentMatcher(opts.agent);
                        containers = containers.filter(matchesAgent);
                        browsers = browsers.filter(matchesAgent);
                    }
                    return [2 /*return*/, { containers: containers, browsers: browsers }];
            }
        });
    });
}
function createAgentMatcher(agentId) {
    var agentPrefix = "agent:".concat(agentId);
    return function (item) {
        return item.sessionKey === agentPrefix || item.sessionKey.startsWith("".concat(agentPrefix, ":"));
    };
}
// --- Container Operations ---
function confirmRecreate() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.confirm)({
                        message: "This will stop and remove these containers. Continue?",
                        initialValue: false,
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result !== false && result !== Symbol.for("clack:cancel")];
            }
        });
    });
}
function removeContainers(filtered, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var successCount, failCount, _i, _a, container, result, _b, _c, browser, result;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    runtime.log("\nRemoving containers...\n");
                    successCount = 0;
                    failCount = 0;
                    _i = 0, _a = filtered.containers;
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    container = _a[_i];
                    return [4 /*yield*/, removeContainer(container.containerName, sandbox_js_1.removeSandboxContainer, runtime)];
                case 2:
                    result = _d.sent();
                    if (result.success) {
                        successCount++;
                    }
                    else {
                        failCount++;
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _b = 0, _c = filtered.browsers;
                    _d.label = 5;
                case 5:
                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                    browser = _c[_b];
                    return [4 /*yield*/, removeContainer(browser.containerName, sandbox_js_1.removeSandboxBrowserContainer, runtime)];
                case 6:
                    result = _d.sent();
                    if (result.success) {
                        successCount++;
                    }
                    else {
                        failCount++;
                    }
                    _d.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, { successCount: successCount, failCount: failCount }];
            }
        });
    });
}
function removeContainer(containerName, removeFn, runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, removeFn(containerName)];
                case 1:
                    _a.sent();
                    runtime.log("\u2713 Removed ".concat(containerName));
                    return [2 /*return*/, { success: true }];
                case 2:
                    err_1 = _a.sent();
                    runtime.error("\u2717 Failed to remove ".concat(containerName, ": ").concat(String(err_1)));
                    return [2 /*return*/, { success: false }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
