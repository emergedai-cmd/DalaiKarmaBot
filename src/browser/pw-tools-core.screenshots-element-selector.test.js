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
    (0, vitest_1.it)("screenshots an element selector", function () { return __awaiter(void 0, void 0, void 0, function () {
        var elementScreenshot, mod, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    elementScreenshot = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, Buffer.from("E")];
                    }); }); });
                    currentPage = {
                        locator: vitest_1.vi.fn(function () { return ({
                            first: function () { return ({ screenshot: elementScreenshot }); },
                        }); }),
                        screenshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("P")];
                        }); }); }),
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.takeScreenshotViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            element: "#main",
                            type: "png",
                        })];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.buffer.toString()).toBe("E");
                    (0, vitest_1.expect)(sessionMocks.getPageForTargetId).toHaveBeenCalled();
                    (0, vitest_1.expect)(currentPage.locator).toHaveBeenCalledWith("#main");
                    (0, vitest_1.expect)(elementScreenshot).toHaveBeenCalledWith({ type: "png" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("screenshots a ref locator", function () { return __awaiter(void 0, void 0, void 0, function () {
        var refScreenshot, mod, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refScreenshot = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, Buffer.from("R")];
                    }); }); });
                    currentRefLocator = { screenshot: refScreenshot };
                    currentPage = {
                        locator: vitest_1.vi.fn(),
                        screenshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("P")];
                        }); }); }),
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.takeScreenshotViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            ref: "76",
                            type: "jpeg",
                        })];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.buffer.toString()).toBe("R");
                    (0, vitest_1.expect)(sessionMocks.refLocator).toHaveBeenCalledWith(currentPage, "76");
                    (0, vitest_1.expect)(refScreenshot).toHaveBeenCalledWith({ type: "jpeg" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects fullPage for element or ref screenshots", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentRefLocator = { screenshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("R")];
                        }); }); }) };
                    currentPage = {
                        locator: vitest_1.vi.fn(function () { return ({
                            first: function () { return ({ screenshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, Buffer.from("E")];
                                }); }); }) }); },
                        }); }),
                        screenshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, Buffer.from("P")];
                        }); }); }),
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(mod.takeScreenshotViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            element: "#x",
                            fullPage: true,
                        })).rejects.toThrow(/fullPage is not supported/i)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(mod.takeScreenshotViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            targetId: "T1",
                            ref: "1",
                            fullPage: true,
                        })).rejects.toThrow(/fullPage is not supported/i)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("arms the next file chooser and sets files (default timeout)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fileChooser, waitForEvent, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileChooser = { setFiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) };
                    waitForEvent = vitest_1.vi.fn(function (_event, _opts) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fileChooser];
                    }); }); });
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
                            targetId: "T1",
                            paths: ["/tmp/a.txt"],
                        })];
                case 2:
                    _a.sent();
                    // waitForEvent is awaited immediately; handler continues async.
                    return [4 /*yield*/, Promise.resolve()];
                case 3:
                    // waitForEvent is awaited immediately; handler continues async.
                    _a.sent();
                    (0, vitest_1.expect)(waitForEvent).toHaveBeenCalledWith("filechooser", {
                        timeout: 120000,
                    });
                    (0, vitest_1.expect)(fileChooser.setFiles).toHaveBeenCalledWith(["/tmp/a.txt"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("arms the next file chooser and escapes if no paths provided", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fileChooser, press, waitForEvent, mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileChooser = { setFiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); }) };
                    press = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    waitForEvent = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fileChooser];
                    }); }); });
                    currentPage = {
                        waitForEvent: waitForEvent,
                        keyboard: { press: press },
                    };
                    return [4 /*yield*/, importModule()];
                case 1:
                    mod = _a.sent();
                    return [4 /*yield*/, mod.armFileUploadViaPlaywright({
                            cdpUrl: "http://127.0.0.1:18792",
                            paths: [],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(fileChooser.setFiles).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(press).toHaveBeenCalledWith("Escape");
                    return [2 /*return*/];
            }
        });
    }); });
});
