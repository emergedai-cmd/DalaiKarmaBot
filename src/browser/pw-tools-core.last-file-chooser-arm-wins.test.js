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
var vitest_1 = require("vitest");
var currentPage = null;
var currentRefLocator = null;
var pageState;
var sessionMocks = vitest_1.vi.hoisted(function () { return ({
    getPageForTargetId: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!currentPage) {
                throw new Error("missing page");
            }
            return [2 /*return*/, currentPage];
        });
    }); }),
    ensurePageState: vitest_1.vi.fn(function () { return pageState; }),
    restoreRoleRefsForTarget: vitest_1.vi.fn(function () { }),
    refLocator: vitest_1.vi.fn(function () {
        if (!currentRefLocator) {
            throw new Error("missing locator");
        }
        return currentRefLocator;
    }),
    rememberRoleRefsForTarget: vitest_1.vi.fn(function () { }),
}); });
vitest_1.vi.mock("./pw-session.js", function () { return sessionMocks; });
function importModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./pw-tools-core.js"); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
(0, vitest_1.describe)("pw-tools-core", function () {
    (0, vitest_1.beforeEach)(function () {
        currentPage = null;
        currentRefLocator = null;
        pageState = {
            console: [],
            armIdUpload: 0,
            armIdDialog: 0,
            armIdDownload: 0,
        };
        for (var _i = 0, _a = Object.values(sessionMocks); _i < _a.length; _i++) {
            var fn = _a[_i];
            fn.mockClear();
        }
    });
    (0, vitest_1.it)("last file-chooser arm wins", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolve1, resolve2, fc1, fc2, waitForEvent, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolve1 = null;
                    resolve2 = null;
                    fc1 = { setFiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) };
                    fc2 = { setFiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) };
                    waitForEvent = vitest_1.vi
                        .fn()
                        .mockImplementationOnce(function () {
                        return new Promise(function (r) {
                            resolve1 = r;
                        });
                    })
                        .mockImplementationOnce(function () {
                        return new Promise(function (r) {
                            resolve2 = r;
                        });
                    });
                    currentPage = {
                        waitForEvent: waitForEvent,
                        keyboard: { press: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/];
                            }); }); }) },
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.armFileUploadViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            paths: ["/tmp/1"],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, mod.armFileUploadViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            paths: ["/tmp/2"],
                        })];
                case 3:
                    _a.sent();
                    resolve1 === null || resolve1 === void 0 ? void 0 : resolve1(fc1);
                    resolve2 === null || resolve2 === void 0 ? void 0 : resolve2(fc2);
                    return [4 /*yield*/, Promise.resolve()];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(fc1.setFiles).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(fc2.setFiles).toHaveBeenCalledWith(["/tmp/2"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("arms the next dialog and accepts/dismisses (default timeout)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var accept, dismiss, dialog, waitForEvent, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accept = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    dismiss = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    dialog = { accept: accept, dismiss: dismiss };
                    waitForEvent = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, dialog];
                    }); }); });
                    currentPage = {
                        waitForEvent: waitForEvent,
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.armDialogViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            accept: true,
                            promptText: "x",
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(waitForEvent).toHaveBeenCalledWith("dialog", { timeout: 120000 });
                    (0, vitest_1.expect)(accept).toHaveBeenCalledWith("x");
                    (0, vitest_1.expect)(dismiss).not.toHaveBeenCalled();
                    accept.mockClear();
                    dismiss.mockClear();
                    waitForEvent.mockClear();
                    return [4 /*yield*/, mod.armDialogViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            accept: false,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(waitForEvent).toHaveBeenCalledWith("dialog", { timeout: 120000 });
                    (0, vitest_1.expect)(dismiss).toHaveBeenCalled();
                    (0, vitest_1.expect)(accept).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("waits for selector, url, load state, and function", function () { return __awaiter(void 0, void 0, void 0, function () {
        var waitForSelector, waitForURL, waitForLoadState, waitForFunction, waitForTimeout, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitForSelector = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    waitForURL = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    waitForLoadState = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    waitForFunction = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    waitForTimeout = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    currentPage = {
                        locator: vitest_1.vi.fn(function () { return ({
                            first: function () { return ({ waitFor: waitForSelector }); },
                        }); }),
                        waitForURL: waitForURL,
                        waitForLoadState: waitForLoadState,
                        waitForFunction: waitForFunction,
                        waitForTimeout: waitForTimeout,
                        getByText: vitest_1.vi.fn(function () { return ({ first: function () { return ({ waitFor: vitest_1.vi.fn() }); } }); }),
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.waitForViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            selector: "#main",
                            url: "**/dash",
                            loadState: "networkidle",
                            fn: "window.ready===true",
                            timeoutMs: 1234,
                            timeMs: 50,
                        })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(waitForTimeout).toHaveBeenCalledWith(50);
                    (0, vitest_1.expect)(currentPage.locator).toHaveBeenCalledWith("#main");
                    (0, vitest_1.expect)(waitForSelector).toHaveBeenCalledWith({
                        state: "visible",
                        timeout: 1234,
                    });
                    (0, vitest_1.expect)(waitForURL).toHaveBeenCalledWith("**/dash", { timeout: 1234 });
                    (0, vitest_1.expect)(waitForLoadState).toHaveBeenCalledWith("networkidle", {
                        timeout: 1234,
                    });
                    (0, vitest_1.expect)(waitForFunction).toHaveBeenCalledWith("window.ready===true", {
                        timeout: 1234,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
